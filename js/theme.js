(function () {
  var root = document.documentElement;
  var STORE = 'pref-theme';
  var buttons = document.querySelectorAll('#theme-toggle, [data-theme-toggle]');

  function syncButtons(theme) {
    Array.prototype.forEach.call(buttons, function (button) {
      var label = button.querySelector('[data-theme-toggle-label]');
      var isDark = theme === 'dark';
      var nextLabel = isDark ? button.dataset.themeDarkLabel : button.dataset.themeLightLabel;
      var actionLabel = isDark ? button.dataset.themeDarkAction : button.dataset.themeLightAction;

      button.setAttribute('aria-pressed', String(isDark));
      if (actionLabel) button.setAttribute('aria-label', actionLabel);
      if (label && nextLabel) label.textContent = nextLabel;
    });
  }

  function apply(theme) {
    var isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    syncButtons(isDark ? 'dark' : 'light');
  }

  var stored;
  try {
    stored = localStorage.getItem(STORE);
  } catch (error) {
    stored = null;
  }
  apply(stored === 'dark' || root.classList.contains('dark') ? 'dark' : 'light');

  Array.prototype.forEach.call(buttons, function (button) {
    button.addEventListener('click', function () {
      var next = root.classList.contains('dark') ? 'light' : 'dark';
      apply(next);
      try {
        localStorage.setItem(STORE, next);
      } catch (error) {
        // Theme changes still apply when storage is unavailable.
      }
    });
  });
})();
