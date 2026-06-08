/* Shared light/dark theme toggle. Persists per-origin. First-class in every direction. */
(function () {
  var KEY = 'aeo-theme';
  function apply(t) {
    document.documentElement.setAttribute('data-theme', t);
    document.querySelectorAll('[data-theme-label]').forEach(function (el) {
      el.textContent = t === 'dark' ? 'Light' : 'Dark';
    });
  }
  function current() {
    return localStorage.getItem(KEY) ||
      document.documentElement.getAttribute('data-theme-default') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  window.AEOTheme = {
    init: function () {
      apply(current());
      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-theme-toggle]');
        if (!t) return;
        e.preventDefault();
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem(KEY, next);
        apply(next);
      });
    }
  };
  // Apply ASAP to avoid flash
  apply(current());
  if (document.readyState !== 'loading') window.AEOTheme.init();
  else document.addEventListener('DOMContentLoaded', window.AEOTheme.init);
})();
