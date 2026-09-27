from google.genai import types
from google.colab import userdata
from google import genai
from typing import List, Literal
from pydantic import BaseModel, Field
import re
import json
from pathlib import Path
from collections import defaultdict

input_path = Path('/content/mydrive/MyDrive/Comite_Salut_Public_Tome7_1793-09-22_to_1793-10-24_cleaned.txt')
CHAR_START = 0
CHUNK_SIZE = 8000
OVERLAP = 800
STAGE2_BATCH = 30
MODEL = 'models/gemini-3.6-flash'
results = []
aliases = {}
client = genai.Client(api_key=userdata.get('GeminiKey'))
with open(input_path,"r",encoding="utf-8") as f:
    data = f.read()
CHAR_END = len(data)

print("Starting Extraction Process:\n")
target_name = input("Enter a target name:")
print("Pick a value based on the person's social class below:\n",
      "0 = artisan/tradesmen, 1=clergy, 2=no occupation, 3=femme, 4=laborer/peasant, 5=legal/administrative, 6=merchant/bourgeois, 7=military,8=nobility.\n")
social_class = input("Enter social class number:")


class NameCheck(BaseModel):
    is_person: bool = Field(description =
     ("True if this name most plausibly refers to a specific individual human being"
      "in the context of the French Revolutionary period(1789-1799). False if it more plausibly"
      "refers to a place, city, organization, committee, section, abstract"
      "concept, or generic/common term."))

    is_specific_enough: bool = Field(description = ("True only if this name is specific enough to plausibly identify ONE individual"
                                                    "(e.g. a full name, a distinctive surname, or a name paired with a title/epithet"
                                                    "False if this is a bare, extremely common first name (e.g. 'Pierre','Francois',"
                                                    "'Jean', 'Marie')on its own with no surnmae or distnguishing detail, since many"
                                                    "unrelated historical figures could share that first name."))

    reasoning:str = Field(description = ("Brief explanation covering both fields, what this name most plausibly refers to,"
                                         "and whether it's specific enough to identify one individual, or too generic/common"
                                         "a first name shared by many people in this period."))

def check_is_person(name:str) -> tuple[bool,bool,str]:
    """
    Verifies that the entered target name satisfies the following requirements:
    a. Plausibly refers to an individual person not a place, organization or abstract entity.
    b. Is specific enough to identify one individual rather than a bare common first name.
    """
    prompt = (f" Evaluate the name '{name}' in the context of the French Revolutionary period"
              f"(1789-1799).\n\n"
              f"First, determine whether it most plausibly refers to a specific individual human"
              f"being, as poosed to a place, city, organization, committee, section or abstract concept"
              f".\n\n"
              f"Second, determine whether the name is specific enough on its own to plausibly"
              f"identiy ONE individual ( a full name, a distinctive surnmae or a name paired with)"
              f"a title/epithet) as opposed to a bare, extremely common first name(e.g. 'Pierre','Francois','Jean','Marie)"
              f"that many unrelated hsitorical figures could share .\n\n"
              f"Return raw JSON matching the schema."
            )

    response = client.models.generate_content(
        model = MODEL,
        contents = prompt,
        config = types.GenerateContentConfig(
            response_schema = NameCheck,
            response_mime_type = "application/json",
            temperature = 0.0,
            thinking_config = types.ThinkingConfig(thinking_budget=0)
        )

    )

    try:
        data = json.loads(response.text)
        return (
          data.get('is_person',True),
          data.get('is_specific_enough',True),
          data.get('reasoning','')
      )
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error in check_is_person: {e}")
        print(f"Raw response from model(first 500 chars):{response.text[:500]}")
        return True, True, "Could not verify - proceeding by default." #Returns (is_person, is_specific_enough, reasoning) defaulting to True/True so a parsing failure doesnt block valid name

class AliasExtraction(BaseModel):
    target_name: str
    aliases_array: List[str] = Field (description = f"List ALL alternative names,titles, and epithets that the target could be called")

