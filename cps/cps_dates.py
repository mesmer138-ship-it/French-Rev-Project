"""
Assigns a date to every paragraph of the cleaned Committee of Public Safety (CPS) volumes.

Example Usage:
python cps_dates.py clean_cps/cps_Tome01.jsonl
-> writes clean_cps/cps_Tome01.dated.jsonl 

Each cleaned volume consists of the following fields per page(view):
{"tome","view","text"}
This script splits every page into paragraphs and adds four fields:

para: the paragraph's position on its page(0,1,2...)
date: the paragraph's Gregorian date
date_source: defined as "header" if the paragraph is a dateline, "carried" if it inherits 
             the most recent dateline above it.
date_raw: the dateline text the date came from (for checking)


Datelines it handles:
1. Gregorian datelines: "16 janvier 1793", "Convention nationale, séance du 16 janvier 1793"
2. *Republican datelines, converted to gregorian: "Paris, 3 brumaire an III"
   When both calendars are printed("...an II - 28 mars 1794"), both are read.
3. The extra days at the end of the Republican year: "Paris, 1er jour complementaire an III"
4. OCR garble in days/years: "la" -> 12, "ao"->20, "i5"->15, "17g3"->1793
5. Sanity checks: a parsed date must fall within the volume's date range. A leeway of 
                  60 days is allowed, since some letters can be slightly out of 
                  the volume's date range. A date outside that range that is also more than 45
                  days from the previous dateline is rejected, and the previous date
                  is kept.

* The French Republican calendar (1793-1805) has 12 months of exactly 30 days
followed by 5 or 6 days ("sans-culottides", or also written as "jours complémentaires")
Years are counted from the founding of the Republic. Year I began on 22 September 1792. Dates are written like "8 germinal an II".
"""
import json, re, sys
from datetime import date, timedelta
from pathlib import Path

#-----Calendars--------
#Gregorian month name -> month number. Accentless spellings are included
#because the OCR often drops accent.
GREG_MONTHS = {
    "janvier": 1, "fevrier":2, "février":2, "mars":3, "avril": 4, "mai": 5, 
    "juin":6, "juillet":7, "août":8, "aout":8, "septembre":9, "octobre":10,
    "novembre":11, "décembre":12,"decembre":12,
}
#The 12 Republican months in order.
#ventdse is a common OCR version error of ventôse.
#Numbers start at 0 because later on, script counts months already passed.
REP_MONTHS = {
             "vendémiaire":0, "vendemiaire":0,"brumaire":1,"frimaire":2,"nivôse":3,
             "nivose":3,"pluviôse":4,"pluviose":4,"ventôse":5,"ventose":5,"ventdse":5,
              "germinal":6,"floréal":7,"floreal":7, "prairial":8, "messidor":9,"thermidor":10,
              "fructidor":11,

            }
#Gregorian date of the first day of each Republican year.
REP_YEAR_START = {
                    1: date(1792,9,22), 2: date(1793,9,22),
                    3: date(1794,9,22), 4: date(1795,9,23),
}


def republican_to_gregorian(day,month_idx,year):
    '''
    Convert republican date to gregorian.
    '''
    #the first day of that republican year. E.g. year II(2) would return 22 Sept 1793
    start = REP_YEAR_START.get(year)
    #unknown year, or a day that can't exist
    if not start or not (1<=day<=30):
        return None
    #days since the start of the year: full months passed multiplied by 30,
    #plus days passed in this month (day - 1, since on the 1st no days have passed yet).
    #Adding the days to the start date gives the gregorian date.
    return start + timedelta(days = month_idx * 30 + day - 1)

#----OCR-tolerant number reading------
#Some digits are garbled by the OCR. The most common misreadings are listed here.
#A garbled character can stand for more than one digit. "s" can be 2 or 5, so all
#readings are returned. "S octobre" gives 2 October and 5 October and resolve() 
# picks one. Impossible days are dropped by read_days(). For instance, "sg" 
# gives 29 or 59. 59 is not a day so only 29 is kept. 
OCR_DIGITS = {
              "î": "1", "i": "1", "l": "1", "I": "1", "j": "1", "t": "1", "o": "0", "O": "0",
              "a": "2", "à": "2", "z": "2", "g": "9", "^": "9", "q": "9",
              "B": "8", "b": "6", "h": "4", "k": "4", "A": "4", "y": "7", "?": "7",
              "s": "25", "S": "25"
              } 
