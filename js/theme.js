(function () {
  const root = document.documentElement;
  const STORE = 'pref-theme';
  const btn = document.getElementById('theme-toggle');

  function apply(theme) {
    if (theme === 'light') {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    }
  }

  const stored = localStorage.getItem(STORE);
  if (stored) apply(stored);

  if (btn) {
    btn.addEventListener('click', function () {
      const isDark = root.classList.contains('dark');
      const next = isDark ? 'light' : 'dark';
      apply(next);
      localStorage.setItem(STORE, next);
    });
  }
})();
