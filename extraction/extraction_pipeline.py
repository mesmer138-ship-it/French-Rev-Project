"""
Accusation extraction pipeline for the Recueil des actes du Comité de salut public.

Input:  the *.dated.jsonl files made by clean_cps.py + cps_dates.py
        (one paragraph per line, each with its own tome, view (page) and date)

Output: accepted / rejected / verified / recovered results and condensed charges,
        printed and saved as .jsonl in OUTPUT_DIR.

Stages:
    0. check the target name is a specific person; get their aliases
    1. keep only chunks whose text mentions the name or an alias;
       Gemini finds candidate sentences in each chunk (each sentence takes the
       date / tome / view of the paragraph it came from)
    2. Gemini classifies the candidates in batches (A-G)
    3. validation: drop category E and sentences that fail the grounding check
    4. majority-vote re-verification (3 votes)
    5. condense A/B accusations into short charge statements
    6. predict execution likelihood for each charge
"""
from google.genai import types
from google.colab import userdata
from google import genai
from typing import List, Literal
from pydantic import BaseModel, Field
from pathlib import Path
from collections import defaultdict
import difflib, json, re, unicodedata

# -------------- settings ------------------
# CHANGE DATE_FROM / DATE_TO FOR EVERY PERSON: DATE_TO = the person's execution/outcome date,
# so nothing written after they died is counted as a charge against them.
DATA_DIR = Path('/content/mydrive/MyDrive/clean_cps')   # folder with cps_tomeNN.dated.jsonl
TOMES = None                                           # None = all tomes, or e.g. [7, 8, 9]
#Insert date range 
DATE_FROM = "1793-04-06"
DATE_TO = "1793-11-17"
OUTPUT_DIR = Path('/content/mydrive/MyDrive/results')
CHARGE_TEMPLATES = Path('/content/mydrive/MyDrive/cleaned_charges.txt')
CHUNK_SIZE = 8000
OVERLAP_PARAS = 2
STAGE2_BATCH = 30
VOTES = 3
PCA_PATH = Path('/content/mydrive/MyDrive/fitted_pca.joblib')
CLF_PATH = Path('/content/mydrive/MyDrive/final_clf_pca.joblib')
EMBED_MODEL = 'dangvantuan/sentence-camembert-large'
REVOLUTIONARY_EPOCH = "1792-09-22"
MODEL = 'models/gemini-3.6-flash'

CATEGORIES = (
    "A = Direct accusation: text directly charges the target with a crime, misdeed, or tyrannical act\n"
    "B = Report of an accusation: references an accusation made by another person, decree, or committee\n"
    "C = Neutral factual statement: purely logistical, narrative, procedural, or non-judgemental\n"
    "D = Defense or denial: defends the target, offers alibi, counters a charge, or mitigates guilt\n"
    "E = Ambiguous/unclear: too OCR-corrupted, too fragmentary, or too context-dependent to classify\n"
    "F = Procedural action: an arrest warrant, arrest decree, or dismissal order concerning the target, "
    "with no accusatory language of its own beyond the procedural act itself\n"
    "G = Outcome stated: the sentence directly states or reports the target's execution, acquittal, "
    "release, or other final disposition/verdict\n"
)

SOCIAL_CLASSES = {0: "artisan/tradesman", 1: "clergy", 3: "femme", 4: "laborer/peasant",
                  5: "legal/administrative", 6: "merchant/bourgeois", 7: "military", 8: "nobility"}

client = genai.Client(api_key=userdata.get('GeminiKey'))


def call_model(prompt, schema, temperature=0.0, thinking=False, where=""):
    """
    One Gemini call returning parsed JSON (dict), or None on failure.
    """
    config = dict(response_schema=schema, response_mime_type="application/json", temperature=temperature)
    if not thinking:
        config["thinking_config"] = types.ThinkingConfig(thinking_budget=0)
    try:
        response = client.models.generate_content(
            model=MODEL, contents=prompt, config=types.GenerateContentConfig(**config))
        return json.loads(response.text)
    except json.JSONDecodeError as e:
        print(f"JSON decode error in {where}: {e}\nRaw (first 500 chars): {response.text[:500]}")
    except Exception as e:
        print(f"API error in {where}: {e}")
    return None


