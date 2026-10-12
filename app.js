const eras = {
  ancient: {
    time: 'Б.з.д. III–II ғасырлар',
    title: 'Ең төменгі қабаттан табылған қыш',
    description: 'Ескі қалашықтың төменгі мәдени қабатынан осы кезеңге жататын қыш ыдыстар табылған. Бұл жердің ерте тарихын танытатын археологиялық айғақ.',
    meaning: 'Шымқаланы тек бүгінгі қорған көрінісімен шектемей, жер астындағы көне қабатты да түсіндіру керек.',
    source: 'Дерек: Kazakhstan.travel [3]',
    href: '#source-3'
  },
  medieval: {
    time: 'X–XII ғасырлар',
    title: 'Шахристандағы тұрғын жай',
    description: 'Музейдің сипаттамасында шахристанның оңтүстігінен ошақ пен қоймасы бар бірнеше бөлме анықталғаны айтылады. Бұл дерек ортағасырлық қаланың күнделікті өмірін көрсетеді.',
    meaning: 'Цитадель, шахристан және рабат — бір қаланың әртүрлі қызмет атқарған бөліктері.',
    source: 'Дерек: Шымкент музейлері [1]',
    href: '#source-1'
  },
  craft: {
    time: 'XVII–XVIII ғасырлар',
    title: 'Ұстахана мен тұрғын үй орны',
    description: '2020 жылғы қазба батыс шахристаннан темір бұйымдармен байланысты ұстахана және тұрғын үй орнын ашты. Бұл Шымқаладағы қолөнердің материалдық ізі.',
    meaning: 'Келуші қаланы тек қорғаныс орны ретінде емес, адамдар еңбек еткен мекен ретінде де көреді.',
    source: 'Дерек: Шымкент музейлері [1]',
    href: '#source-1'
  }
};

const tabs = [...document.querySelectorAll('.era-tab')];
const panel = document.getElementById('era-panel');
const time = document.getElementById('era-time');
const title = document.getElementById('era-title');
const description = document.getElementById('era-description');
const meaning = document.getElementById('era-meaning');
const source = document.getElementById('era-source');

function selectEra(key, focus = false) {
  const data = eras[key];
  if (!data) return;
  const selected = tabs.find(tab => tab.dataset.era === key);
  tabs.forEach(tab => {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  panel.setAttribute('aria-labelledby', selected.id);
  time.textContent = data.time;
  title.textContent = data.title;
  description.textContent = data.description;
  meaning.replaceChildren();
  const label = document.createElement('span');
  label.textContent = 'Нені көрсетеді?';
  meaning.append(label, document.createTextNode(data.meaning));
  source.textContent = data.source;
  source.href = data.href;
  if (focus) selected.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectEra(tab.dataset.era));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectEra(tabs[next].dataset.era, true);
  });
});

const root = document.documentElement;
const textButton = document.getElementById('text-size');
const contrastButton = document.getElementById('contrast');
let size = 0;
try {
  size = Math.min(2, Math.max(0, Number(localStorage.getItem('shymqala-text-size')) || 0));
  if (localStorage.getItem('shymqala-contrast') === 'true') root.classList.add('high-contrast');
} catch { /* Storage may be unavailable in a local browser. */ }

function applySize() {
  root.classList.toggle('text-large', size === 1);
  root.classList.toggle('text-larger', size === 2);
  textButton.setAttribute('aria-label', size === 2 ? 'Мәтін көлемін бастапқыға қайтару' : 'Мәтінді үлкейту');
  textButton.title = size === 2 ? 'Бастапқы өлшем' : 'Мәтінді үлкейту';
}
applySize();
contrastButton.setAttribute('aria-pressed', String(root.classList.contains('high-contrast')));

textButton.addEventListener('click', () => {
  size = (size + 1) % 3;
  applySize();
  try { localStorage.setItem('shymqala-text-size', String(size)); } catch {}
});
contrastButton.addEventListener('click', () => {
  const enabled = root.classList.toggle('high-contrast');
  contrastButton.setAttribute('aria-pressed', String(enabled));
  contrastButton.setAttribute('aria-label', enabled ? 'Жоғары контрастты өшіру' : 'Жоғары контрастты қосу');
  try { localStorage.setItem('shymqala-contrast', String(enabled)); } catch {}
});

const links = [...document.querySelectorAll('.main-nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach(link => link.setAttribute('aria-current', String(link.getAttribute('href') === `#${visible.target.id}`)));
  }, {rootMargin: '-18% 0px -60% 0px', threshold: [0, .1, .4]});
  ['context', 'history', 'solution', 'research', 'sources'].forEach(id => observer.observe(document.getElementById(id)));
}
