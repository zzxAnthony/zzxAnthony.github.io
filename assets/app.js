const root = document.documentElement;
const savedTheme = localStorage.getItem('kexi-theme');
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
  localStorage.setItem('kexi-theme', root.dataset.theme);
});

document.querySelector('#year')?.replaceChildren(String(new Date().getFullYear()));

const dailyQuote = document.querySelector('[data-daily-quote]');
if (dailyQuote) {
  const quotes = [
    ['樱花树下站谁都美，我的爱给谁都热烈。', '关于喜欢'],
    ['喜欢不是一道证明题，答案写在见面时的眼睛里。', '关于喜欢'],
    ['有些人适合收藏在晚风里，不一定要写进结局。', '关于告别'],
    ['心动是短暂的天气，认真才是长久的气候。', '关于感情'],
    ['你不用很特别，我喜欢的时候，你就是唯一的例外。', '关于喜欢'],
    ['见面吧，很多话隔着屏幕会变轻。', '关于想念'],
    ['别急着把故事写完，晚一点也许会有新的章节。', '关于生活'],
    ['长大不是不期待，是学会一边失望，一边种花。', '关于成长'],
    ['今天学不完也没关系，先比昨天多懂一点。', '关于学习'],
    ['把不会的题留在纸上，别留在自我怀疑里。', '关于学习'],
    ['不是每次努力都有掌声，但每次认真都算数。', '关于努力'],
    ['慢一点没关系，方向对了，散步也是前进。', '关于成长'],
    ['学习不是为了赢过所有人，是为了看见更大的世界。', '关于学习'],
    ['很多答案不是想出来的，是做着做着长出来的。', '关于行动'],
    ['天赋偶尔发光，习惯负责天亮。', '关于坚持'],
    ['困的时候先睡觉，醒来再和世界讲道理。', '关于生活'],
    ['生活偶尔卡顿，不代表你的人生加载失败。', '关于生活'],
    ['风吹乱计划，也可能把你吹到更好的地方。', '关于意外'],
    ['可以敏感，也可以勇敢，这两件事并不冲突。', '关于自己'],
    ['没有白走的路，只是有些风景后来才看懂。', '关于成长'],
    ['今天也普通得很好，平静本身就是礼物。', '关于日常'],
    ['允许自己暂时没有答案。', '关于自己'],
    ['不必每次都满分，留一点空白给明天。', '关于学习'],
    ['喜欢春天的人，也要允许花慢一点开。', '关于等待'],
  ];
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let seed = 2166136261;
  for (const character of dateKey) {
    seed ^= character.charCodeAt(0);
    seed = Math.imul(seed, 16777619);
  }
  const [text, topic] = quotes[(seed >>> 0) % quotes.length];
  const dateLabel = `${String(today.getMonth() + 1).padStart(2, '0')} / ${String(today.getDate()).padStart(2, '0')}`;
  const quoteDate = document.querySelector('[data-quote-date]');
  dailyQuote.textContent = text;
  document.querySelector('[data-quote-topic]')?.replaceChildren(topic);
  if (quoteDate) {
    quoteDate.dateTime = dateKey;
    quoteDate.textContent = dateLabel;
  }
}

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
    const inferTocLevel = (heading) => {
      const text = heading.textContent.replace(/\s+/g, ' ').trim();
      const numbered = text.match(/^(\d+(?:\.\d+)*)(?=[\s、.．：:）)]|$)/);
      if (numbered) return Math.min(numbered[1].split('.').length, 3);
      if (/^[一二三四五六七八九十百]+[、.．]/.test(text)) return 1;
      if (/^[（(](?:\d+|[一二三四五六七八九十百]+)[）)]/.test(text)) return 2;
      return heading.tagName === 'H2' ? 1 : 2;
    };

    const rawLevels = headings.map(inferTocLevel);
    const levelOffset = Math.max(0, Math.min(...rawLevels) - 1);
    const toc = document.createElement('nav');
    toc.className = 'article-toc';
    toc.setAttribute('aria-label', '文章目录');
    const title = document.createElement('strong');
    title.textContent = '文章目录';
    toc.append(title);
    const rootList = document.createElement('ol');
    rootList.className = 'toc-list';
    toc.append(rootList);
    const listStack = [{ list: rootList, lastItem: null }];
    let previousLevel = 1;

    headings.forEach((heading, index) => {
      heading.id ||= `section-${index + 1}`;
      let level = Math.max(1, Math.min(rawLevels[index] - levelOffset, 3));
      level = Math.min(level, previousLevel + 1);

      while (listStack.length < level) {
        const parent = listStack[listStack.length - 1];
        if (!parent.lastItem) {
          level = listStack.length;
          break;
        }
        const nestedList = document.createElement('ol');
        nestedList.className = `toc-list toc-list-level-${listStack.length + 1}`;
        parent.lastItem.append(nestedList);
        listStack.push({ list: nestedList, lastItem: null });
      }
      while (listStack.length > level) listStack.pop();

      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      link.className = `toc-link toc-level-${level}`;
      item.append(link);
      const current = listStack[listStack.length - 1];
      current.list.append(item);
      current.lastItem = item;
      previousLevel = level;
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
    ['3%', '18s', '-12s', '.38', '7px', '-1.25', '.2px'],
    ['9%', '15s', '-5s', '.72', '10px', '1', '0px'],
    ['17%', '23s', '-19s', '.35', '13px', '-.7', '.7px'],
    ['24%', '19s', '-13s', '.5', '8px', '-1', '.1px'],
    ['33%', '17s', '-8s', '.64', '11px', '1.2', '0px'],
    ['41%', '26s', '-22s', '.3', '15px', '.6', '1px'],
    ['49%', '22s', '-18s', '.46', '9px', '-1.15', '.2px'],
    ['57%', '20s', '-7s', '.42', '8px', '.85', '.4px'],
    ['64%', '16s', '-11s', '.7', '10px', '1.1', '0px'],
    ['71%', '24s', '-20s', '.33', '14px', '-.65', '.9px'],
    ['77%', '21s', '-4s', '.54', '9px', '-1', '.1px'],
    ['85%', '17s', '-9s', '.62', '11px', '1.25', '0px'],
    ['91%', '19s', '-15s', '.48', '8px', '-.9', '.3px'],
    ['97%', '25s', '-17s', '.32', '13px', '.7', '.8px'],
  ].forEach(([left, duration, delay, opacity, size, drift, blur]) => {
    const petal = document.createElement('i');
    petal.style.setProperty('--petal-left', left);
    petal.style.setProperty('--petal-duration', duration);
    petal.style.setProperty('--petal-delay', delay);
    petal.style.setProperty('--petal-opacity', opacity);
    petal.style.setProperty('--petal-size', size);
    petal.style.setProperty('--petal-drift', `${Number(drift) * 100}px`);
    petal.style.setProperty('--petal-blur', blur);
    sakura.append(petal);
  });
  document.body.append(sakura);
}