# -------------- stage 0: name check and aliases ------------------
class NameCheck(BaseModel):
    is_person: bool = Field(description=(
        "True if this name most plausibly refers to a specific individual human being "
        "in the context of the French Revolutionary period (1789-1799). False if it more plausibly "
        "refers to a place, city, organization, committee, section, abstract "
        "concept, or generic/common term."))

    is_specific_enough: bool = Field(description=(
        "True only if this name is specific enough to plausibly identify ONE individual "
        "(e.g. a full name, a distinctive surname, or a name paired with a title/epithet). "
        "False if this is a bare, extremely common first name (e.g. 'Pierre', 'Francois', "
        "'Jean', 'Marie') on its own with no surname or distinguishing detail, since many "
        "unrelated historical figures could share that first name."))

    reasoning: str = Field(description=(
        "Brief explanation covering both fields: what this name most plausibly refers to, "
        "and whether it is specific enough to identify one individual, or too generic/common "
        "a first name shared by many people in this period."))


def check_is_person(name: str) -> tuple[bool, bool, str]:
    """
    Checks that the target name (a) plausibly refers to a person and (b) is specific enough
    to identify one individual. Returns (is_person, is_specific_enough, reasoning).
    If the API call fails it returns (True, True, ...) so a failed call doesn't block the run.
    """
    prompt = (
        f"Evaluate the name '{name}' in the context of the French Revolutionary period "
        f"(1789-1799).\n\n"
        f"First, determine whether it most plausibly refers to a specific individual human "
        f"being, as opposed to a place, city, organization, committee, section or abstract concept.\n\n"
        f"Second, determine whether the name is specific enough on its own to plausibly "
        f"identify ONE individual (a full name, a distinctive surname, or a name paired with "
        f"a title/epithet) as opposed to a bare, extremely common first name "
        f"(e.g. 'Pierre', 'Francois', 'Jean', 'Marie') that many unrelated historical figures could share.\n\n"
        f"Return raw JSON matching the schema.")
    data = call_model(prompt, NameCheck, where="check_is_person")
    if not data:
        return True, True, "Could not verify, proceeding by default."
    return data.get('is_person', True), data.get('is_specific_enough', True), data.get('reasoning', '')


class AliasExtraction(BaseModel):
    target_name: str
    aliases_array: List[str] = Field(description=(
        "All alternative names, titles, and epithets that the target could be called"))


def get_aliases(target_name) -> List[str]:
    """
    Aliases for the target: a person can be named in different ways
    (e.g. Marie Antoinette is also 'ci-devant reine'). Returns a list of strings.
    """
    prompt = (
        f"List ALL alternative names, titles, and epithets that '{target_name}' could be called "
        f"in 18th century French revolutionary documents - e.g. formal titles, commonly used "
        f"nicknames, or contemporary epithets (both respectful and derogatory). "
        f"Do NOT include generic pronouns of any gender (il, elle, ils, elles, lui, vous, on, etc.). "
        f"Include only actual names/titles/epithets that are confirmed to have been used to refer to "
        f"{target_name}. Only include terms with plausible historical basis. "
        f"Do not invent embellished or fabricated names/insults. If uncertain whether a term was "
        f"actually used, omit it. AVOID GENERIC TITLES, LABELS, etc. "
        f"Return only French variants. Return raw JSON matching the schema.")
    data = call_model(prompt, AliasExtraction, where="get_aliases")
    return (data or {}).get('aliases_array', [])


# -------------- loading, pre-filtering, and chunking ------------------
def load_paragraphs():
    """
    All paragraphs in book order, each with tome/view/date and an id, filtered by DATE_FROM/DATE_TO.
    """
    rows = []
    for path in sorted(DATA_DIR.glob("cps_tome??.dated.jsonl")):
        tome = int(path.name[8:10])                     # tome number from the filename
        if TOMES and tome not in TOMES:
            continue
        for i, line in enumerate(open(path, encoding="utf-8")):
            r = json.loads(line)
            d = r["date"]
            # skip paragraphs outside the date range, and paragraphs with no date at all
            if DATE_FROM and (not d or d < DATE_FROM):
                continue
            if DATE_TO and (not d or d > DATE_TO):
                continue
            r["pid"] = f"T{r['tome']:02d}-{i}"          # id = tome + line number, used to spot duplicates
            rows.append(r)
    return rows


def edit_txt(s: str) -> str:
    """
    Lowercase and strip accents, so 'Barère' matches 'Barere' and 'BARÈRE'.
    """
    return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn")


def mention_pattern(target_name, aliases):
    """
    Regex matching the surname or any alias (accent/case-insensitive). The surname is used
    alone because the records usually name people by surname only ('Robespierre', not 'Maximilien Robespierre').
    """
    terms = {target_name, target_name.split()[-1], *aliases}            # full name, surname and aliases
    terms = {edit_txt(t).strip() for t in terms if len(t.strip()) >= 4}  # terms under 4 characters match too much
    return re.compile("|".join(re.escape(t) for t in sorted(terms, key=len, reverse=True)))


