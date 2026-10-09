"""
Find date headings that cps_dates.py may have missed.
It lists short paragraphs that are shaped like a heading which includes optional
"Place",""Séance du", then a day and a month name at the start of the line but that 
were not used as a heading (date_source != header). 

Usage:  python cps_find_missed_headings.py clean_cps/cps_tome??.dated.jsonl
"""
import json, re, sys

MONTHS = (r"janvier|f[ée]vrier|mars|avril|mai|juin|juillet|ao[ûu]t|septembre|octobre|novembre|d[ée]cembre|"
          r"vend[ée]miaire|brumaire|frimaire|niv[ôo]se|pluvi[ôo]se|vent[ôod]se|germinal|flor[ée]al|"
          r"prairial|messidor|thermidor|fructidor")

# start of line: up to 3 junk symbols, optional "Place, " (<=5, maybe "le")
# optional "séance du", then a short day token and a month name
HEADING_SHAPE = re.compile(
        rf"^\W{{0,3}}(?:[A-ZÀ-Ý\[][^\s,]*(?:\s+[^\s,]+){{0,4}},\s*(?:le\s+)?)?"
        rf"(?:s[ée]ance\W{{0,3}}\s*d\w\s+)?\S{{1,3}}\s+(?:{MONTHS})\b"
        )
for path in sys.argv[1:]:
    rows = [json.loads(l) for l in open(path, encoding="utf-8")]
    used = sum(r["date_source"] == "header" for r in rows)
    missed = [r for r in rows
              if len(r["text"]) <= 140
              and r["date_source"] != "header"
              and not r["text"].startswith(("[", "[FOOTNOTE]"))
              and HEADING_SHAPE.search(r["text"])
              ]
    print(f"\n{path}: {used} headings used, {len(missed)} heading-shaped lines not used")
    for r in missed:
        print(f"   view {r['view']:>4}: {r['text'][:100]}")