def get_aliases(target_name) -> dict:
    """
    Extracts aliases for the targeted individual. Individual could be referred to in
    different ways. E.g. Marie Antoinette would be referred to as "ci-devant reine"(former queen).
    Returns a dict with keys 'target_name' and 'aliases_array.'
    """
    prompt = (
            f" List ALL alternative names,titles, and epithets that '{target_name}' could be called"
            f" in 18th century French revolutionary documents - e.g. formal titles, commonly used"
            f" nicknames, or contemporary epithets (both respectful and derogatory)"
            f" Do NOT include generic pronouns of any gender (il, elle, ils, elles, lui, vous, on, etc."
            f" include only actual names/titles/epithets that are confirmed to have been used to refer to {target_name}.only include terms with plausible historical basis."
            f" do not invent embellished or fabricated names/insults for volume. If uncertain whether a term was acutally used, omit it."
            f"AVOID GENERIC TITLES, LABELS, etc."
            f" return only french variants. Return raw JSON matching the schema."

    )
    response = client.models.generate_content(
        model = MODEL,
        contents = prompt,
        config = types.GenerateContentConfig(
            response_schema = AliasExtraction,
            response_mime_type = "application/json",
            temperature = 0.0,
            thinking_config = types.ThinkingConfig(thinking_budget=0)
        )
    )

    try:
        result = json.loads(response.text)
        result['target_name'] = target_name
        return result

    except json.JSONDecodeError as e:
        print(f"JSON Decode Error in get_aliases: {e}")
        print(f"Raw response from model (first 500 chars):{response.text[:500]}")
        return {"target_name":target_name, "aliases_array":[]}


def normalize_hyphenation(text:str) ->str:
    """
    Rejoins certain words that are split up
    by a hyphen followed by a line break in the text files.
    E.g 'se-\nront becomes 'seront'.
    """
    return re.sub(r'(\w)-\n(\w)',r'\1\2',text)

def chunk_data(text:str, max_chars: int, overlap: int) -> List[str]:
    """
    Splits texts into chunks of max_chars, preferring to break at newline.
    After a newline is found, [start,newline] is appended to chunks array.
    Start is then set 800 (OVERLAP) characters back from newline for the next run to ensure
    full context is preserved. If a newline isn't found, [start,end] is appended to chunks array.
    start is then set to 800 (OVERLAP) characters from end. If, as a result, start has
    barely moved from previous point, start is set to end. Lastly, the initial condition
    if end >= text_len would activate if the remaining text is shorter than or equal to
    max_chars. As such, the entire text length is appended as the final chunk, and
    [start,text_len] is appended to chunks array.
    """

    chunks, start, text_len = [], 0 , len(text)
    while start < text_len: #start < CHAR_START to CHAR_END
        end = start + max_chars #max_chars = CHUNK_SIZE(8000)
        if end >= text_len:
            chunks.append(text[start:text_len])
            break
        newline = text.rfind("\n", start, end)
        if newline != -1 and newline > start:
            chunks.append(text[start:newline])
            start = newline - overlap
        else:
            chunks.append(text[start:end])
            start = end - overlap
        if start <= (end - max_chars):
           start = end
    return chunks

class CandidateSentences(BaseModel):
    sentences: List [str] = Field(description = ("Every sentence (exact original French text, verbatim from the chunk) that"
    "mentions the target person by name or alias, regardless of tone. Include ALL mentions.")
    )

def extract_candidates(chunk:str, alias_string: str) -> List[str]:
   """
    Extracts all sentences from the current chunk. Uses target name and aliases to extract the sentences.
   """
   prompt = (
        f"Find every sentence in this text that mentions {target_name}, who may also appear as {alias_string}.\n"
        f"Return the EXACT original sentence text verbatim. If not mentioned, return an empty list."
    )
   response = client.models.generate_content(
        model = MODEL,
        contents = [prompt, chunk],
        config = types.GenerateContentConfig(
            response_schema = CandidateSentences,
            response_mime_type ="application/json",
            temperature = 0.0,
            thinking_config = types.ThinkingConfig(thinking_budget=0)
        )
    )

   try:
        data = json.loads(response.text)
        return data.get('sentences',[])
   except json.JSONDecodeError as e:
        print(f"JSON Decode Error in extract_candidates:{e}")
        return []

