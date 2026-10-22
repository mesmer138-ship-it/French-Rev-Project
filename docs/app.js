// ---------------------------------------------------------------
// 1. Source images: use the real file if it exists, else keep the
//    labelled placeholder.
// ---------------------------------------------------------------
document.querySelectorAll('.source__fig[data-img]').forEach((fig) => {
  const img = new Image();
  img.alt = fig.querySelector('.source__ph').textContent.trim();
  img.onload = () => {
    fig.querySelector('.source__ph').replaceWith(img);
    fig.querySelectorAll('.todo').forEach((el) => el.remove());
  };
  img.src = fig.dataset.img;
});

// ---------------------------------------------------------------
// 2. Person picker and timeline
// ---------------------------------------------------------------

// Everyone shown in the picker. Only people with data in
// window.PEOPLE (data/people.js) can be opened; the rest show "soon".
const ROSTER = [
  { slug: 'houchard', name: 'Houchard' },
  { slug: 'kellermann', name: 'Kellermann' },
  { slug: 'danton', name: 'Danton' },
  { slug: 'robespierre', name: 'Robespierre' },
  { slug: 'marie-antoinette', name: 'Marie-Antoinette' },
  { slug: 'du-barry', name: 'Du Barry' },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

// "1793-09-26" -> { day: 26, month: "Sep", long: "26 September 1793" }
function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return { day: d, mon: MONTHS[m - 1].slice(0, 3), year: y,
           long: `${d} ${MONTHS[m - 1]} ${y}` };
}

// Small helper: create an element with a class and optional text.
// textContent (not innerHTML) is used so data can never inject markup.
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function portraitCard(p) {
  const li = el('li', 'tl-item tl-item--portrait');
  const card = el('article', 'card card--portrait');
  const fig = el('figure', 'portrait');
  if (p.portrait) {
    const img = new Image();
    img.src = p.portrait;
    img.alt = `Portrait of ${p.name}`;
    fig.append(img);
  } else {
    fig.append(el('div', 'portrait__ph', 'Portrait to come'));
  }
  const text = el('div', 'portrait__text');
  text.append(el('p', 'card__kicker', p.role),
              el('h3', 'card__name', p.name));
  card.append(fig, text);
  li.append(card);
  return li;
}

function bioCard(p) {
  const li = el('li', 'tl-item');
  const card = el('article', 'card card--bio');
  const src = el('a', 'card__link', p.bio_source.label);
  src.href = p.bio_source.url;
  src.target = '_blank';
  src.rel = 'noopener';
  const fact = el('p', 'fact');
  fact.append(el('span', 'fact__label', 'A detail worth knowing'), ' ', p.fun_fact);
  card.append(el('p', 'card__kicker', 'Who he was'), el('p', 'bio', p.bio), fact, src);
  li.append(card);
  return li;
}

// Short definitions shown on a card when its text mentions the word.
const GLOSSARY = [
  ['Dumouriez', 'Dumouriez', 'French general who went over to the Austrians in April 1793, after which every general fell under suspicion.'],
  ['Lyon', 'Revolt of Lyon', 'In 1793 Lyon rose against the Convention. The city was besieged by republican armies from August and fell in October.'],
  ['Piémont|Piedmont', 'Piedmontese', 'Troops of the Kingdom of Sardinia-Piedmont, an enemy of the Republic on the Alpine frontier.'],
  ['Alpes|Alps', 'Army of the Alps', 'The French army that defended the south-eastern frontier. Kellermann commanded it in 1793.'],
  ["Collot d'Herbois", "Collot d'Herbois", 'Radical Jacobin deputy of the Convention, later a member of the Committee of Public Safety.'],
  ['Dantonistes', 'Dantonists', 'Followers of Danton, sometimes called the Indulgents, who wanted to ease the Terror.'],
  ['Capet', 'Capet', 'Louis XVI after he lost his title: the Republic called him Louis Capet. The name also stands for the royal family.'],
  ['Jacobins|LCJbins|Jacobin', 'Jacobins', 'The Paris political club that dominated the Convention in 1793 and 1794.'],
  ['Pitt', 'Pitt', 'William Pitt, the British prime minister. Revolutionaries blamed “Pitt’s agents” for plots against the Republic.'],
  ["décret d'accusation|décrète d'accusation|decree of accusation", "décret d'accusation", 'A Convention vote sending a deputy to the Revolutionary Tribunal.'],
  ['Tribunal révolutionnaire|Revolutionary Tribunal', 'Revolutionary Tribunal', 'The Paris court created in 1793 to try enemies of the Republic.'],
  ['Médicis|Medici', "Catherine de' Medici", 'Italian-born queen of France in the 16th century, blamed by the revolutionaries as a foreign influence.'],
  ['Comité de salut public|Committee of Public Safety', 'Committee of Public Safety', 'The Convention’s executive committee. Robespierre was its leading voice in 1793 and 1794.'],
  ['destitution|dismiss', 'destitution', 'Removal from command. In 1793 it often led to arrest.'],
];

