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
// 2. Person picker and horizontal timeline
// ---------------------------------------------------------------

// Everyone shown in the picker. Only people with data in
// window.PEOPLE (data/people.js) can be opened; the rest show "soon".
const ROSTER = [
  { slug: 'houchard', name: 'Houchard' },
  { slug: 'kellermann', name: 'Kellermann' },
  { slug: 'danton', name: 'Danton' },
  { slug: 'robespierre', name: 'Robespierre' },
  { slug: 'marie-antoinette', name: 'Marie-Antoinette' },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

// "1793-09-26" -> { day: 26, mon: "Sep", long: "26 September 1793" }
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

// Short definitions shown on a card when its text mentions the word.
const GLOSSARY = [
  ['Dumouriez|Dumourier', 'Dumouriez', 'French general who went over to the Austrians in April 1793, after which every general fell under suspicion.'],
  ['Lyon', 'Revolt of Lyon', 'Lyon rose against the Convention at the end of May 1793. Republican armies besieged it from August; it fell in October.'],
  ['Piémont|Piedmont', 'Piedmontese', 'Troops of the Kingdom of Sardinia-Piedmont, an enemy of the Republic on the Alpine frontier.'],
  ['Hondschoote', 'Hondschoote', 'Houchard’s victory over the British and Hanoverians on 8 September 1793, which relieved the siege of Dunkirk.'],
  ["Collot d'Herbois|Collot-d'Herbois", "Collot d'Herbois", 'Radical Jacobin deputy, member of the Committee of Public Safety.'],
  ['Dantonistes|Dantonists', 'Dantonists', 'Followers of Danton, sometimes called the Indulgents, who wanted to ease the Terror.'],
  ['Capet', 'Capet', 'Louis XVI after he lost his title: the Republic called him Louis Capet. The name also stands for the royal family.'],
  ['Jacobins|LCJbins|Jacobin', 'Jacobins', 'The Paris political club that dominated the Convention in 1793 and 1794.'],
  ['Girondins|Gensonné|Genfonné|Brissot|Brillot', 'Girondins', 'The moderate republican faction, Brissot’s group, expelled from the Convention on 2 June 1793 and tried in October.'],
  ['Pitt', 'Pitt', 'William Pitt, the British prime minister. Revolutionaries blamed “Pitt’s agents” for plots against the Republic.'],
  ["décret d'accusation|décrète d'accusation|décrétés d'accusation|decree of accusation|decreed the accusation", "décret d'accusation", 'A Convention vote sending someone to the Revolutionary Tribunal.'],
  ['Tribunal révolutionnaire|Revolutionary Tribunal', 'Revolutionary Tribunal', 'The Paris court created in 1793 to try enemies of the Republic.'],
  ['Comité de salut public|Committee of Public Safety', 'Committee of Public Safety', 'The Convention’s executive committee. Robespierre was its leading voice in 1793 and 1794.'],
  ['destitution|destitué|dismiss', 'destitution', 'Removal from command. In 1793 it often led to arrest.'],
  ['Abbaye', 'The Abbaye', 'A Paris prison, used for suspects awaiting trial.'],
  ['Thermidor', 'Thermidor', 'A month of the revolutionary calendar. 9 Thermidor Year II (27 July 1794) is the day Robespierre fell.'],
  ['prairial', '22 Prairial', 'The law of 10 June 1794 that sped up the Revolutionary Tribunal and removed most rights of defence.'],
  ['Maison commune|Hôtel de Ville', 'Maison commune', 'The Paris city hall (Hôtel de Ville), seat of the Commune, where Robespierre’s supporters gathered on 9 Thermidor.'],
  ['Varennes', 'Varennes', 'The royal family’s failed flight from Paris in June 1791, stopped at Varennes.'],
  ['Temple', 'The Temple', 'The Paris fortress where the royal family was held after August 1792.'],
];

function termsFor(a) {
  const text = `${a.passage_fr} ${a.passage_en} ${a.charge_fr || ''}`;
  return GLOSSARY.filter(([re]) => new RegExp(re, 'i').test(text)).map(([, t, d]) => [t, d]);
}

// Portrait and short biography, shown above the timeline.
function personHead(p) {
  const head = el('div', 'person');
  const fig = el('figure', 'person__portrait');
  if (p.portrait) {
    const img = new Image();
    img.src = p.portrait;
    img.alt = `Portrait of ${p.name}`;
    fig.append(img);
  } else {
    fig.append(el('div', 'portrait__ph', 'Portrait to come'));
  }
  const text = el('div', 'person__text');
  const fact = el('p', 'fact');
  fact.append(el('span', 'fact__label', 'A detail worth knowing'), ' ', p.fun_fact);
  text.append(el('p', 'card__kicker', p.role), el('h3', 'card__name', p.name),
              el('p', 'person__outcome', p.outcome), el('p', 'bio', p.bio), fact);
  head.append(fig, text);
  return head;
}

// An act heading: a chapter marker on the timeline.
function actItem(a) {
  const li = el('li', 'htl-act');
  li.append(el('p', 'htl-act__title', a.title));
  if (a.sub) li.append(el('p', 'htl-act__sub', a.sub));
  return li;
}

// One dated card: the passage as printed, then (for charges) the score.
function cardItem(a) {
  const d = formatDate(a.date);
  const li = el('li', 'htl-item' + (a.kind === 'charge' ? ' htl-item--charge' : ' htl-item--context'));

  const seal = el('div', 'seal');
  seal.append(el('span', 'seal__day', a.seal_day || String(d.day)), el('span', 'seal__mon', d.mon));
  seal.title = a.date_text || d.long;

  const card = el('article', 'card ' + (a.kind === 'charge' ? 'card--charge' : 'card--context-item'));
  card.append(el('p', 'card__kicker', `${a.label} · ${a.date_text || d.long}`));

  const fr = el('p', 'charge charge--fr', a.passage_fr);
  card.append(fr);
  // Long passages are clamped, with a button to show the rest.
  if (a.passage_fr.length > 420) {
    fr.classList.add('is-clamped');
    const more = el('button', 'more', 'Show the full passage');
    more.type = 'button';
    more.addEventListener('click', () => {
      const closed = fr.classList.toggle('is-clamped');
      more.textContent = closed ? 'Show the full passage' : 'Show less';
    });
    card.append(more);
  }
  card.append(el('p', 'charge charge--en', a.passage_en), el('p', 'passage__cite', a.source));

  if (a.kind === 'charge') {
    const ctx = el('div', 'ctx');
    ctx.append(
      el('p', 'ctx__label', 'Extracted charge'),
      el('p', 'ctx__fr', a.charge_fr),
      el('p', 'ctx__en', a.charge_en));

    // Execution meter: p_execution is the model's score for this one charge (0 to 1).
    // It is a ranking score, not a calibrated probability, so the label says so.
    const fill = el('div', 'meter__fill');
    fill.style.width = `${Math.round(a.p_execution * 100)}%`;
    const track = el('div', 'meter__track');
    track.append(fill);
    track.setAttribute('role', 'meter');
    track.setAttribute('aria-valuemin', '0');
    track.setAttribute('aria-valuemax', '1');
    track.setAttribute('aria-valuenow', String(a.p_execution));
    track.setAttribute('aria-label', 'Execution score');
    const meter = el('div', 'meter');
    meter.append(
      el('p', 'ctx__label', 'Execution meter'),
      track,
      el('p', 'meter__num', `${a.p_execution.toFixed(2)} · model score`));
    ctx.append(meter);
    card.append(ctx);
  } else {
    card.append(el('p', 'context__tag', 'Context · no score'));
  }

  const terms = termsFor(a);
  if (terms.length) {
    const box = el('div', 'terms');
    box.append(el('p', 'ctx__label', 'Terms'));
    terms.forEach(([t, def]) => {
      const p = el('p', 'ctx__term');
      p.append(el('b', null, t + '. '), document.createTextNode(def));
      box.append(p);
    });
    card.append(box);
  }

  li.append(seal, card);
  return li;
}

// Closing card: the outcome is revealed here, after the evidence.
function verdictItem(p) {
  const li = el('li', 'htl-item htl-item--verdict');
  const cards = p.timeline.filter((x) => x.type === 'card');
  const ps = cards.filter((x) => x.kind === 'charge').map((x) => x.p_execution);
  const mean = ps.reduce((x, y) => x + y, 0) / ps.length;
  const card = el('article', 'card card--verdict');
  card.append(
    el('p', 'card__kicker', 'The outcome'),
    el('p', 'verdict__text', p.outcome),
    el('p', 'verdict__stats',
       `${cards.length} cards, ${ps.length} of them scored charges. ` +
       `Scores ran from ${Math.min(...ps).toFixed(2)} to ${Math.max(...ps).toFixed(2)}, mean ${mean.toFixed(2)}.`));
  const seal = el('div', 'seal seal--verdict');
  seal.append(el('span', 'seal__day', '✦'));
  li.append(seal, card);
  return li;
}

// One colour pair per person: [accent colour, dark colour]
const THEMES = {
  houchard: ['#7d1f27', '#13233f'],
  kellermann: ['#2d5a3d', '#16281d'],
  danton: ['#9a5b1c', '#3a2410'],
  robespierre: ['#4b2e63', '#231532'],
  'marie-antoinette': ['#2a5f94', '#14263d'],
};

function applyTheme(slug) {
  const [a, b] = THEMES[slug] || THEMES.houchard;
  const sec = document.getElementById('people');
  sec.style.setProperty('--oxblood', a);
  sec.style.setProperty('--navy', b);
}

// Scroll the timeline by about one card, left (-1) or right (+1).
function step(dir) {
  const scroller = document.getElementById('htl');
  const item = scroller.querySelector('.htl-item');
  const by = item ? item.getBoundingClientRect().width + 28 : scroller.clientWidth * 0.8;
  scroller.scrollBy({ left: dir * by, behavior: 'smooth' });
}

// Keep the progress bar, the arrows and the act chips in step with the scroll.
function syncControls() {
  const s = document.getElementById('htl');
  const max = s.scrollWidth - s.clientWidth;
  const f = max > 0 ? s.scrollLeft / max : 0;
  document.getElementById('htl-progress').style.width = `${Math.round(f * 100)}%`;
  document.getElementById('htl-prev').disabled = s.scrollLeft < 4;
  document.getElementById('htl-next').disabled = s.scrollLeft > max - 4;
  const left = s.getBoundingClientRect().left;
  let current = 0;
  s.querySelectorAll('.htl-act').forEach((a, i) => {
    if (a.getBoundingClientRect().left - left < s.clientWidth * 0.5) current = i;
  });
  document.querySelectorAll('.chip').forEach((c, i) => c.classList.toggle('is-current', i === current));
}

function showPerson(slug) {
  const p = window.PEOPLE[slug];
  document.getElementById('person-head').replaceChildren(personHead(p));

  const track = document.getElementById('timeline');
  const items = p.timeline.map((x) => (x.type === 'act' ? actItem(x) : cardItem(x)));
  track.replaceChildren(...items, verdictItem(p));

  // Act chips: jump straight to a chapter.
  const chips = document.getElementById('htl-chips');
  chips.replaceChildren();
  track.querySelectorAll('.htl-act').forEach((act) => {
    const title = act.querySelector('.htl-act__title').textContent;
    const b = el('button', 'chip', title.split(' · ')[0]);
    b.type = 'button';
    b.title = title;
    b.addEventListener('click', () => {
      const s = document.getElementById('htl');
      s.scrollTo({ left: act.offsetLeft - parseInt(getComputedStyle(track).paddingLeft, 10), behavior: 'smooth' });
    });
    chips.append(b);
  });

  applyTheme(slug);
  const wrap = document.getElementById('timeline-wrap');
  wrap.hidden = false;
  document.getElementById('htl').scrollLeft = 0;
  syncControls();
  document.querySelectorAll('.picker__btn').forEach((b) =>
    b.setAttribute('aria-selected', String(b.dataset.slug === slug)));
  wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

function wireControls() {
  const s = document.getElementById('htl');
  document.getElementById('htl-prev').addEventListener('click', () => step(-1));
  document.getElementById('htl-next').addEventListener('click', () => step(1));
  s.addEventListener('scroll', syncControls, { passive: true });
  window.addEventListener('resize', syncControls);
  // Arrow keys move one card at a time when the timeline has focus.
  s.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  });
}