def chunk_paragraphs(rows, max_chars, overlap=2):
    """
    Consecutive whole paragraphs up to max_chars; the last `overlap` paragraphs of a chunk
    are repeated at the start of the next so nothing is cut at a boundary.
    """
    chunks, i = [], 0
    while i < len(rows):
        size, j = 0, i
        while j < len(rows) and (j == i or size + len(rows[j]["text"]) <= max_chars):
            size += len(rows[j]["text"])
            j += 1
        chunks.append(rows[i:j])
        if j >= len(rows):
            break
        i = max(j - overlap, i + 1)
    return chunks


def find_paragraph(sentence, batch):
    """
    The paragraph a returned sentence came from: exact match first, else the most similar one.
    """
    for r in batch:
        if sentence in r["text"]:
            return r
    return max(batch, key=lambda r: difflib.SequenceMatcher(None, sentence, r["text"])
               .find_longest_match(0, len(sentence), 0, len(r["text"])).size)


# -------------- stage 1: candidate sentences ------------------
class CandidateSentences(BaseModel):
    sentences: List[str] = Field(description=(
        "Every sentence (exact original French text, verbatim from the chunk) that "
        "mentions the target person by name or alias, regardless of tone. Include ALL mentions."))


def extract_candidates(chunk: str, target_name, alias_string: str) -> List[str]:
    """
    All sentences in one chunk that mention the target or an alias.
    """
    prompt = (
        f"Find every sentence in this text that mentions {target_name}, who may also appear as {alias_string}.\n"
        f"Return the EXACT original sentence text verbatim. If not mentioned, return an empty list.\n\n"
        f"Text:\n{chunk}")
    return (call_model(prompt, CandidateSentences, where="extract_candidates") or {}).get('sentences', [])


# -------------- stage 2: classification ------------------
class SingleSentenceAnalysis(BaseModel):
    candidate_id: str = Field(description="The id shown in brackets before the sentence, e.g. 'c12'. Copy it exactly.")
    original_sentence: str = Field(
        description="The exact, unchanged French sentence being analyzed from the provided input list.")
    subject: str = Field(
        description="The explicit grammatical entity or pronoun performing the main action.")
    action_verb: str = Field(
        description="The main verb or verb phrase describing the action or state.")
    direct_object: str = Field(
        description="The entity targeted by the action. Write 'N/A' if intransitive.")
    target_is_subject_or_object_reasoning: str = Field(description=(
        "Explain how you determined whether the target person is the grammatical subject or "
        "the grammatical object of the sentence (or neither)."))
    accusation_classification: Literal["A", "B", "C", "D", "E", "F", "G"] = Field(
        description="The core nature of the sentence regarding accusations against the target:\n" + CATEGORIES)
    verbatim_text_evidence: str = Field(
        description="The exact raw substring copied from the original text proving this classification.")
    translated_sentence: str = Field(
        description="Accurate English translation of the original source sentence.")
    reasoning: str = Field(
        description="A concise summary of who is acting, who receives the action, and why this classification fits.")


class BatchLinguisticBreakdown(BaseModel):
    analyses: List[SingleSentenceAnalysis] = Field(
        description="Grammatical and rhetorical breakdown for every sentence in the input list.")


