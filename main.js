// Kingside 1.0 download page: the rating ladder, copy buttons, the stage crossfade, the download picker, entrances.
document.documentElement.classList.add('js');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- the ladder: slide a rating, meet the nearest opponent ----------
const BOTS = [
  ['Pip', 250, 'Pawn-shop kid. Loves every piece equally.', 'Beginner'],
  ['Grandma Odette', 450, 'Brings her queen out early. Bakes cookies.', 'Beginner'],
  ['Tumble', 600, 'A robot with loose wiring. Never misses mate in one.', 'Beginner'],
  ['Coach Riley', 900, 'Solid, patient, punishes hanging pieces.', 'Intermediate'],
  ['Captain Brine', 1000, 'Pirate. Boards your position with rooks and hooks.', 'Themed'],
  ['Sable', 1100, 'Park hustler. Gambits, traps and smooth talk.', 'Intermediate'],
  ['Sir Percival', 1200, 'Knight errant. Would rather move a knight than anything.', 'Themed'],
  ['Professor Lumen', 1300, 'Slow, positional, talks about structure.', 'Intermediate'],
  ['Chef Basil', 1400, 'Trades everything. Says he is "reducing the sauce."', 'Themed'],
  ['Vex', 1500, 'All attack, all the time. Sacrifices first, asks later.', 'Advanced'],
  ['DJ Volt', 1600, 'Plays on the beat. Flashy, fast, loves checks.', 'Themed'],
  ['Marisol', 1700, 'Endgame grinder. Trades down and squeezes.', 'Advanced'],
  ['Atlas', 1900, 'Builds fortresses. Breaking him takes a plan.', 'Advanced'],
  ['Orrin the Wizard', 2000, 'Sees combinations nobody else does. Sacrifices with a flourish.', 'Themed'],
  ['The Duke', 2200, 'Classical, precise, never hangs a pawn.', 'Master'],
  ['Nyx', 2500, 'Sharp, tricky, talks trash under time pressure.', 'Master'],
  ['Kingside Engine', 3000, 'Full-strength Stockfish 19. Silent. Merciless.', 'Engine'],
];
const $ = (id) => document.getElementById(id);
const range = $('rating');
if (range) {
  const foe = document.querySelector('.foe');
  let shown = 'Coach Riley';
  const pick = (r) => BOTS.reduce((a, b) => (Math.abs(b[1] - r) < Math.abs(a[1] - r) ? b : a));
  const update = () => {
    const r = +range.value;
    $('rating-out').value = r;
    $('rating-out').textContent = r;
    const [name, elo, tag, tier] = pick(r);
    if (name === shown) return;
    shown = name;
    const fill = () => {
      $('foe-name').textContent = name;
      $('foe-elo').textContent = elo;
      $('foe-tag').textContent = tag;
      $('foe-tier').textContent = tier;
      foe.classList.remove('swap');
    };
    if (still) return fill();
    foe.classList.add('swap');
    setTimeout(fill, 120);
  };
  range.addEventListener('input', update);
}

// ---------- copy buttons ----------
document.querySelectorAll('[data-copy]').forEach((b) => {
  const label = b.textContent;
  b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      b.textContent = 'Copied';
    } catch {
      b.textContent = b.dataset.copy;
    }
    setTimeout(() => (b.textContent = label), 1600);
  });
});

// ---------- the stage: the picture follows the section in view ----------
const shots = [...document.querySelectorAll('.shot')];
if (shots.length && 'IntersectionObserver' in window) {
  const show = (key) => shots.forEach((s) => s.classList.toggle('on', s.dataset.for === key));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && show(e.target.dataset.shot)),
    { rootMargin: '-45% 0px -45% 0px' },
  );
  document.querySelectorAll('[data-shot]').forEach((s) => io.observe(s));
}

// ---------- the download picker ----------
const REL = 'https://github.com/Wisestcatlyfriend/kingside-chess/releases/download/v1.0.0/';
const FILES = {
  win: ['Kingside_1.0.0_x64-setup.exe', 'Download for Windows', 'Windows 10 or 11, 64-bit. If Windows warns you, click More info, then Run anyway.'],
  arm: ['Kingside_1.0.0_aarch64.dmg', 'Download for Mac', 'macOS 11 or later on M1, M2, M3 or M4. The first time, right-click Kingside in Applications and choose Open.'],
  intel: ['Kingside_1.0.0_x64.dmg', 'Download for Mac', 'macOS 11 or later on an Intel Mac. The first time, right-click Kingside in Applications and choose Open.'],
};
const osSeg = document.querySelector('.seg:not(.seg-chip)');
const chipSeg = document.querySelector('.seg-chip');
if (osSeg && chipSeg) {
  let os = 'win', chip = 'arm';
  const ua = navigator.userAgent;
  if (/Macintosh|Mac OS X/.test(ua)) os = 'mac';
  const render = () => {
    osSeg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.os === os)));
    chipSeg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.chip === chip)));
    chipSeg.hidden = os !== 'mac';
    const [file, label, note] = FILES[os === 'mac' ? chip : 'win'];
    $('dl-go').href = REL + file;
    $('dl-go').textContent = label;
    $('dl-note').textContent = note;
  };
  osSeg.addEventListener('click', (e) => { const b = e.target.closest('[data-os]'); if (b) { os = b.dataset.os; render(); } });
  chipSeg.addEventListener('click', (e) => { const b = e.target.closest('[data-chip]'); if (b) { chip = b.dataset.chip; render(); } });
  // arrow keys move within each radio group
  [osSeg, chipSeg].forEach((g) => g.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    const bs = [...g.querySelectorAll('button')];
    const i = bs.indexOf(document.activeElement);
    const n = bs[(i + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? bs.length - 1 : 1)) % bs.length];
    e.preventDefault(); n.focus(); n.click();
  }));
  render();
}

// ---------- entrances ----------
// the wordmark is set one letter at a time, like pieces put on the board
const word = document.querySelector('.mark-word');
if (word) {
  const text = word.textContent;
  word.setAttribute('aria-hidden', 'true');
  word.textContent = '';
  [...text].forEach((ch, k) => {
    const l = document.createElement('span');
    l.className = 'l';
    l.style.setProperty('--k', k);
    l.textContent = ch;
    word.append(l);
  });
  requestAnimationFrame(() => requestAnimationFrame(() => word.closest('.mark').classList.add('in')));
}
// every part of every section rises in as it arrives
document.querySelectorAll('.facts li, .tracks details, .all-list li, .modes > div, .faq-text p, .get-words > *, .dialog')
  .forEach((el) => el.classList.add('rise'));
const rises = document.querySelectorAll('.rise');
if (still || !('IntersectionObserver' in window)) {
  rises.forEach((r) => r.classList.add('in'));
} else {
  rises.forEach((r) => {
    const sibs = [...r.parentElement.children].filter((c) => c.classList.contains('rise'));
    r.style.setProperty('--i', Math.min(sibs.indexOf(r), 4));
  });
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  rises.forEach((r) => io.observe(r));
}
