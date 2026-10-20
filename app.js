const guideData = [
  {
    key: 'ancient',
    era: 'Б.з.д. III ғ. соңы – II ғ. басы',
    title: 'Ең төменгі қабаттан табылған қыш',
    plain: 'Қыш ыдыс сынықтары бұл жерде адамдар ерте заманда да өмір сүргенін көрсетеді.',
    detail: 'Ескі қалашықтың төменгі мәдени қабатынан б.з.д. III ғасырдың соңы мен II ғасырдың басына жататын қыш ыдыстар табылған. Бұл — Шымқаланың ерте кезеңіне қатысты археологиялық айғақ.',
    source: '↗ Дерек: Kazakhstan.travel [3]',
    href: 'https://kazakhstan.travel/kz/attractions/471'
  },
  {
    key: 'medieval',
    era: 'X–XII ғасырлар',
    title: 'Шахристандағы күнделікті өмір',
    plain: 'Бұл жерден ошағы мен қоймасы бар тұрғын жай анықталған. Қалада адамдар жай ғана қорғанбаған — өмір сүрген.',
    detail: 'Шымкент музейлері бірлестігінің сипаттамасында шахристанның оңтүстігінен бірнеше бөлмелі тұрғын жай, ошақ пен қойма табылғаны айтылады. Бөлме едендеріне күйдірілген кірпіш төселген.',
    source: '↗ Дерек: Шымкент музейлері [1]',
    href: 'https://shymkentmuseums.kz/ru/otdeleniya-muzeya/otdel-istoriko-kulturnyj-kompleks-shym-kala.html'
  },
  {
    key: 'craft',
    era: 'XVII–XVIII ғасырлар',
    title: 'Шеберлер қалдырған із',
    plain: 'Батыс шахристаннан ұстахана мен тұрғын үй орны табылған. Қолөнер Шымқала өмірінің бір бөлігі болған.',
    detail: '2020 жылғы қазбада батыс шахристаннан темір бұйымдармен байланысты ұстахана және оған іргелес тұрғын үй орны ашылды. Музей оларды көрсетілетін нысанға айналдырғанын хабарлайды.',
    source: '↗ Дерек: Шымкент музейлері [1]',
    href: 'https://shymkentmuseums.kz/ru/otdeleniya-muzeya/otdel-istoriko-kulturnyj-kompleks-shym-kala.html'
  }
];

const guideTabs = [...document.querySelectorAll('.guide-step')];
const guidePanel = document.getElementById('guide-panel');
const guideDetail = document.querySelector('.guide-detail');
const previousButton = document.getElementById('guide-prev');
const nextButton = document.getElementById('guide-next');
let activeGuide = 0;

function showGuide(index, focusTab = false) {
  if (index < 0 || index >= guideData.length) return;
  activeGuide = index;
  const item = guideData[index];
  guideTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  guidePanel.setAttribute('aria-labelledby', guideTabs[index].id);
  document.getElementById('guide-era').textContent = item.era;
  document.getElementById('guide-progress').textContent = `${index + 1} / ${guideData.length}`;
  document.getElementById('guide-stage-title').textContent = item.title;
  document.getElementById('guide-plain').textContent = item.plain;
  document.getElementById('guide-detail-text').textContent = item.detail;
  const source = document.getElementById('guide-source');
  source.textContent = item.source;
  source.href = item.href;
  guideDetail.open = false;
  previousButton.disabled = index === 0;
  nextButton.textContent = index === guideData.length - 1 ? 'Пікір қалдыру →' : 'Келесі кезең →';
  if (focusTab) guideTabs[index].focus();
  window.dispatchEvent(new CustomEvent('shymqala:guidechange', {detail: {index}}));
}

guideTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showGuide(index));
  tab.addEventListener('keydown', event => {
    let target;
    if (event.key === 'ArrowRight') target = (index + 1) % guideTabs.length;
    if (event.key === 'ArrowLeft') target = (index - 1 + guideTabs.length) % guideTabs.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = guideTabs.length - 1;
    if (target === undefined) return;
    event.preventDefault();
    showGuide(target, true);
  });
});