# {target_name} below is filled in by few_shot_examples()
FEW_SHOT_TEMPLATE = """
CLASSIFICATION EXAMPLES (use these as reference for your decisions):

[EXAMPLE A: Direct accusation, target is subject]
Sentence: "Vous avez payé vos ci-devant gardes du corps à Coblentz: les registres de Septeuil en font foi, et plusieurs ordres signés de vous constatent que vous avez fait passer des sommes considérables à Bouillé."
Classification: A
target_is_subject_or_object: True
Reasoning: The sentence directly charges {target_name} with paying émigré forces at Coblentz and sending large sums to named counter-revolutionary commanders, citing documentary evidence. {target_name} ("vous") is the grammatical subject throughout.

[EXAMPLE B: Report of an accusation]
Sentence: "Aussi est démentie la réponse du ci-devant roi, qui a dit que la lettre de Witgenstein, du 28 avril, était postérieure à son rappel, et qu'il n'avait pas été employé depuis."
Classification: B
target_is_subject_or_object: True
Reasoning: The sentence reports that the former king's statement has been officially refuted, implying he made a false declaration. He is the subject of the reported claim being discredited.

[EXAMPLE C: Neutral factual statement]
Sentence: "Lecture faite, {target_name} a signé avec nous commissaires de la Convention nationale."
Classification: C
target_is_subject_or_object: True
Reasoning: This sentence is purely procedural. {target_name} is signing a document with commissioners. No accusation, defense, or judgement is present but {target_name} is still the grammatical subject.

[EXAMPLE D: Defense or denial]
Sentence: "Je m'offre, après le courageux Malesherbes, pour être le défenseur de {target_name}."
Classification: D
target_is_subject_or_object: True
Reasoning: {target_name} is the direct object of "défenseur de" - the speaker volunteers to defend them. No accusatory position is taken.

[EXAMPLE E: Ambiguous/unclear]
Sentence: "Cu seul !))0)eu te présente pour obvier a ces inconvénient^ et nous osons supplier instamment Su Majesté de t'adopter il consiste A leur,, vu lieu de la somme pro-"
Classification: E
target_is_subject_or_object: False
Reasoning: Severe OCR corruption renders the sentence grammatically incoherent. The subject, verb, and intent cannot be reliably determined.

[EXAMPLE F: Procedural action]
Sentence: "Le Comité de salut public arrête que {target_name} sera sur-le-champ constitué prisonnier et conduit à l'Abbaye."
Classification: F
target_is_subject_or_object: True
Reasoning: This is a formal decree ordering {target_name}'s arrest and imprisonment. It records the procedural act itself - the order to detain - without stating any specific accusatory content or alleged wrongdoing.

[EXAMPLE G: Outcome stated]
Sentence: "{target_name} a été condamné à mort et exécuté le lendemain sur la place de la Révolution."
Classification: G
target_is_subject_or_object: True
Reasoning: The sentence directly reports {target_name}'s final disposition - a death sentence and execution - rather than describing an accusation or the reasoning behind it.
"""


def few_shot_examples(target_name):
    return FEW_SHOT_TEMPLATE.replace("{target_name}", target_name)


def context_framing(target_name):
    return (
        f"You are analyzing primary source documents from the French Revolutionary "
        f"period (1792-1794). In this context, treat as relevant not only formal "
        f"accusations made in official proceedings (denunciations, arrest decrees, "
        f"tribunal reports), but also informal criticism, suspicion, gossip, or "
        f"negative characterization of {target_name} in private correspondence or "
        f"casual remarks — since such informal criticism often preceded and "
        f"foreshadowed formal charges during this period. Distinguish, where "
        f"possible, whether the negative content occurs in a formal official "
        f"context or an informal/private one.")


def parse_linguistics_bulk(candidates, target_name) -> List[dict]:
    """
    Classify a batch of candidates. Each is sent with an id so results map back to
    their paragraph and date even if the model alters the sentence slightly.
    """
    formatted_input = "\n".join(f"[{c['cid']}] {c['sentence']}" for c in candidates)
    prompt = (
        f"You are a strict linguistic structural engine parsing 18th-century French trial documents.\n"
        f"For EACH sentence below, isolate the main subject, verb phrase and direct object. "
        f"Determine whether {target_name} is the grammatical subject or the direct object of the main "
        f"clause (accounting for titles, epithets, pronouns, and inserted modifiers like 'ci-devant' "
        f"or 'ex-'. These do not change who is being referred to), and classify the sentence.\n\n"
        f"CRITICAL ASSIGNMENT: Evaluate the nature of each sentence with respect to {target_name} "
        f"and assign one of the following classification letters:\n"
        f"{CATEGORIES}\n"
        f"{few_shot_examples(target_name)}\n\n"
        f"{context_framing(target_name)}\n\n"
        f"Sentences to parse:\n{formatted_input}")
    return (call_model(prompt, BatchLinguisticBreakdown, thinking=True,
                       where="parse_linguistics_bulk") or {}).get('analyses', [])


def grounding_check(evidence: str, original: str) -> bool:
    """
    The model's evidence must be an actual substring of the sentence.
    """
    if not evidence or not original:
        return False
    return evidence.strip().lower() in original.strip().lower()


