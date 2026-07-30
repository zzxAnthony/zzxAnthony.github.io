const root = document.documentElement;
const savedTheme = localStorage.getItem('zzx-theme');
root.dataset.theme = savedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

const pageIsPost = location.pathname.includes('/posts/');
const pagePrefix = pageIsPost ? '../' : '';

// Keep the global navigation consistent on legacy article pages.
document.querySelectorAll('.topbar nav').forEach((nav) => {
  if (!nav.querySelector('a[href$="research.html"]')) {
    const link = document.createElement('a');
    link.href = `${pagePrefix}research.html`;
    link.textContent = '研究';
    const writingLink = nav.querySelector('a[href$="writing.html"]');
    writingLink?.after(link);
  }
});

document.querySelectorAll('.footer-links').forEach((links) => {
  if (!links.querySelector('a[href$="research.html"]')) {
    const link = document.createElement('a');
    link.href = `${pagePrefix}research.html`;
    link.textContent = '研究';
    const writingLink = links.querySelector('a[href$="writing.html"]');
    writingLink?.after(link);
  }
});

document.querySelectorAll('.wordmark').forEach((wordmark) => {
  if (!wordmark.querySelector('.wordmark-spark')) {
    const spark = document.createElement('span');
    spark.className = 'wordmark-spark';
    spark.setAttribute('aria-hidden', 'true');
    spark.textContent = '✦';
    wordmark.prepend(spark);
  }
});

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
backToTop.textContent = '↑';
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

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
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

// Fine-pointer interactions: a soft cursor halo, click burst and restrained
// magnetic movement. They are disabled for touch devices and reduced motion.
if (matchMedia('(pointer: fine)').matches && !reducedMotion) {
  const cursor = document.createElement('span');
  cursor.className = 'cursor-glow';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);

  const interactiveSelector = 'a, button, input, .post-card, .archive-item, .research-card';
  addEventListener('pointermove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.toggle('is-active', Boolean(event.target.closest?.(interactiveSelector)));
  }, { passive: true });
  addEventListener('pointerleave', () => { cursor.style.opacity = '0'; });
  addEventListener('pointerenter', () => { cursor.style.opacity = '1'; });

  const sparkColors = ['#ef7186', '#7b6ce8', '#3ca9bd', '#f1ad56'];
  addEventListener('click', (event) => {
    if (event.button !== 0) return;
    for (let index = 0; index < 8; index += 1) {
      const spark = document.createElement('i');
      const angle = (Math.PI * 2 * index) / 8 + Math.random() * 0.18;
      const distance = 25 + Math.random() * 20;
      spark.className = 'click-spark';
      spark.style.left = `${event.clientX - 4}px`;
      spark.style.top = `${event.clientY - 4}px`;
      spark.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`);
      spark.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`);
      spark.style.setProperty('--spark-color', sparkColors[index % sparkColors.length]);
      spark.addEventListener('animationend', () => spark.remove(), { once: true });
      document.body.append(spark);
    }
  });

  document.querySelectorAll('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
      element.style.translate = `${x}px ${y}px`;
    });
    element.addEventListener('pointerleave', () => { element.style.translate = ''; });
  });
}