function termsFor(a) {
  if (a.terms) return a.terms;
  const text = `${a.passage_fr} ${a.passage_en} ${a.charge_fr}`;
  return GLOSSARY.filter(([re]) => new RegExp(re, 'i').test(text)).map(([, t, d]) => [t, d]);
}

function accusationCard(a, i, total, p) {
  const d = formatDate(a.date);
  const li = el('li', 'tl-item');
  const seal = el('div', 'seal');
  seal.append(el('span', 'seal__day', String(d.day)), el('span', 'seal__mon', d.mon));
  seal.title = d.long;

  // Card 1: the whole original passage, exactly as the pipeline read it.
  const flagged = a.kind === 'reaction' || a.kind === 'noncharge' || a.kind === 'mention';
  const label = a.label ? a.label
    : a.kind === 'early' ? 'Early suspicion'
    : a.kind === 'reaction' ? 'Reaction, not a charge'
    : `Accusation ${i + 1} of ${total}`;
  const src = el('article', 'card card--accusation card--source' + (flagged ? ' card--reaction' : ''));
  src.append(
    el('p', 'card__kicker', `${label} · ${d.long}`),
    el('p', 'charge charge--fr', a.passage_fr),
    el('p', 'charge charge--en', a.passage_en),
    el('p', 'passage__cite',
       `Aulard, Recueil des actes du Comité de salut public, tome ${a.tome}, view ${a.view}. Text as read from the scan, so OCR slips are kept.`));

  // Card 2: what the pipeline made of it (condensed charge + the model's reasoning).
  const ctx = el('article', 'card card--context');
  ctx.append(
    el('p', 'card__kicker', 'What the pipeline made of it'),
    el('p', 'ctx__label', 'Extracted charge'),
    el('p', 'ctx__fr', a.charge_fr),
    el('p', 'ctx__en', a.charge_en),
    el('p', 'ctx__label', 'Why the model kept it'),
    el('p', 'ctx__reason', a.reasoning));

  // Execution meter: p_execution is the model's score for this one charge (0 to 1).
  // It is a ranking score, not a calibrated probability, so the label says so.
  if (a.limit) ctx.append(el('p', 'ctx__label', 'A limit this shows'), el('p', 'ctx__reason', a.limit));
  if (a.note) ctx.append(el('p', 'ctx__label', 'Reading note'), el('p', 'ctx__reason', a.note));
  const terms = termsFor(a);
  if (terms.length) {
    ctx.append(el('p', 'ctx__label', 'Terms'));
    terms.forEach(([t, d]) => {
      const p = el('p', 'ctx__term');
      p.append(el('b', null, t + '. '), document.createTextNode(d));
      ctx.append(p);
    });
  }

  if (!(p && p.no_meter)) {
  const meter = el('div', 'meter');
    const fill = el('div', 'meter__fill');
    fill.style.width = `${Math.round(a.p_execution * 100)}%`;
    const track = el('div', 'meter__track');
    track.append(fill);
    track.setAttribute('role', 'meter');
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', '1');
    track.setAttribute('aria-valuenow', String(a.p_execution));
    track.setAttribute('aria-label', 'Execution score');
    meter.append(
      el('p', 'ctx__label', 'Execution meter'),
      track,
      el('p', 'meter__num', `${a.p_execution.toFixed(2)} · model score, not a probability`),
      el('p', 'meter__note', `Not the charge alone: the score also takes in the accused's social class and the date (${d.long}).`));
    ctx.append(meter);
  }

  const arrow = el('div', 'tl-arrow', '→');
  arrow.setAttribute('aria-hidden', 'true');
  const pair = el('div', 'tl-pair');
  pair.append(src, arrow, ctx);
  li.append(seal, pair);
  return li;
}