# -------------- stage 4: voting ------------------
class CategoryVote(BaseModel):
    # asked first, so the model commits to who is accused before picking a category
    target_is_accused_person: bool = Field(description=(
        "True if the target is the person whose conduct is accused, criticized or acted on - "
        "however the sentence names them: as subject or object, after 'contre' ('dénonciations "
        "contre X'), as a possessor ('la trahison de X', 'la correspondance de X'), or in a passive "
        "('X est accusé par...'). False ONLY if the accusation is about a DIFFERENT person and the "
        "target is merely a reference point: a time anchor ('depuis l'arrestation de X, son aide de "
        "camp a trahi'), a family relation, or a place/office name."))

    category_classification: Literal["A", "B", "C", "D", "E", "F", "G"] = Field(description=(
        "The nature of the sentence regarding accusations against the target:\n" + CATEGORIES))

    reason: str = Field(description="Why this category was chosen, including who the accused person actually is.")


def second_run(sentence, target_name):
    """
    One vote: returns (category, reason, target_is_accused) or (None, None, None) on failure.
    """
    prompt = (
        f"You are an expert on the French Revolution (1789-1799), a time of political upheaval and "
        f"mass executions.\n\n"
        f"First, determine whether {target_name} is the person the accusation or criticism is about. "
        f"Count it as yes when {target_name} is named after 'contre' ('dénonciations contre "
        f"{target_name}'), as a possessor ('la correspondance de {target_name}'), or in a passive. "
        f"Answer no ONLY if the accusation targets a DIFFERENT person and {target_name} is just a "
        f"reference point (e.g. 'since so-and-so's arrest, his aide betrayed us' accuses the aide).\n\n"
        f"Then classify the sentence with respect to {target_name}, using these categories:\n{CATEGORIES}\n"
        f"{context_framing(target_name)}\n\n"
        f"Sentence: {sentence}\n\n"
        f"Respond with whether {target_name} is the person the accusation or criticism is about, "
        f"the category letter, and your reason.")
    data = call_model(prompt, CategoryVote, temperature=0.6, where="second_run")
    if not data:
        return None, None, None
    return (data.get('category_classification'), data.get('reason'),
            data.get('target_is_accused_person', True))


def verify_with_voting(items, target_name, votes=VOTES):
    """
    Re-classify each item `votes` times; keep items where one category wins a majority.
    An A/B vote only counts as A/B if the target is the accused person; otherwise it is
    downgraded to C (the target is only mentioned while someone else is accused).
    Adds first_pass_classification, verification_tally, verification_reason, actor_downgrades.
    """
    kept = []
    for n, item in enumerate(items, 1):
        tally, reasons, downgrades = defaultdict(int), [], 0
        for _ in range(votes):
            vote, reason, is_accused = second_run(item['original_sentence'], target_name)
            if vote:
                # An A/B vote means the target is accused. If Gemini also says the target
                # isn't the one accused, the two answers contradict, so count it as C (neutral).
                effective_vote = vote if (is_accused or vote not in ("A", "B")) else "C"
                downgrades += effective_vote != vote
                tally[effective_vote] += 1
                reasons.append((effective_vote, reason))
        if not tally:
            continue
        winner = max(tally, key=tally.get)
        note = f" ({downgrades} A/B vote(s) downgraded: target not the accused person)" if downgrades else ""
        print(f"  verify {n}/{len(items)}: {item['original_sentence'][:50]!r} -> {dict(tally)}{note}")
        if tally[winner] > votes // 2:
            # keep the original first-pass label when re-verifying already-verified items
            item['first_pass_classification'] = item.get('classification')
            item['classification'] = winner
            item['verification_tally'] = tally[winner]
            item['actor_downgrades'] = downgrades
            item['verification_reason'] = " | ".join(r for v, r in reasons if v == winner and r) or "No reason given."
            kept.append(item)
    return kept


# -------------- stage 5: condensed charges ------------------
class CondensedCharge(BaseModel):
    condensed_charge: str = Field(description=(
        "A condensed charge statement, written in FRENCH, preserving the core accusatory content: "
        "the alleged act, the implication of wrongdoing, and against whom/what it was committed. "
        "Matches the tone, length, and structure of the reference charge examples."))