class BatchLinguisticBreakdown(BaseModel):
    class SingleSentenceAnalysis(BaseModel):
        original_sentence: str = Field(
            description = "The exact, unchanged French sentence being analyzed from the provided input list."
        )
        subject: str = Field(
          description = "The explicit grammatical entity or pronoun performing the main action."
        )
        action_verb: str = Field(
            description = "The main verb or verb phrase describing the action or state."
        )
        direct_object: str = Field(
            description = "The entity targeted by the action. Write 'N/A' if intransitive."
        )

        target_is_subject_or_object_reasoning: str = Field(description = f"If {target_name} is not a grammatical subject or grammatical object of the sentence, explain how that was determined. If {target_name} is a grammatical subject or grammatical object of the sentence explain how that was determined.")

        accusation_classification: Literal["A","B","C","D","E","F","G"] = Field (
        description = (
       "The core nature of the sentences regarding accusations against {target_name}:\n"
       "A = Direct accusation: text directly charges the target with a crime, mideed, or tyrannical act\n"
       "B = Report of an accusation, references an accusation made by another person, decree, or committee\n"
       "C = Neutral factual statement: purely logistical, narrative, procedural, or non-judgemental \n"
       "D = Defense or denial: defends the target, offers alibi, counters a charge, or mitigates guilt \n"
       "E = Ambiguous/unclear: too OCR-corrupted, too fragmentary, or too context-dependent to classify \n\n"
       "F = Procedural action: an arrest warrant, arrest decree, or dismissal order concerning the target, "
       "with no accusatory language of its own beyond the procedural act itself\n"
       "G = Outcome stated: the sentence directly states or reports the target's execution, acquittal, "
       "release, or other final disposition/verdict\n\n"
      )

       )
        verbatim_text_evidence: str = Field(
        description="The exact raw substring copied from the original text proving this classification."
       )
        translated_sentence: str = Field(
          description = "Accurate English translation of the original source sentence"
        )
        reasoning: str =Field(
            description = "A concise summary of who is acting, who receives the action, and why this classifcation fits."
        )


    analyses: List[SingleSentenceAnalysis] = Field(
        description = "Grammatical and rehtocial breakdwon for every sentence in the input list."
    )


