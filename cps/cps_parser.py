"""
Prepares the OCR text of F.A. Aulard's "Collection of the Acts of the Committee of 
Public Safety" (28 volumes, August 1792 - October 1795) for dating and extraction.

Input: one html file per volume. Gallica's text download(the French national
library's digital collection), or a HathiTrust PDF converted with pdf_to_html.py.

For each volume it:
1. splits the file into pages (Gallica puts an <hr> tag after every page)
2. keeps only the pages that contain the records, using the page ranges below
(this drops the title pages, Aulard's introduction and the table of contents)
3. takes the paragraphs of each page (<p> tags) and removes the html tags
4. labels footnotes "[FOOTNOTE]"
5. starts a new paragraph where a date heading is buried inside a paragraph
6. saves one line per page: cps_TomeNN.jsonl, which serves as input to cps_dates.py
"""
#Usage: python3 cps_parser.py "Acts Folder" clean

import html, json, re, sys
from pathlib import Path

# First and last page (Gallica "view") of the records in each volume
# Found by checking where the first session starts and where the table of content begins
RECORD_PAGES = {
    1: (95, 598),   2: (15, 626),   3: (19, 641),   4: (19, 631),   5: (17, 580),
    6: (19, 623),   7: (19, 637),   8: (19, 743),   9: (15, 802),  10: (15, 804),
    11: (27, 749), 12: (17, 806),  13: (17, 828),  14: (13, 808),  15: (17, 821),
    16: (17, 837), 17: (17, 847),  18: (42, 858),  19: (13, 807),  20: (17, 822),
    21: (15, 854), 22: (14, 839),  23: (13, 843),  24: (15, 864),  25: (17, 776),
    26: (15, 782), 27: (28, 704),  28: (23, 728),
}

# A footnote paragraph starts with its marker: (1), (2) ... or the OCR misreadings (i) (l)
FOOTNOTE = re.compile(r"^\([\dil]\)")
# Some scans (Volume 23) merge a letter's title, its date heading and its text into one
# paragraph: "...À ROUEN. Paris, 21 floréal an III - 10 mai 1795. La Convention..."
# Start a new paragraph where a republican date heading begins, but only right after
# a full stop or "]" (the end of the title or of the previous text), and only when the
# year is followed by "-" or "." like a heading ("... an III qui envoyait" is a sentence)
REP_MONTH = (r"(?i:vend[ée]miaire|brumaire|frimaire|niv[ôo]se|pluvi[ôo]se|vent[ôod]se|"
             r"germinal|flor[ée]al|prairial|messidor|thermidor|fructidor)")
BURIED_DATELINE = re.compile(
    r"(?<=[.\]])\s+"                               #   after "." or "]" + space(s)
    r"(?="                                         #   look ahead, don't remove
    r"(?:[A-ZÀ-Ý][^,.]{0,40},\s*)?"                #   optional "Paris, " / "Convention nationale, "
    r"(?:[sS][ée]ance\s+du\s+)?"                   #   optional "séance du "
    rf"\S{{1,4}}\s*{REP_MONTH}\s+an\s+\S{{1,4}}?"  #   day + Republican month + "an" + year
    r"\s*[-–—.(])"                                 #   then "-", "–", "." or "(" (a heading's end)
    )  
def split_paragraph(text):
    """
    Cut one paragraph into pieces at "Séance du"(meaning session of) and at buried date headings
    """  
    pieces = re.split(r" (?=Séance du )",text)
    if text.startswith("[FOOTNOTE]"): # no date-heading split on footnotes
        return pieces
    return [part for piece in pieces for part in BURIED_DATELINE.split(piece)]

def page_paragraphs(page_html):
    """
    The paragraphs of one page, as plain text
    """
    paragraphs = []
    for p in re.findall(r"<p>(.*?)</p>", page_html, re.S):
        text = re.sub(r"<[^>]+>","",p)  # remove tags inside the paragraph
        text = html.unescape(text)      # "&amp;" -> "&"
        text = re.sub(r"\s+"," ",text).strip() # tidy spaces and line breaks
        if FOOTNOTE.search(text):
            text = "[FOOTNOTE] " + text
        for part in split_paragraph(text):
            if part:
                paragraphs.append(part)
    return paragraphs

def clean_volume(path, out_dir):
    """
    Clean one volume's html file and write cps_tomeNN.jsonl and cps_tomeNN.txt
    to out_dir
    """
    raw = path.read_text(encoding="utf-8", errors="replace")
    tome = int(re.search(r"Tome (\d+)", raw).group(1)) 
    first, last = RECORD_PAGES[tome]

    pages = re.split(r"<hr\s*/?>",raw) # splits pages based on <hr>
    stem = f"cps_tome{tome:02d}"
    with open(out_dir / f"{stem}.jsonl","w",encoding="utf-8") as jf, \
         open(out_dir / f"{stem}.txt","w",encoding="utf-8") as tf:
         # record pages only; min() stops at the file's real page if it's shorter than expected
         for view in range(first,min(last,len(pages)-1)+ 1):
             paragraphs = page_paragraphs(pages[view])
             if not paragraphs:
                 continue
             text = "\n\n".join(paragraphs)
             jf.write(json.dumps({"tome": tome, "view": view, "text": text},
                                 ensure_ascii = False) + "\n")
             tf.write(f"\n[[view {view}]]\n{text}\n")
    print(f"{path.name} -> {stem}: pages {first}-{last}")


def main(in_dir,out_dir):
    """
    Clean every .html volume in in_dir and write the results to out_dir 
    """
    out_dir = Path(out_dir)
    out_dir.mkdir(exist_ok=True)
    for path in sorted(Path(in_dir).glob("*.html")): #every .html file in the input folder
        clean_volume(path, out_dir)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
