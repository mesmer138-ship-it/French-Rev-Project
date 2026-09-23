from google.genai import types
from google.colab import userdata
from google import genai
from typing import List, Literal
from pydantic import BaseModel, Field
import re
import json
from pathlib import Path
from collections import defaultdict

#shannon, 3 times
input_path = Path('/content/mydrive/MyDrive/Comite_Salut_Public_Tome7_1793-09-22_to_1793-10-24_cleaned.txt')
CHAR_START = 0
CHAR_END = 1415452
CHUNK_SIZE = 8000
OVERLAP = 800
STAGE2_BATCH = 30
MODEL = 'models/gemini-3.6-flash'
target_name = input("Enter a target name:")

results = []
aliases = {}
client = genai.Client(api_key=userdata.get('GeminiKey'))
#with open(input_path,"r",encoding="utf-8") as f:
#    data = f.read()


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
            f" include only actual names/titles/epithets.only include terms with plausible historical basis."
            f" do not invent embellished or fabricated names/insults for volume. If uncertain whether a term was acutally used, omit it."
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
    E.g 'se-\\nront becomes 'seront'.
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
        target_is_subject_or_object: bool = Field (
            description = (
              f"True if {target_name}, referenced by name, alias, epithet, title, or a clear "
              f"pronoun/reference resolvable from this sentence, is the grammatical subject or one of the grammatical subject or"
              f"direct object or one of the direct objects of the main clause. False if they are only mentioned in passing, "
              f"in a subordinate clause, an appositive, or as background context to someone else's action."
            )

          )

        accusation_classification: Literal["A","B","C","D","E"] =Field (
        description = (
       "The core nature of the sentences regarding accusations against {target_name}:\n"
       "A = Direct accusation: text directly charges the target with a crime, mideed, or tyrannical act\n"
       "B = Report of an accusation, references an accusation made by another person, decree, or committee\n"
       "C = Neutral factual statement, purely logistical,narrative, procedural, or non-judgemental\n"
       "D = Defense or dential, defends the target, offers alibi, counters a charge, or mititgates guilt\n"
       "E = Ambiguous/unclear, too OCR-corrupted, too fragmentary, or too context-dependent to classify confidently"

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

    """
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
        f"{FEW_SHOT_EXAMPLES}\n\n"
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
        return
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
        if classification == 'E':
            reason = "Skipped (Ambiguous/OCR: Category E)"
            rejection_counters[reason] = rejection_counters.get(reason,0) + 1
            rejected_items.append({'sentence':sentence, 'classification':classification, 'reason':reason})
            continue
        if not parsed_logistics.get('target_is_subject_or_object'):
            reason = "Rejected (Target is neither subject nor object)"
            rejection_counters [reason] = rejection_counters.get(reason,0) + 1
            rejected_items.append({'sentence':sentence, 'classification':classification, 'reason':reason, 'reasoning':reasoning})
            continue
        evidence_chunk = parsed_logistics.get('verbatim_text_evidence')
        if not grounding_check(evidence_chunk,sentence):
            reason = "Failed Grounding Check"
            rejection_counters[reason] = rejection_counters.get(reason,0)+1
            rejected_items.append({'sentence':sentence, 'classification':classification, 'reason':reason})
            continue

        results.append({
            'original_sentence': sentence,
            'translated_sentence': parsed_logistics.get('translated_sentence'),
            'subject': parsed_logistics.get('subject'),
            'action_verb': parsed_logistics.get('action_verb'),
            'direct_object': parsed_logistics.get('direct_object'),
            'classification': classification,
            'reasoning': parsed_logistics.get('reasoning'),

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
        key = (item['sentence'], item['reason'])
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
            print()
    if unique_rejected:
        print(f"----REJECTED CANDIDATES ({len(unique_rejected)})-------")
        for item in unique_rejected:
            print(f" Sentence:        {item['sentence']}")
            print(f" Classification:  {item['classification']}")
            print(f" Reason:           {item['reason']}")
            print(f" Reasoning:           {item['reasoning']}")
            print()
print("Starting Extraction Process:\n")
aliases = get_aliases(target_name)
print(f"Aliases:{aliases}\n")
final_results = get_files()