def parse_linguistics_bulk(sentences:List[str])->List[dict]:
  """
  Once the candidate sentences are passed here, they are reorganized
  with a newline and dash at the beginning. Few shot examples, a tight prompt
  with classification rules and the formatted candidate sentences are sent to
  API. In the response schema,BatchLinguisitcBreakdown 'analyses' field
  holds a list of SingleSentenceAnalysis objects, which is one full grammatical
  and classification breakdown per sentence. The result is a list of dictionaires
  of the different fields.
  """
  formatted_input = "\n".join([f"-{s}" for s in sentences])
  FEW_SHOT_EXAMPLES = """
      CLASSIFICATION EXAMPLES (use these as reference for your decisions):

      [EXAMPLE A: Direct accusation, target is subject]
      Sentence: "Vous avez payè vos ci-devant gardes du corps a Coblentz: les registres de Septeuil en font foi, et plusieurs orders signès de vous constatent que vous avaez fait passer des sommes considèrables à Bouillè."
      Classification : A
      target_is_subject_or_object: True
      Reasoning: The sentence directly charges {target_name} with paying èmigrè forces at Coblentz and sending large sums to named counter-revolutionary commanders, citing documentary evidence. {target_name} ("vous") is the grammatical subject throughout.

      [EXAMPLE B: Report of an accusation]
      Sentence: "Aüsi est dèmentie la rèponse du cidevant roi, qui a dit que la lettre de Witgenstein, du 28 avril, ètait postèrieure à son rappel, et qu'il n'avait pas ètè employè depuis."
      Classification: B
      target_is_subject_or_object: True
      Reasoning: The sentence reports that the former king's statement has been officially refuted, implying he made a false declaration. He is the subject of the reported claim being discredited.

      [EXAMPLE C: Neutral factual statement]
      Sentence: "Lecture faite, {target_name} a signè avec nous commissaires de la Convention nationale."
      Classification: C
      target_is_subject_or_object: True
      Reasoning: This sentence is purely procedural. {target_name} is signing a document with commissioners. No accusation, defense, or judgement is present but {target_name} is still the grammatical subject.

      [EXAMPLE D — Defense or denial]
      Sentence: "Je m'offre, après le courageux Malesherbes, pour être le défenseur de {target_name}."
      Classification: D
      target_is_subject_or_object: True
      Reasoning: {target_name} is the direct object of "défenseur de" — the speaker volunteers to defend them. No accusatory position is taken.

      [EXAMPLE E — Ambiguous/unclear]
      Sentence: "Cu seul !))0)eu te présente pour obvier a ces inconvénient^ et nous osons supplier instamment Su Majesté de t'adopter il consiste A leur,, vu lieu de la somme pro-"
      Classification: E
      target_is_subject_or_object: False
      Reasoning: Severe OCR corruption renders the sentence grammatically incoherent. The subject, verb, and intent cannot be reliably determined.
      
      [EXAMPLE F — Procedural action]
      Sentence: "Le Comité de salut public arrête que {target_name} sera sur-le-champ constitué prisonnier et conduit à l'Abbaye."
      Classification: F
      target_is_subject_or_object: True
      Reasoning: This is a formal decree ordering {target_name}'s arrest and imprisonment. It records the procedural act itself — the order to detain — without stating any specific accusatory content or alleged wrongdoing.

      [EXAMPLE G — Outcome stated]
      Sentence: "{target_name} a été condamné à mort et exécuté le lendemain sur la place de la Révolution."
      Classification: G
      target_is_subject_or_object: True
      Reasoning: The sentence directly reports {target_name}'s final disposition — a death sentence and execution — rather than describing an accusation or the reasoning behind it.
    """
  context_framing = (
    f"You are analyzing primary source documents from the French Revolutionary "
    f"period (1792-1794). In this context, treat as relevant not only formal "
    f"accusations made in official proceedings (denunciations, arrest decrees, "
    f"tribunal reports), but also informal criticism, suspicion, gossip, or "
    f"negative characterization of {target_name} in private correspondence or "
    f"casual remarks \u2014 since such informal criticism often preceded and "
    f"foreshadowed formal charges during this period. Distinguish, where "
    f"possible, whether the negative content occurs in a formal official "
    f"context or an informal/private one."
)
  prompt = (
        f"You are a strict linguistic structural engine parsing 18th-century French trial documents.\n"
        f"For EACH sentence below, isolate the main subject, verb phrase and direct object."
        f"determine whether {target_name} is the grammatical subject or the direct object of the main"
        f"clause (accounting for titles,epithets, pronouns, and inserted modifiers like 'ci-devant'"
        f"or 'ex-'. These do not change who is being referred to), and classify the sentence.\n\n"
        f"CRITICAL ASSIGNMENT: Evaluate the nature of each sentence with respect to {target_name}"
        f"and assign one of the following classification letters:\n"
        f"A = Direct accusation: text directly charges the target with a crime, misdeed, or tyrannical act\n"
        f"B = Report of an accusation: references an accusation made by another person, decree, or committee\n"
        f"C = Neutral factual statement: purely logistical, narrative, procedural, or non-judgemental \n"
        f"D = Defense or denial: defends the target, offers alibi, counters a charge, or mitigates guilt \n"
        f"E = Ambiguous/unclear: too OCR-corrupted, too fragmentary, or too context-dependent to classify \n\n"
        f"F = Procedural action: an arrest warrant, arrest decree, or dismissal order concerning the target, "
        f"with no accusatory language of its own beyond the procedural act itself\n"
        f"G = Outcome stated: the sentence directly states or reports the target's execution, acquittal, "
        f"release, or other final disposition/verdict\n\n"
        f"{FEW_SHOT_EXAMPLES}\n\n"
        f"{context_framing}\n\n"
        f"Sentences to parse:\n{formatted_input}"
    )


  response = client.models.generate_content(
        model = MODEL,
        contents = prompt,
        config = types.GenerateContentConfig(
            response_schema = BatchLinguisticBreakdown,
            response_mime_type = "application/json",
            temperature = 0.0
        )
    )
  try:
      data = json.loads(response.text)
      return data.get('analyses',[])

  except json.JSONDecodeError as e:
      print(f"JSON Decode Error on batch:{e}")
      print(f"Raw response (first 500 chars): {response.text[:500]}")
      return []

def grounding_check(evidence:str, original:str) -> bool:
    if not evidence or not original:
        return False
    return evidence.strip().lower() in original.strip().lower()