def read_numbers(tok):
    """
    Every number an OCR-garbled number could be, as a list.
    "20" -> [20], "s5" -> [25,55].
    """
    outs = [""] # stores readings built so far 
    for ch in tok.replace(" ", ""): #loops through each character, ignoring spaces ("2 6" -> "26")
        #a real digit stays itself, a garbled letter is looked up ("s"->"25", splits to 2 and 5)
        opts = ch if ch.isdigit() else OCR_DIGITS.get(ch, "")
        if opts:
            #extend every reading by every option. ["2","5"] + "s" -> ["22","25","52","55"]
            outs = [o + x for o in outs for x in opts]
            #remove duplicate readings, drop the empty one if no digit
            #if found, turn the strings into numbers
    return [int(o) for o in dict.fromkeys(outs) if o]

#Days sometimes written as words. Mostly the extra days at the end of the
#Republican year ("Deuxième jour des sans-culottides"), and "premier/1er/ier"
#for the 1st of a month.
WORD_DAYS = {
            "premier":1, "1er":1, "ier":1, "deuxieme":2, "deuxième":2,"second":2,
            "troisieme":3,"troisième":3, "quatrième":4, "quatrieme":4, "cinquieme":5, 
            "cinquième":5, "sixieme":6, "sixième":6,
             }

def read_days(tok):
    """
    All possible days for the day text of a heading, as a list.
    "Deuxième" -> [2], "1er" ->  [1], "15e" -> [15].
    """
    t = tok.strip().lower()
    #a day written as a word, or a special way of writing the 1st
    if t in WORD_DAYS or t in ("1°", "1º", '1"', 'i"'):
        return [WORD_DAYS.get(t,1)]
    #strip an ending after the number.Examples include "1er", "2e" which would
    #be converted to 1 and 2 respectively.
    t = re.sub(r"(er|ºr|e|°|º|\"|\*)$","",tok.strip())
    #read actual numbers and OCR-tolerant(read_numbers)
    #keeps only real days of the month
    return [d for d in read_numbers(t) if 1<= d <= 31]

#What the last character of a garbled year stands for. Found in the volumes, where
#the republican date is printed beside it confirms the year:
    # "1er prairial an II- 2O mai îjgà = 1794
    # "1er germinal an II - 21 mars îjyâ" = 1794
YEAR_LAST_DIGIT = {"a": "2", "z": "2", "à": "4", "â": "4", "ù": "4", "h": "4", "k": "4",
                   "A": "4", "s": "25", "S": "25"}

def read_greg_year(tok):
    """
    reads a possibly garbled gregorian year such as  "îjgà" -> 1794.
    """
    #last character, ignoring trailing punctuation such as  "îjgà." ->  "à"
    last = tok.strip().rstrip(".,;")[-1]
    #a real digit stays itself; a garbled letter is looked up ("à" -> 4)
    options = last if last.isdigit() else YEAR_LAST_DIGIT.get(last,"")
    #turn each option into a year, keeping only years the records can have (1792-1795)
    years = [1790 + int(d) for d in options if 2<= int(d) <=5]
    #exactly one possible year, use it. If none or two possible years, return None
    #expand() resolves if none or two possible years are returned
    return years[0] if len(years) == 1 else None

def read_rep_year(tok):
    '''
    Read a republican year,often OCR-garbled, as a number. 
    "II" -> 2, "111"->3, unreadable->None
    '''
    t = tok.strip().rstrip(".,;").upper()
    t = {"1": "I", "11": "II", "111": "III", "M": "III", "N": "II", "IL": "II", "U": "II",
             "IIL": "III", "IN": "III", "NI": "III", "IY": "IV", "LV": "IV"}.get(t, t)
    return {"I": 1, "II": 2, "III": 3, "IV": 4}.get(t) 

#-----dateline patterns--------