def condense_charges(item, target_name, templates):
    prompt = (
        f"You are condensing an 18th-century French Revolutionary accusation sentence into a short, "
        f"formal charge statement against {target_name}.\n\n"
        f"Here is why this sentence was flagged as accusatory against {target_name}: {item['reasoning']}\n\n"
        f"Keep only the most important accusatory content - the alleged act, the implication of "
        f"wrongdoing, and against whom or what it was committed - preserving even implied or insinuated "
        f"wrongdoing when the surface wording is procedural or indirect. Drop procedural filler, dates, "
        f"register citations, and repetition.\n\n"
        f"STRICT RULES:\n"
        f"- Write the charge in FRENCH, like the examples below.\n"
        f"- Use ONLY facts stated in the sentence. Do not add, change or guess numbers, names, places "
        f"or reasons. If a word is damaged by OCR, leave out the detail rather than guess it.\n"
        f"- Keep conditionals and hypotheticals as they are: if the sentence says what would be "
        f"wrong IF something happens, do not state it as something that already happened.\n"
        f"- If the sentence reports that someone else made the accusation, you may say so briefly.\n\n"
        f"Use these existing charges as a style and format template; match their tone, length, and "
        f"structure as closely as possible:\n\n{templates}\n\n"
        f"Original sentence:\n{item['original_sentence']}")
    return (call_model(prompt, CondensedCharge, where="condense_charges") or {}).get('condensed_charge')


# -------------- stage 6: execution prediction ------------------
def date_to_numeric(iso_date: str) -> float:
    """
    Days since 1 Vendémiaire an I (22 Sept 1792). Same formula as date_numeric in training.
    """
    from datetime import date
    return float((date.fromisoformat(iso_date) - date.fromisoformat(REVOLUTIONARY_EPOCH)).days)


def predict_execution(charges, social_class):
    """
    Embed each condensed charge, apply the training PCA, and score it with the classifier.
    Adds p_execution to each charge dict and returns the charges that could be scored.
    """
    import joblib, numpy as np, pandas as pd
    from sentence_transformers import SentenceTransformer

    usable = [c for c in charges if c.get("cleaned_charge") and c.get("date")]
    if len(usable) < len(charges):
        print(f" skipping {len(charges) - len(usable)} charges with no text or date")
    if not usable:
        print(" no charges to score.")
        return []
    embedder = SentenceTransformer(EMBED_MODEL)
    pca, clf = joblib.load(PCA_PATH), joblib.load(CLF_PATH)
    # normalize_embeddings=True matches how the training embeddings were made; without it the scores come out too low
    pca_feats = pca.transform(embedder.encode([c["cleaned_charge"] for c in usable], normalize_embeddings=True))

    X = pd.DataFrame(pca_feats, columns=[f"pca_{i}" for i in range(pca_feats.shape[1])])
    X.insert(0, "encoded_social_class", social_class)
    X.insert(0, "date_numeric", [date_to_numeric(c["date"]) for c in usable])

    names = getattr(clf, "feature_names_in_", None)
    if names is not None:
        missing = [n for n in names if n not in X.columns]
        if missing:
            print(f" classifier expects columns this pipeline doesn't make: {missing[:5]}")
            return []
    else:
        print(" classifier has not stored column names.")

    probs = clf.predict_proba(X)[:, 1]
    for c, p in zip(usable, probs):
        c["p_execution"] = round(float(p), 4)
    return usable


