/* ============================================
   AniTrack — Theme Manager
   Dark / Light mode toggle + persistence
   ============================================ */

const Theme = (() => {
  const THEME_KEY = 'theme';

  /**
   * Initialise theme from localStorage or system preference.
   */
  const init = () => {
    const saved = Storage.getItem(THEME_KEY);
    if (saved) {
      apply(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      apply(prefersDark ? 'dark' : 'light');
    }
  };

  /**
   * Apply a theme to the document.
   */
  const apply = (theme) => {
    document.body.setAttribute('data-theme', theme);
    Storage.setItem(THEME_KEY, theme);

    // Update meta theme-color
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = theme === 'dark' ? '#0D0D0D' : '#F0F2F8';
  };

  /**
   * Toggle between dark and light.
   */
  const toggle = () => {
    const current = get();
    const next = current === 'dark' ? 'light' : 'dark';
    apply(next);
    return next;
  };

  /**
   * Get current theme string.
   */
  const get = () => {
    return document.body.getAttribute('data-theme') || 'dark';
  };

  return { init, apply, toggle, get };
})();

window.Theme = Theme;