previousButton.addEventListener('click', () => showGuide(activeGuide - 1));
nextButton.addEventListener('click', () => {
  if (activeGuide < guideData.length - 1) {
    showGuide(activeGuide + 1);
  } else {
    const firstAnswer = document.querySelector('#pilot-form input');
    firstAnswer.scrollIntoView({behavior: 'smooth', block: 'center'});
    firstAnswer.focus({preventScroll: true});
  }
});

const root = document.documentElement;
const textButton = document.getElementById('text-size');
const contrastButton = document.getElementById('contrast');
let size = 0;
try {
  size = Math.min(2, Math.max(0, Number(localStorage.getItem('shymqala-text-size')) || 0));
  if (localStorage.getItem('shymqala-contrast') === 'true') root.classList.add('high-contrast');
} catch { /* Local storage can be disabled. */ }

function applySize() {
  root.classList.toggle('text-large', size === 1);
  root.classList.toggle('text-larger', size === 2);
  const label = size === 2 ? 'Мәтін көлемін бастапқыға қайтару' : 'Мәтінді үлкейту';
  textButton.setAttribute('aria-label', label);
  textButton.title = label;
}
function applyContrastLabel() {
  const enabled = root.classList.contains('high-contrast');
  contrastButton.setAttribute('aria-pressed', String(enabled));
  contrastButton.setAttribute('aria-label', enabled ? 'Жоғары контрастты өшіру' : 'Жоғары контрастты қосу');
}
applySize();
applyContrastLabel();
textButton.addEventListener('click', () => {
  size = (size + 1) % 3;
  applySize();
  try { localStorage.setItem('shymqala-text-size', String(size)); } catch {}
});
contrastButton.addEventListener('click', () => {
  root.classList.toggle('high-contrast');
  applyContrastLabel();
  try { localStorage.setItem('shymqala-contrast', String(root.classList.contains('high-contrast'))); } catch {}
});

const STORAGE_KEY = 'shymqala-pilot-v1';
const pilotForm = document.getElementById('pilot-form');
const pilotMessage = document.getElementById('pilot-message');
const exportButton = document.getElementById('pilot-export');
const resetButton = document.getElementById('pilot-reset');

function readResponses() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value.filter(row => row && typeof row === 'object') : [];
  } catch { return []; }
}
function updatePilotStatus(message) {
  const count = readResponses().length;
  pilotMessage.textContent = message || (count ? `Бұл құрылғыда ${count} жауап сақталды.` : 'Бұл құрылғыда әзірге жауап сақталған жоқ.');
  exportButton.disabled = count === 0;
  resetButton.disabled = count === 0;
}
pilotForm.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(pilotForm);
  const clarity = form.get('clarity');
  const source = form.get('source');
  if (!['Оңай', 'Орташа', 'Қиын'].includes(clarity) || !['Иә', 'Жоқ'].includes(source)) return;
  const responses = readResponses();
  responses.push({time: new Date().toISOString(), clarity, source});
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
    pilotForm.reset();
    updatePilotStatus(`Жауап сақталды. Бұл құрылғыда барлығы ${responses.length} жауап бар.`);
  } catch {
    updatePilotStatus('Жауапты сақтау мүмкін болмады. Браузердегі сақтау рұқсатын тексеріңіз.');
  }
});
exportButton.addEventListener('click', () => {
  const responses = readResponses();
  if (!responses.length) return;
  const quote = value => `"${String(value).replaceAll('"', '""')}"`;
  const rows = [['Уақыты', 'Түсіну деңгейі', 'Дереккөзді тапты ма'], ...responses.map(row => [row.time, row.clarity, row.source])];
  const csv = '\uFEFF' + rows.map(row => row.map(quote).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'shymqala-synaq-zhauaptary.csv';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
resetButton.addEventListener('click', () => {
  if (!window.confirm('Осы құрылғыда сақталған барлық жауапты өшіру керек пе?')) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    updatePilotStatus('Осы құрылғыдағы жауаптар өшірілді.');
  } catch { updatePilotStatus('Жауаптарды өшіру мүмкін болмады.'); }
});
updatePilotStatus();

const navLinks = [...document.querySelectorAll('.main-nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => link.setAttribute('aria-current', String(link.getAttribute('href') === `#${visible.target.id}`)));
  }, {rootMargin: '-18% 0px -60% 0px', threshold: [0, .1, .4]});
  ['guide', 'digital-map', 'audio-guide', 'research', 'sources'].forEach(id => observer.observe(document.getElementById(id)));
}