# -------------- the pipeline ------------------
def find_and_classify(target_name, aliases):
    """
    Stages 1-3. Returns (accepted, rejected), each a list of dicts with date/tome/view.
    """
    alias_string = ", ".join(aliases)
    rows = load_paragraphs()
    print(f"Loaded {len(rows)} paragraphs from {len({r['tome'] for r in rows})} volume(s).")
    if not rows:
        raise SystemExit("No paragraphs loaded. Check DATA_DIR and the data filters")

    chunks = chunk_paragraphs(rows, CHUNK_SIZE, OVERLAP_PARAS)
    pat = mention_pattern(target_name, aliases)
    chunks = [c for c in chunks if pat.search(edit_txt(" ".join(r["text"] for r in c)))]
    print(f"Chunks to send to Gemini: {len(chunks)}\n")

    # stage 1: candidates, each tied to the paragraph it came from
    candidates, seen = [], set()
    for i, batch in enumerate(chunks):
        chunk_text = "\n\n".join(r["text"] for r in batch)
        for sentence in extract_candidates(chunk_text, target_name, alias_string):
            para = find_paragraph(sentence, batch)
            key = (sentence.strip(), para["pid"])
            if key in seen:
                continue
            seen.add(key)
            candidates.append({"cid": f"c{len(candidates)}", "sentence": sentence,
                               "date": para["date"], "tome": para["tome"], "view": para["view"],
                               "pid": para["pid"]})
        if (i + 1) % 25 == 0:
            print(f"  stage 1: {i + 1}/{len(chunks)} chunks,  {len(candidates)} candidates so far")
    print(f"\nTotal candidate sentences: {len(candidates)}")
    if not candidates:
        return [], []

    # stage 2: classification in batches
    by_cid = {c["cid"]: c for c in candidates}
    analyses = []
    for start in range(0, len(candidates), STAGE2_BATCH):
        print(f"  stage 2: batch {start // STAGE2_BATCH + 1}")
        analyses.extend(parse_linguistics_bulk(candidates[start:start + STAGE2_BATCH], target_name))
    print(f"\nStage 2 complete: {len(analyses)} parsed. Running validation...\n")

    # stage 3: validation
    accepted, rejected, counters, done = [], [], defaultdict(int), set()
    for a in analyses:
        src = by_cid.get(str(a.get("candidate_id")).strip("[] "))
        if not src or src["cid"] in done:
            continue
        done.add(src["cid"])
        record = {
            "original_sentence": src["sentence"],
            "translated_sentence": a.get("translated_sentence"),
            "subject": a.get("subject"), "action_verb": a.get("action_verb"),
            "direct_object": a.get("direct_object"), "classification": a.get("accusation_classification"),
            "reasoning": a.get("reasoning"),
            "target_is_subject_or_object_reasoning": a.get("target_is_subject_or_object_reasoning"),
            "verbatim_text_evidence": a.get("verbatim_text_evidence"),
            "date": src["date"], "tome": src["tome"], "view": src["view"],
        }
        if record["classification"] == "E":
            reason = "Skipped (Ambiguous/OCR: Category E)"
        elif not grounding_check(a.get("verbatim_text_evidence"), src["sentence"]):
            reason = "Failed Grounding Check"
        else:
            accepted.append(record)
            continue
        counters[reason] += 1
        rejected.append({**record, "reason": reason})

    missing = len(candidates) - len(done)
    print(f"-----DISPOSITION SUMMARY: {len(accepted)} accepted----------")
    for reason, count in counters.items():
        print(f"  {reason}: {count}")
    if missing:
        print(f"  Not returned by the model: {missing}")
    return accepted, rejected


def print_results(results, title):
    print(f"\n-----{title} ({len(results)})---------")
    by_category = defaultdict(list)
    for r in results:
        by_category[r.get("classification")].append(r)
    for category in sorted(by_category, key=str):
        print(f"\n---- CATEGORY {category} ({len(by_category[category])})-------")
        for r in by_category[category]:
            g = lambda k: r.get(k, "")
            print(f" Date:       {g('date')}   (Tome {g('tome')}, view {g('view')})")
            print(f" Original:   {g('original_sentence')}")
            print(f" English:    {g('translated_sentence')}")
            print(f" Subject:    {g('subject')} | Verb: {g('action_verb')} | Object: {g('direct_object')}")
            print(f" Reasoning:  {g('reasoning')}")
            if "verification_reason" in r:
                print(f" Vote said:  {g('verification_reason')}")
            if "verification_tally" in r:
                extra = f", {r['actor_downgrades']} A/B vote(s) downgraded" if r.get("actor_downgrades") else ""
                print(f" Votes:  {r['verification_tally']}/{VOTES} (first pass: {g('first_pass_classification')}{extra})")
            if "reason" in r:
                print(f" Rejected:  {r['reason']}")
            print()


def save_jsonl(items, name):
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUTPUT_DIR / name
    with open(path, "w", encoding="utf-8") as f:
        for it in items:
            f.write(json.dumps(it, ensure_ascii=False) + "\n")
    print(f"Saved {len(items)} -> {path}")


def load_jsonl(name):
    path = OUTPUT_DIR / name
    return [json.loads(l) for l in open(path, encoding="utf-8")] if path.exists() else []


def ask_social_class():
    print("Pick a value based on the person's social class:")
    for k, v in SOCIAL_CLASSES.items():
        print(f" {k} = {v}")
    while True:
        try:
            social_class = int(input("Enter social class number: "))
            if social_class in SOCIAL_CLASSES:
                return social_class
        except ValueError:
            pass
        print(f"Please enter one of: {sorted(SOCIAL_CLASSES)}.")


def slug_for(target_name):
    return re.sub(r"\W+", "_", edit_txt(target_name)).strip("_")