def get_files():
    alias_list = aliases.get('aliases_array',[])
    alias_string = ",".join(alias_list)

    with open(input_path, "r", encoding = "utf-8") as f:
        data = f.read()[CHAR_START:CHAR_END]

    data = normalize_hyphenation(data)
    chunks = chunk_data(data, max_chars=CHUNK_SIZE, overlap = OVERLAP)
    print(f"Total chunks to process:{len(chunks)}\n")

    all_candidates = []
    """
    Below, the for loop passes each chunk to extract_candidates function
    and returns list of sentences to save in candidates. This is then saved
    in all_candidates list.
    """
    for i, chunk in enumerate(chunks):
        candidates = extract_candidates(chunk, alias_string)
        if candidates:
            print(f"Chunk {i:02d}: {len(candidates)} candidate sentence(s)")
        all_candidates.extend(candidates)

    print(f"\nTotal candidate sentences to parse: {len(all_candidates)}")
    if not all_candidates:
        print("No candidates found. Exiting.")
        return ([], []) # Return empty lists when no candidates are found
    """
    divmod allows us to send the sentences in batches of 30 and
    any remainder leftover to parse_linguistics_bulk, which in turn
    returns a grammatical breakdown of each sentnece, and its
    classification.
    """
    parsed_batch_results = []
    quotient, remainder = divmod(len(all_candidates),STAGE2_BATCH)
    for q in range(1, quotient+1):
        batch = all_candidates[(STAGE2_BATCH * q) - STAGE2_BATCH:(STAGE2_BATCH * q)]
        batch_num = q
        print(f"Processing batch {batch_num}")
        batch_results = parse_linguistics_bulk(batch)
        parsed_batch_results.extend(batch_results)

    if remainder > 0:
        batch = all_candidates[STAGE2_BATCH*quotient:(STAGE2_BATCH*quotient) + remainder]
        print(f"Processing batch{quotient + 1}")
        batch_results = parse_linguistics_bulk(batch)
        parsed_batch_results.extend(batch_results)

    print(f"\n Stage 2 complete: {len(parsed_batch_results)} parsed. Running validation layer...\n")


    rejection_counters = {}
    rejected_items = []
    """
    for loop below saves rejected sentences in rejected items while preserving
    count of each reason type in rejection_counters dictionary. If not rejected,
    the sentence and its logistics is appended to results array.
    """
    for parsed_logistics in parsed_batch_results:
        sentence = parsed_logistics.get('original_sentence')
        classification = parsed_logistics.get('accusation_classification')
        reasoning = parsed_logistics.get('reasoning')
        target_is_subject_or_object_reasoning = parsed_logistics.get('target_is_subject_or_object_reasoning')


        if classification == 'E':
            reason = "Skipped (Ambiguous/OCR: Category E)"
            rejection_counters[reason] = rejection_counters.get(reason,0) + 1
            rejected_items.append({'original_sentence':sentence, 'classification':classification, 'reason':reason, 'reasoning':reasoning,'target_is_subject_or_object_reasoning':target_is_subject_or_object_reasoning})
            continue

        evidence_chunk = parsed_logistics.get('verbatim_text_evidence')
        if not grounding_check(evidence_chunk,sentence):
            reason = "Failed Grounding Check"
            rejection_counters[reason] = rejection_counters.get(reason,0)+1
            rejected_items.append({'original_sentence':sentence, 'classification':classification, 'reason':reason, 'reasoning':reasoning,'target_is_subject_or_object_reasoning':target_is_subject_or_object_reasoning})
            continue

        results.append({
            'original_sentence': sentence,
            'translated_sentence': parsed_logistics.get('translated_sentence'),
            'subject': parsed_logistics.get('subject'),
            'action_verb': parsed_logistics.get('action_verb'),
            'direct_object': parsed_logistics.get('direct_object'),
            'classification': classification,
            'reasoning': reasoning,
            'target_is_subject_or_object_reasoning': target_is_subject_or_object_reasoning

        })

    """
    Deduplicate accepted results. A set is used for the membership check,
    and the actual dicts, from results array, are saved in unique_results.
    """
    seen = set()
    unique_results = []
    for r in results:
        if r['original_sentence'] not in seen:
            seen.add(r['original_sentence'])
            unique_results.append(r)
    """
    Deduplicate rejected items and save in same way as
    with accepted results.
    """
    seen_rejected = set()
    unique_rejected = []
    for item in rejected_items:
        key = (item['original_sentence'], item['reason'])
        if key not in seen_rejected:
            seen_rejected.add(key)
            unique_rejected.append(item)

    print(f"------- PIPELINE DISPOSITION SUMMARY ({len(unique_results)} unique hits(s)) -------------")
    for reason, count in rejection_counters.items():
        print(f"  {reason}:  {count}")
    print()
    """
    Group unique_results by classification letter so results can be
    printed and reviewed category by category rather than in raw
    processing order
    """
    by_category = defaultdict(list)
    for r in unique_results:
        by_category[r['classification']].append(r)

    """
    Print every result, organized by category in sorted order below.
    """
    for category in sorted(by_category):
        hits = by_category[category]
        print(f"------CATEGORY {category} ({len(hits)} hits)---------")
        for r in hits:
            print(f" Original:   {r['original_sentence']}")
            print(f" English:    {r['translated_sentence']}")
            print(f" Class:      Category {r['classification']}")
            print(f" Subject:    {r['subject']}")
            print(f" Verb:       {r['action_verb']}")
            print(f" Predicate:  {r['direct_object']}")
            print(f" Reasoning:  {r['reasoning']}")
            print(f"target_is_subject_or_object_reasoning: {r['target_is_subject_or_object_reasoning']}")
            print()

    if unique_rejected:
        print(f"----REJECTED CANDIDATES ({len(unique_rejected)})-------")
        for item in unique_rejected:
            print(f" Sentence:        {item['original_sentence']}")
            print(f" Classification:  {item['classification']}")
            print(f" Reason:           {item['reason']}")
            print(f" Reasoning:           {item['reasoning']}")
            print(f"target_is_subject_or_object_reasoning: {item['target_is_subject_or_object_reasoning']}")
            print()
    return unique_results, unique_rejected