// Closing card: the outcome is revealed here, after the evidence.
function verdictCard(p) {
  const li = el('li', 'tl-item tl-item--verdict');
  const ps = p.accusations.map((a) => a.p_execution);
  const mean = ps.reduce((x, y) => x + y, 0) / ps.length;
  const flagged = p.accusations.filter((x) => x.kind === 'reaction' || x.kind === 'noncharge').length;
  const card = el('article', 'card card--verdict');
  card.append(
    el('p', 'card__kicker', 'The outcome'),
    el('p', 'verdict__text', p.outcome),
    el('p', 'verdict__stats', p.verdict_stats ||
       `${ps.length} extracted entries` + (flagged ? ` (${flagged} the model's own reasoning says are not charges)` : '') +
       `. Scores ran from ${Math.min(...ps).toFixed(2)} to ${Math.max(...ps).toFixed(2)}, mean ${mean.toFixed(2)}.`),
    el('p', 'verdict__note', p.verdict_note ||
       'The outcome comes from Wallon’s record of the tribunal. The scores come from a model that leans mostly on date and class, and they are not probabilities. See the limits below.'));
  li.append(card);
  return li;
}

// One colour pair per person: [portrait/seal colour, bio colour]
const THEMES = {
  houchard: ['#7d1f27', '#13233f'],
  kellermann: ['#2d5a3d', '#16281d'],
  danton: ['#9a5b1c', '#3a2410'],
  robespierre: ['#4b2e63', '#231532'],
  'marie-antoinette': ['#2a5f94', '#14263d'],
  'du-barry': ['#8b3a5a', '#2e1a26'],
};

function applyTheme(slug) {
  const [a, b] = THEMES[slug] || THEMES.houchard;
  const sec = document.getElementById('people');
  sec.style.setProperty('--oxblood', a);
  sec.style.setProperty('--navy', b);
}

function showPerson(slug) {
  const p = window.PEOPLE[slug];
  const list = document.getElementById('timeline');
  list.replaceChildren(
    portraitCard(p),
    bioCard(p),
    ...p.accusations.map((a, i) => accusationCard(a, i, p.accusations.length, p)),
    verdictCard(p));
  applyTheme(slug);
  document.getElementById('timeline-wrap').hidden = false;
  document.querySelectorAll('.picker__btn').forEach((b) =>
    b.setAttribute('aria-selected', String(b.dataset.slug === slug)));
  document.getElementById('timeline-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildPicker() {
  const picker = document.getElementById('picker');
  ROSTER.forEach(({ slug, name }) => {
    const ready = Boolean(window.PEOPLE && window.PEOPLE[slug]);
    const btn = el('button', 'picker__btn', name);
    btn.type = 'button';
    btn.dataset.slug = slug;
    btn.style.setProperty('--c', (THEMES[slug] || THEMES.houchard)[0]);
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', 'false');
    if (ready) {
      btn.addEventListener('click', () => showPerson(slug));
    } else {
      btn.disabled = true;
      btn.append(el('span', 'picker__soon', 'soon'));
    }
    picker.append(btn);
  });
}

buildPicker();
