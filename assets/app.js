const root = document.documentElement;
const savedTheme = localStorage.getItem('zzx-theme');
root.dataset.theme = savedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

document.querySelector('.theme-toggle')?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('zzx-theme', root.dataset.theme);
});

document.querySelector('#year')?.replaceChildren(String(new Date().getFullYear()));

const progress = document.querySelector('.reading-progress');
if (progress) {
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

const searchInput = document.querySelector('#article-search');
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const archiveItems = [...document.querySelectorAll('.archive-item')];
let activeTag = new URLSearchParams(location.search).get('tag') || 'all';

function filterArticles() {
  const query = searchInput?.value.trim().toLowerCase() || '';
  archiveItems.forEach((item) => {
    const matchesText = item.textContent.toLowerCase().includes(query);
    const matchesTag = activeTag === 'all' || item.dataset.tags?.split(' ').includes(activeTag);
    item.hidden = !(matchesText && matchesTag);
  });
}

filterButtons.forEach((button) => {
  button.classList.toggle('active', button.dataset.tag === activeTag);
  button.addEventListener('click', () => {
    activeTag = button.dataset.tag;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    filterArticles();
  });
});

searchInput?.addEventListener('input', filterArticles);
filterArticles();

const revealItems = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.type = 'button';
backToTop.setAttribute('aria-label', '返回顶部');
const assetPrefix = location.pathname.includes('/posts/') ? '../assets/' : 'assets/';
backToTop.innerHTML = `<img src="${assetPrefix}taichi.svg" alt="">`;
document.body.append(backToTop);
const updateBackToTop = () => backToTop.classList.toggle('visible', scrollY > 600);
addEventListener('scroll', updateBackToTop, { passive: true });
backToTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
updateBackToTop();

const articleBody = document.querySelector('.article-body');
const articleShell = document.querySelector('.article-shell');
if (articleBody && articleShell) {
  const headings = [...articleBody.querySelectorAll('h2, h3')];
  if (headings.length >= 3) {
    const toc = document.createElement('nav');
    toc.className = 'article-toc';
    toc.setAttribute('aria-label', '文章目录');
    const title = document.createElement('strong');
    title.textContent = '文章目录';
    toc.append(title);
    headings.forEach((heading, index) => {
      heading.id ||= `section-${index + 1}`;
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      if (heading.tagName === 'H3') link.className = 'toc-h3';
      toc.append(link);
    });
    document.body.append(toc);
  }
}

if (articleBody?.querySelector('.math-inline, .math-display')) {
  window.MathJax = {
    tex: {
      inlineMath: [['\\(', '\\)'], ['$', '$']],
      displayMath: [['\\[', '\\]'], ['$$', '$$']],
      processEscapes: true,
    },
    output: {
      displayOverflow: 'linebreak',
      linebreaks: {
        inline: true,
        width: '100%',
        lineleading: 0.18,
      },
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    },
  };
  const mathScript = document.createElement('script');
  mathScript.id = 'MathJax-script';
  mathScript.defer = true;
  mathScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@4/tex-chtml.js';
  document.head.append(mathScript);
}

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const sakura = document.createElement('div');
  sakura.className = 'sakura-layer';
  sakura.setAttribute('aria-hidden', 'true');
  [
    ['7%', '15s', '-5s', '.72'],
    ['18%', '19s', '-13s', '.48'],
    ['34%', '17s', '-8s', '.62'],
    ['49%', '22s', '-18s', '.44'],
    ['63%', '16s', '-11s', '.7'],
    ['75%', '21s', '-4s', '.52'],
    ['88%', '18s', '-15s', '.58'],
    ['96%', '24s', '-9s', '.4'],
  ].forEach(([left, duration, delay, opacity], index) => {
    const petal = document.createElement('i');
    petal.style.setProperty('--petal-left', left);
    petal.style.setProperty('--petal-duration', duration);
    petal.style.setProperty('--petal-delay', delay);
    petal.style.setProperty('--petal-opacity', opacity);
    petal.style.setProperty('--petal-drift', `${index % 2 ? -1 : 1}`);
    sakura.append(petal);
  });
  document.body.append(sakura);
}