def second_run(sentence,target_name):

    class category_response(BaseModel):
        category_classification :Literal["A","B","C","D","E","F","G"] = Field (description = "Assign the category letter that best fits this sentence")
        reason: str = Field(description="Provide your reason for choosing said category for the sentence.")

    context_framing = (
    f"You are analyzing primary source documents from the French Revolutionary "
    f"period (1792-1794).In this context, treat as relevant not only formal "
    f"accusations made in official proceedings (denunciations, arrest decrees, "
    f"tribunal reports), but also informal criticism, suspicion, gossip, or "
    f"negative characterization of {target_name} in private correspondence or "
    f"casual remarks \u2014 since such informal criticism often preceded and "
    f"foreshadowed formal charges during this period. Distinguish, where "
    f"possible, whether the negative content occurs in a formal official "
    f"context or an informal/private one."
)
    prompt = (
             f"You are an expert on the French Revolution that took places from 1789 to 1799.\n"
             f"It was a time of political upheaveal and mass executions.\n"
             f"Within this context, classify {sentence},"
             f"with respect to {target_name}. The categories"
             f"the sentences are assigned to are as follows:\n"
             f"A = Direct accusation: text directly charges the target with a crime, misdeed, or tyrannical act\n"
             f"B = Report of an accusation: references an accusation made by another person, decree, or committee\n"
             f"C = Neutral factual statement: purely logistical, narrative, procedural, or non-judgemental \n"
             f"D = Defense or denial: defends the target, offers alibi, counters a charge, or mitigates guilt \n"
             f"E = Ambiguous/unclear: too OCR-corrupted, too fragmentary, or too context-dependent to classify \n\n"
             f"Respond with the correct category letter for {sentence} and a reason why you chose said category.\n"
             f"F = Procedural action: an arrest warrant, arrest decree, or dismissal order concerning the target, "
             f"with no accusatory language of its own beyond the procedural act itself\n"
             f"G = Outcome stated: the sentence directly states or reports the target's execution, acquittal, "
             f"release, or other final disposition/verdict\n\n"
             f"{context_framing}\n"
             )

    response = client.models.generate_content(
        model = MODEL,
        contents = prompt,
        config = types.GenerateContentConfig(
        response_schema = category_response,
        response_mime_type = "application/json",
        temperature = 0.6
        )
    )
    try:
        data = json.loads(response.text)
        return data.get('category_classification'), data.get('reason')
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error on accusation classification:{e}")
        return None, None # Return None for both vote and reason on error