// Fine-pointer interactions: an anime-inspired star trail, concentric click
// ripples and restrained magnetic movement. Native cursor behavior is preserved.
if (matchMedia('(pointer: fine)').matches && !reducedMotion) {
  const cursor = document.createElement('span');
  cursor.className = 'cursor-star';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.textContent = '✦';
  document.body.append(cursor);

  const interactiveSelector = 'a, button, input, .post-card, .archive-item, .research-card, .experience-card, .profile-note';
  const trailGlyphs = ['✦', '·', '✧'];
  const trailColors = ['#ef7186', '#3ca9bd', '#f1ad56'];
  let lastTrailAt = 0;
  let lastTrailX = 0;
  let lastTrailY = 0;
  addEventListener('pointermove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.toggle('is-active', Boolean(event.target.closest?.(interactiveSelector)));

    const now = performance.now();
    const distance = Math.hypot(event.clientX - lastTrailX, event.clientY - lastTrailY);
    if (now - lastTrailAt < 34 || distance < 20) return;
    lastTrailAt = now;
    lastTrailX = event.clientX;
    lastTrailY = event.clientY;
    const trail = document.createElement('i');
    const index = Math.floor(Math.random() * trailGlyphs.length);
    trail.className = 'cursor-trail';
    trail.textContent = trailGlyphs[index];
    trail.style.left = `${event.clientX}px`;
    trail.style.top = `${event.clientY}px`;
    trail.style.setProperty('--trail-color', trailColors[index]);
    trail.style.setProperty('--trail-size', `${7 + Math.random() * 6}px`);
    trail.style.setProperty('--trail-x', `${-8 + Math.random() * 16}px`);
    trail.style.setProperty('--trail-y', `${11 + Math.random() * 12}px`);
    trail.addEventListener('animationend', () => trail.remove(), { once: true });
    document.body.append(trail);
  }, { passive: true });
  addEventListener('pointerleave', () => { cursor.style.opacity = '0'; });
  addEventListener('pointerenter', () => { cursor.style.opacity = '1'; });

  addEventListener('click', (event) => {
    if (event.button !== 0) return;
    ['primary', 'secondary'].forEach((variant) => {
      const ripple = document.createElement('i');
      ripple.className = `click-ripple ${variant}`;
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
      document.body.append(ripple);
    });
    const star = document.createElement('i');
    star.className = 'click-star';
    star.textContent = '✦';
    star.style.left = `${event.clientX}px`;
    star.style.top = `${event.clientY}px`;
    star.addEventListener('animationend', () => star.remove(), { once: true });
    document.body.append(star);
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