#one character of a day: a digit, or a letter the OCR uses for a digit
DAYC = r"[\dilIoOaàsSzgjtqyhkAbB^?]"
#a day written as a word with or without the accent
WORD_DAY = r"premier|deuxi[èe]me|troisi[èe]me|quatri[èe]me|cinqui[èe]me|sixi[èe]me"
#({WORD_DAY}|{DAYC}{{1,2}} matches a day,possibly represented as a word day or 1-3 day characters (e.g. "premier" or "1")
#(?:\s?{DAYC})? optional third character, possibly after a space ("2 6")
# (?:er|ºr|e|°|º|\"|\*)?) optional ending ("1er", "2e")
DAY = rf"({WORD_DAY}|{DAYC}{{1,2}}(?:\s?{DAYC})?(?:er|ºr|e|°|º|\"|\*)?)"
#a gregorian month name, with or without accents
GREG_MONTH = r"(janvier|f[ée]vrier|mars|avril|mai|juin|juillet|ao[ûu]t|septembre|octobre|novembre|d[ée]cembre)"
#a 1790s year shaped 1-7-9-x, letters allowed ("1793","17g3","îjgà")
#OCR garble can occur at any stage of the year. each square bracketed part matches
#the expected number at that location and the possible OCR garble
GREG_YEAR = r"([1iîIl]\s?[7yj]\s?[\dgq^?$]\s?[\dagzsyhSkA?^$âàù])"  
#a republican month name, with or without accents, plus "ventdse"
REP_MONTH = r"(vend[ée]miaire|brumaire|frimaire|niv[ôo]se|pluvi[ôo]se|vent[ôod]se|germinal|flor[ée]al|prairial|messidor|thermidor|fructidor)"
#"an" plus a short year token("an II","an 111"), the token ends at a space, dash or punctuation
#we do a lookahead that could be a dash, fullstop or comma etc
#e.g. 8 germinal an II - gregorian date
REP_YEAR = r"an\s+(\S{1,4}?)(?=[\s\-–—.,;]|$)"  
#an optional weekday before the day, gregorian (mardi) or republican (primidi)
# inner group:one of the names; outer group: name + spaces, made optional together via ?        
WEEKDAY = (r"(?:(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|primidi|duodi|tridi|"
           r"quartidi|quintidi|sextidi|septidi|octidi|nonidi|d[ée]cadi)\s+)?")
#------------------------------------------------------------------------------
# A dateline is a short heading line that gives a document's date.
# e.g. "Paris, 8 germinal an II." or "Séance du 26 février 1793."
#------------------------------------------------------------------------------
# PLACE consists of everything that can come before the date. It is matched but not used
# The regex needs to step over it to reach the day.
# Three optional parts, in this order:
    # with a capital or "[", at most 5 words and ends with a comma("Lille,","Au Quesnoy,","[Bitche],")
    # "séance du" or "Séance - du"
    # a weekday
PLACE = r"(?:[A-ZÀ-Ý\[][^\s,]*(?:\s+[^\s,]+){0,4},\s*)?(?:s[ée]ance\W{0,3}\s*du\s+)?" + WEEKDAY   
# A gregorian dateline read from start of paragraph: Up to 3 junk symbols (\W{0,3}), 
# the optional prefix PLACE, then day, gregorian month and year("* Liege, 13 janvier 1793")
# re.I: ignore upper/lower case
GREG_LINE = re.compile(rf"^\W{{0,3}}{PLACE}{DAY}\s+{GREG_MONTH}\s+{GREG_YEAR}", re.I)
# Similar structure as GREG_LINE, but for a republican date: "Paris, 8 germinal an II"
# \s* not \s+ between day and month. OCR sometimes glues them (13fructidor)
REP_LINE = re.compile(rf"^\W{{0,3}}{PLACE}{DAY}\s*{REP_MONTH}\s+{REP_YEAR}", re.I)
# The 5-6 extra days at the end of the Republican year (17-22 Sept). In Year II they are
# "sans-culottides"; in 1795 (Year III, Tome 27) they were renamed "jours complémentaires".
# E.g. "Deuxième jour des sans-culottides an II." "Paris, 1er jour complémentaire an III"
# After the day optional "jour(s)", then "(des) sans-culottide(s)" (hyphen or space
# optional, "sans culottide" also matches) or "complémentaire(s)" then the year.
SANSCUL_LINE = re.compile(rf"^\W{{0,3}}{PLACE}{DAY}\s*(?:jours?\s+)?"
                          rf"(?:(?:des\s+)?sans-?\s?culottides?|compl[ée]mentaires?)\s+{REP_YEAR}", re.I)
# the Gregorian date printed after the Republican one: "... an II - 27 novembre 1793"
# it uses a "lookbehind" to make sure it starts after a space, dash, comma or (
GREG_ANYWHERE = re.compile(rf"(?:^|(?<=[\s\-–—,(]))({DAYC}{{1,2}}(?:\s?{DAYC})?|1er)\s*{GREG_MONTH}\s+{GREG_YEAR}", re.I)
# Republican day missing or unreadable ("Paris, floréal an III - 18 mai 1795",
# "Amiens, ni floréal an III - 10 mai 1795"): up to 4 junk characters may stand where
# the day should be; the date then comes from the Gregorian half (GREG_ANYWHERE).
REP_NODAY_LINE = re.compile(rf"^\W{{0,3}}{PLACE}(?:\S{{1,4}}?\s*)?{REP_MONTH}\s+an\b", re.I)
# Datelines are short. Paragraphs up to this length are tested as possible datelines.
# Longer paragraphs are usually letter text, but some scans merge the dateline with
# the letter ("Paris, 21 floréal an III - 10 mai 1795. Nous avons..."), so only their
# first 140 characters are tested and only for republican datelines.
MAX_HEADER_LEN = 140