def verify_with_voting(items, target_name):
    """
   Re-verifies each candidate sentence's category classification by calling 
   second_run() 3 times per item and tallying the resulting votes.

   Only items where a category receives at least 2 of the 3 votes are kept;
   items wihout a majority are dropped. Each kept item is annotated with 
   'veriication_tally'(the winning vote count) and 'verification_reason'(the reasons given by the votes that agreed with winning category).
    """
    kept = []
    for item in items:
        tally = defaultdict(int)
        # Store reasons for each vote
        vote_reasons = []
        for _ in range(3):
            vote, reason = second_run(item['original_sentence'], target_name)
            if vote:
                tally[vote] += 1
                if reason:
                    vote_reasons.append((vote, reason))
                print('-------Verifying Sentence------------------')
                print(item['original_sentence'][:20], "->", vote, "|", reason)
        print('------------Finished Verification For Sentence------------------')

        if tally:
            # Find the winning vote category and its count
            winning_vote_category = max(tally, key=tally.get)
            winning_vote_count = tally[winning_vote_category]

            if winning_vote_count >= 2: # Keep if at least 2 votes for a category
                # Add verification details to the item
                item['classification'] = winning_vote_category
                item['verification_tally'] = winning_vote_count
                # Aggregate reasons specifically for the winning category
                winning_category_reasons = [r for v, r in vote_reasons if v == winning_vote_category and r]
                item['verification_reason'] = ", ".join(winning_category_reasons) if winning_category_reasons else "No specific reason provided for verification vote."
                kept.append(item)
    return kept
  
def condense_charges(item):
    class CondensedCharge(BaseModel):
        condensed_charge:str = Field(description = "A condensed charge statement that preserves the core accusatory content:" 
                                                    "the alleged act, the implication of wrongdoing and against whom/what it was committed. Matches the tone, length,"
                                                    "and structure of the reference charge examples provided."
                                                    )
    cleaned_charges_path = ("/content/mydrive/MyDrive/cleaned_charges.txt")
    with open(cleaned_charges_path,"r",encoding='utf-8') as f:
        charge_template_examples = f.read()

    prompt = (f"You are condensing an 18th-century French Revolutionary Tribunal accusation sentence"
              f"into a short, formal charge statement against {target_name}.\n\n"
              f"Condense the following sentence into a condensed charge that preserves only the"
              f"most importance accusatory content - the alleged act, the implication of wrongdoing and against whome or what it was"
              f"committed - and drops procedural filler, dates, register citations, and repetition.\n\n"
              f"Use the following existing charges as a style and format template. Match their tone, "
              f"length, and structure as closely as possible:\n\n"
              f"{charge_template_examples}\n\n"
              f"Original Sentence:\n{item['original_sentence']}"
    )
     
    response = client.models.generate_content(
         model = MODEL,
         contents = prompt,
         config = types.GenerateContentConfig(
             response_schema = CondensedCharge,
             response_mime_type = "application/json",
             temperature = 0.0
         )
     )
    
    try:
        data = json.loads(response.text)
        return data.get('condensed_charge')
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error in condense_charges: {e}")
        print(f"RAW response (first 500 chars):{response.text[:500]}")
        return None


is_person, is_specific_enough, name_check_reasoning = check_is_person(target_name)

if not is_person:
    print(f"\nWarning: '{target_name}' may not refer to an individual person.")
    print(f"Reason: {name_check_reasoning}")
    if input("Proceed anyway? (y/n): ").strip().lower() != 'y':
        raise SystemExit

elif not is_specific_enough:
    print(f"\n'{target_name}' is a common first name that could match many different people.")
    print(f"Reason: {name_check_reasoning}")
    print("Try entering a full name or surname instead (e.g. 'Pierre Vergniaud' rather than 'Pierre').")
    raise SystemExit

aliases = get_aliases(target_name)
print(f"Aliases:{aliases}\n")
final_results, final_rejected = get_files()
verified_results = verify_with_voting(final_results,target_name)
verified_rejected = verify_with_voting(final_rejected,target_name)
print(f"------- VERIFIED RESULTS ({len(verified_results)}) -------------")
for r in verified_results:
    print(f" Original:     {r['original_sentence']}")
    print(f" English:      {r['translated_sentence']}")
    print(f" Class:        Category {r['classification']}")
    print(f" Votes:        {r['verification_tally']}")
    print(f" Verify note:  {r['verification_reason']}")
    print()

print(f"------- VERIFIED REJECTED ({len(verified_rejected)}) -------------")
for item in verified_rejected:
    print(f" Sentence:   {item['original_sentence']}")
    print(f" Reason:     {item['reason']}")
    print()
for item in verified_results:
    if item['classification'] == 'A' or item['classification'] == 'B':
        condensed_charges = condense_charges(item)
        print('-------printing condensed charge_format----------')
        print(condensed_charges)