// ---------------------------------------------------------------
// 3. Inside the model: grouped SHAP waterfalls, drawn in the page's
//    own type so they match the rest of the site.
// ---------------------------------------------------------------
const AXIS = [-1.5, 3.5];   // shared log-odds scale, so the five charts compare directly

function pos(v) {           // log-odds value -> percentage across the chart
  return ((v - AXIS[0]) / (AXIS[1] - AXIS[0])) * 100;
}

function waterfall(c, base) {
  const fig = el('div', 'wf');
  const detail = { 'Date': c.date_text.split(' (')[0], 'Social class': c.social_class, 'Charge text': 'the wording of the charge' };

  // A faint line where the average case sits, and one where this person ends up.
  const guides = el('div', 'wf__guides');
  const avg = el('span', 'wf__guide wf__guide--base');
  avg.style.left = `${pos(base)}%`;
  const end = el('span', 'wf__guide wf__guide--end');
  end.style.left = `${pos(c.fx)}%`;
  guides.append(avg, end);

  const rows = el('div', 'wf__rows');
  let at = base;
  // Same order on every chart, so the five can be compared row by row.
  const ORDER = ['Charge text', 'Date', 'Social class'];
  const bars = [...c.bars].sort((a, b) => ORDER.indexOf(a[0]) - ORDER.indexOf(b[0]));
  bars.forEach(([name, v]) => {
    const row = el('div', 'wf__row');
    const lab = el('div', 'wf__label');
    lab.append(el('span', 'wf__name', name), el('span', 'wf__detail', detail[name]));
    const track = el('div', 'wf__track');
    const bar = el('div', 'wf__bar ' + (v >= 0 ? 'wf__bar--up' : 'wf__bar--down'));
    const from = Math.min(at, at + v), to = Math.max(at, at + v);
    bar.style.left = `${pos(from)}%`;
    bar.style.width = `${pos(to) - pos(from)}%`;
    const val = el('span', 'wf__val', (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2));
    val.style.left = v >= 0 ? `calc(${pos(to)}% + 6px)` : '';
    val.style.right = v < 0 ? `calc(${100 - pos(from)}% + 6px)` : '';
    track.append(bar, val);
    row.append(lab, track);
    rows.append(row);
    at += v;
  });

  const axis = el('div', 'wf__axis');
  for (let t = AXIS[0] + 0.5; t <= AXIS[1]; t += 1) {
    const tick = el('span', 'wf__tick', t > 0 ? `+${t}` : String(t).replace('-', '−'));
    tick.style.left = `${pos(t)}%`;
    axis.append(tick);
  }
  const legend = el('div', 'wf__legend');
  legend.append(el('span', 'wf__key wf__key--down', 'towards acquittal'),
                el('span', 'wf__key wf__key--up', 'towards execution'));

  const plot = el('div', 'wf__plot');
  plot.append(guides, rows);
  fig.append(plot, axis, legend);
  return fig;
}

function explainedCard(c, base) {
  const art = el('article', 'card xp');
  const left = el('div', 'xp__text');
  left.append(
    el('p', 'card__kicker', `${c.date_text} · ${c.social_class}`),
    el('h3', 'xp__name', c.name),
    el('p', 'xp__role', c.role),
    el('p', 'ctx__label', 'Charge'),
    el('p', 'ctx__fr', c.charge_fr),
    el('p', 'ctx__en', c.charge_en));
  const right = el('div', 'xp__chart');
  const head = el('div', 'xp__head');
  const verdict = el('span', 'xp__outcome ' + (c.executed ? 'xp__outcome--exec' : 'xp__outcome--acq'), c.outcome);
  head.append(el('span', 'xp__score', `${c.score.toFixed(2)} · model score`), verdict);
  right.append(head, waterfall(c, base));
  art.append(left, right);
  return art;
}

function buildExplained() {
  const list = document.getElementById('explained-list');
  if (!list || !window.EXPLAINED) return;
  const { base, cases } = window.EXPLAINED;
  list.replaceChildren(...cases.map((c) => explainedCard(c, base)));
}

buildPicker();
wireControls();
buildExplained();