def finish(target_name, social_class, verified, recovered, rejected):
    """Stages 5-6 and saving: condense A/B charges, predict, write the output files."""
    print_results(verified, "VERIFIED")
    print_results(recovered, "RECOVERED FROM REJECTED (check these by hand)")

    templates = CHARGE_TEMPLATES.read_text(encoding="utf-8")
    charges = []
    for item in verified + recovered:
        if item["classification"] in ("A", "B"):
            charges.append({
                "target_name": target_name, "social_class": social_class,
                "classification": item["classification"], "date": item["date"],
                "tome": item["tome"], "view": item["view"],
                "original_sentence": item["original_sentence"],
                "cleaned_charge": condense_charges(item, target_name, templates),
            })
    charges.sort(key=lambda c: (c["date"] is None, c["date"] or ""))

    print("\n------- CONDENSED CHARGES (by date) -------")
    for c in charges:
        print(f" {c['date']}  [{c['classification']}]  {c['cleaned_charge']}   (Tome {c['tome']}, view {c['view']})")

    if charges:
        print("\n------- EXECUTION PREDICTION -------")
        scored = predict_execution(charges, social_class)
        for c in scored:
            print(f" {c['date']}  [{c['classification']}]  p(execution)={c['p_execution']:.3f}  {c['cleaned_charge']}")
        if scored:
            ps = [c["p_execution"] for c in scored]
            print(f"\n Charges scored: {len(ps)}   mean p = {sum(ps) / len(ps):.3f}   max p = {max(ps):.3f}")

    slug = slug_for(target_name)
    save_jsonl(verified, f"{slug}_verified.jsonl")
    save_jsonl(recovered, f"{slug}_recovered.jsonl")
    save_jsonl(rejected, f"{slug}_rejected.jsonl")
    save_jsonl(charges, f"{slug}_charges.jsonl")


def run_extraction():
    target_name = input("Enter a target name: ").strip()
    social_class = ask_social_class()
    print(f"\nDate range: {DATE_FROM} to {DATE_TO}   Tomes: {TOMES or 'all'}")
    print("(If this is wrong for this person, stop and change the settings at the top.)\n")

    is_person, is_specific, why = check_is_person(target_name)
    if not is_person:
        print(f"\n Warning: '{target_name}' may not refer to an individual person.\nReason: {why}")
        if input("Proceed anyway? (y/n): ").strip().lower() != "y":
            return
    elif not is_specific:
        print(f"\n'{target_name}' is a common first name that could match many different people.\n"
              f"Reason: {why}\nTry a full name or surname instead (e.g. 'Pierre Vergniaud').")
        return

    aliases = get_aliases(target_name)
    print("Aliases suggested by the model:")
    for i, a in enumerate(aliases):
        print(f"  {i}: {a}")
    print("Generic phrases (e.g. 'Traître à la patrie') match other people and waste API calls;\n"
          "invented epithets match nothing. Remove any that aren't specific to this person.")
    drop = input("Numbers to remove, separated by commas (Enter to keep all): ").strip()
    if drop:
        remove = {int(x) for x in re.findall(r"\d+", drop)}
        aliases = [a for i, a in enumerate(aliases) if i not in remove]
    print(f"Using aliases: {aliases}\n")

    accepted, rejected = find_and_classify(target_name, aliases)
    print_results(accepted, "ACCEPTED (first pass)")
    save_jsonl(accepted, f"{slug_for(target_name)}_accepted.jsonl")

    print("\nVerifying accepted results by vote...")
    verified = verify_with_voting(accepted, target_name)
    print("Re-checking rejected results by vote (a majority can recover)")
    recovered = [r for r in verify_with_voting(rejected, target_name) if r['classification'] != "E"]
    finish(target_name, social_class, verified, recovered, rejected)


def show_saved():
    """
    Print a person's saved results (no Gemini calls).
    """
    target_name = input("Target name exactly as used in the original run: ").strip()
    slug = slug_for(target_name)
    verified = load_jsonl(f"{slug}_verified.jsonl")
    recovered = load_jsonl(f"{slug}_recovered.jsonl")
    charges = load_jsonl(f"{slug}_charges.jsonl")
    if not verified and not recovered:
        print(f"No saved results found for '{slug}' in {OUTPUT_DIR}.")
        return
    print_results(verified, "VERIFIED")
    print_results(recovered, "RECOVERED FROM REJECTED")

    print("\n------- CONDENSED CHARGES (by date) -------")
    for c in charges:
        p = f" p={c['p_execution']:.3f}" if "p_execution" in c else ""
        print(f" {c['date']} [{c['classification']}] {c['cleaned_charge']}{p}  (Tome {c['tome']}, view {c['view']})")


def main():
    print("Starting Extraction Process \n")
    mode = input("1 = full extraction  2 = show a person's saved results\nChoose 1 or 2: ").strip()
    if mode == "2":
        show_saved()
    elif mode == "1":
        run_extraction()
    else:
        print("Please enter 1 or 2.")


if __name__ == "__main__":
    main()
