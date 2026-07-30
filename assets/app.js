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
