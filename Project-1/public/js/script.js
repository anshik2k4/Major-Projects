(function () {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
})();

(function () {
  'use strict';

  const toggleBtn = document.querySelector('.theme-toggle');
  if (!toggleBtn) return;

  const body = document.body;
  const iconEl = toggleBtn.querySelector('i');
  const STORAGE_KEY = 'stayhub-theme';

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    body.classList.toggle('dark-theme', isDark);
    if (iconEl) {
      iconEl.classList.toggle('fa-moon', isDark);
      iconEl.classList.toggle('fa-sun', !isDark);
    }
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  } else {
    // Default: respect user's OS preference if available.
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  toggleBtn.addEventListener('click', function () {
    const next = body.classList.contains('dark-theme') ? 'light' : 'dark';
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });
})();