def parse_dateline(p):
    """
    If the paragraph is a dateline, return a list of candidate readings:
    ("greg",day,month,year or None)
    ("rep",day,month_idx,year or None)
    otherwise None
    Footnotes are never datelines. A dateline is normally a short paragraph.
    A long paragraph is only checked at its start, for a republican dateline followed
    by  "-", "–", "—", "." or "(", otherwise the date is part of a sentence
    """
    if p.startswith("[FOOTNOTE]"):
        return None
    is_long = len(p) > MAX_HEADER_LEN 
    if is_long:
        p = p[:MAX_HEADER_LEN]# if paragraph is longer than max_header_len, first 140 letters are taken
    cands = [] # to store potential datelines
    m = REP_LINE.match(p) or SANSCUL_LINE.match(p) # matches paragraph with republican heading or sans-culotide headings
    if m and is_long and not re.match(r"\s*[-–—.(]", p[m.end():]):
        return None                                # long paragraph, but no heading end
    if m:
        y = read_rep_year(m.group(m.lastindex))
        if m.re is SANSCUL_LINE:
            mo = 12
        else:
            mo = REP_MONTHS.get(m.group(2).lower())
        if mo is not None:
            cands += [("rep",d,mo,y)for d in read_days(m.group(1))]
        # republican headings in these volumes also print the gregorian date after
        # search from the start of the year group (5 fructidor 1793 - equivalent gregorian)
        # some republican headings have the year missing followed by a gregorian date ("floréal an 18 mai 1795"),
        # the regex takes 18 as the year
        g = GREG_ANYWHERE.search(p,m.start(m.lastindex))
        if g:
            cands += [("greg",d,GREG_MONTHS[g.group(2).lower()], read_greg_year(g.group(3)))
                      for d in read_days(g.group(1))]
        return cands or None
    # In long paragraphs, we only look for republican headings
    # Gregorian pattern is skipped. REP_NO_DAY_LINE below is republican, so it is still tried
    m = None if is_long else GREG_LINE.match(p)
    if m:
        cands += [("greg",d, GREG_MONTHS[m.group(2).lower()],read_greg_year(m.group(3)))
                  for d in read_days(m.group(1))]
    #republican day lost("Paris, floréal an III—18 mai 1795"): use the gregorian part
    elif REP_NODAY_LINE.match(p):
        g = GREG_ANYWHERE.search(p)
        if g:
            cands += [("greg",d, GREG_MONTHS[g.group(2).lower()],read_greg_year(g.group(3)))
                              for d in read_days(g.group(1))]
    return cands or None

#-------volume ranges (for sanity checks)--------------
TOME_RANGES = {
    1: ("1792-08-10", "1793-01-21"), 2: ("1793-01-22", "1793-03-31"),
    3: ("1793-04-01", "1793-05-05"), 4: ("1793-05-06", "1793-06-18"),
    5: ("1793-06-19", "1793-08-15"), 6: ("1793-08-16", "1793-09-21"),
    7: ("1793-09-22", "1793-10-24"), 8: ("1793-10-25", "1793-11-26"),
    9: ("1793-11-27", "1793-12-31"), 10: ("1794-01-01", "1794-02-08"),
    11: ("1794-02-09", "1794-03-15"), 12: ("1794-03-16", "1794-04-22"),
    13: ("1794-04-23", "1794-05-28"), 14: ("1794-05-29", "1794-07-07"),
    15: ("1794-07-08", "1794-08-09"), 16: ("1794-08-10", "1794-09-20"),
    17: ("1794-09-21", "1794-11-06"), 18: ("1794-11-07", "1794-12-20"),
    19: ("1794-12-21", "1795-01-31"), 20: ("1795-02-01", "1795-03-11"),
    21: ("1795-03-12", "1795-04-11"), 22: ("1795-04-12", "1795-05-09"),
    23: ("1795-05-10", "1795-06-02"), 24: ("1795-06-03", "1795-06-29"),
    25: ("1795-06-30", "1795-07-28"), 26: ("1795-07-29", "1795-08-29"),
    27: ("1795-08-30", "1795-09-25"), 28: ("1795-09-26", "1795-10-26"),
}

SLACK = timedelta(days=60) # letters/decrees printed slightly out of the range
MAX_JUMP = timedelta(days=45) # a jump bigger than this from the current date is suspect

def expand(c,lo,hi):
    """
    Turns one candidate reading into concrete dates. E.g. if the year
    is unknown, try the volume's years
    """
    kind, d, mo, y = c
    out = []
    if kind == "rep":
        if mo == 12 and not (1 <= d <= 6): # the extra days only go from 1 to 6. An impossible reading gives no dates
            return []
        years = [y] if y else [1,2,3,4] # if republican year is missing, try every year, and then resolve() decides on which year to use
        for yy in years:
            g = republican_to_gregorian(d,mo,yy) #converts republican to gregorian date
            if g:
                out.append(g)
    else:
        years = [y] if y else []
        for yy in years + [lo.year,hi.year]: #loops through year if found, and adds the year range found in the volume as a backup check
            try:
                out.append(date(yy,mo,d))
            except ValueError:
                pass
    # removes repeats (e.g. year 1794 + tome years 1794, 1794-> the same date 3 times),
    # so in resolve() each reading counts as one vote, whichever calendar it came from
    return list(dict.fromkeys(out)) 

def resolve(cands,current,lo,hi):
    """
    turns every reading into real dates via expand()
    """
    dates = [x for c in cands for x in expand(c,lo,hi)]
    #keeps dates inside the volume's range; if none, allow SLACK of 60 days for either side
    inside = [x for x in dates if lo <= x <= hi]
    near = [x for x in dates if lo - SLACK <= x <= hi + SLACK]
    pool = inside or near 
    # nothing even near the volume: a misread heading, so reject it
    if not pool:
        return None
    # compare against the previous heading's date, or the volume's first day at the start
    ref = current or lo
    # min() scores each date in pool and returns the date with the smallest score
    #   1. votes first(-dates.count(x)): the date given by the most readings wins. It is negated so that more votes = smaller score.
    #   2. on a tie, the date closest to ref(the previous heading's date, or the volume's first day if there is no previous heading yet).
    # This settles headings whose readings disagree on the day.Example : in
    # "14 vendemiaire an III - S October 1794", S could either be 2 or 5; the Republican
    # half also gives 5 October, so 5 October wins with 2 votes.
    best = min(pool, key=lambda x:(-dates.count(x), abs(x-ref)))
    # a jump of more than MAX_JUMP (45 days) to a date outside the volume is an OCR error
    if current and abs(best - current) > MAX_JUMP and not (lo <= best <= hi):
        return None
    return best

#--------main---------------
def date_volume(records):
    """
    Date every paragraph of one volume, in reading order.
    When a paragraph is a dateline (parse_dateline + resolve), its date becomes
    current date; every other paragraph gets the current date carried forward.
    Returns one row per paragraph, plus counts of datelines used and rejected.
    """
    tome = records[0]["tome"]
    lo, hi = (date.fromisoformat(x) for x in TOME_RANGES[tome])
    current, current_raw = None, None # last accepted date and its heading carried forward
    out, stats = [], {"headers":0, "rejected":0}
    for r in records: # each page
        for i,p in enumerate(r['text'].split("\n\n")):  # each paragraph on it
            p = p.strip()
            if not p:
                continue
            src = "carried"  # assume no dateline; changed below if accepted
            parsed = parse_dateline(p)
            if parsed:
                d = resolve(parsed, current, lo, hi)
                if d:
                    current, current_raw, src = d, p, "header"
                    stats["headers"] += 1
                else:
                    stats["rejected"] += 1 # implausible date: keep the previous one
            out.append({"tome": tome, "view": r["view"], "para": i, "text": p,
                        "date": current.isoformat() if current else None,
                        "date_source": src, "date_raw": current_raw})
    return out, stats

def main(paths):
    """
    Date each cleaned volume in paths and write <name>.dated.jsonl next to it,
    printing a summary line per volume (datelines used, rejected, undated paragraphs)
    """
    for path in map(Path, paths):
        #json.loads loops through each page in the volume and returns a dictionary
        records = [json.loads(l) for l in open(path, encoding="utf-8")]
        if not records:
            continue
        out, stats = date_volume(records)
        dest = path.with_name(path.stem + ".dated.jsonl")
        with open(dest,"w",encoding ="utf-8") as f:
            for o in out:
                f.write(json.dumps(o, ensure_ascii =False) + "\n")
        undated = sum(o["date"] is None for o in out)
        print(f"{path.name}: {stats['headers']} datelines used, {stats['rejected']} rejected as "
              f"implausible, {undated} of {len(out)} paragraphs before the first date -> {dest.name}")
if __name__ == "__main__":
    main(sys.argv[1:])
