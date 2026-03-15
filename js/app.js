/* ============================================
   AniTrack — App Entry Point
   Boots all modules on DOMContentLoaded
   ============================================ */

const App = (() => {
  /**
   * Initialise the application.
   */
  const init = () => {
    // 1. Theme — apply before anything renders
    Theme.init();

    // 2. Navbar
    Navbar.render();
    Navbar.showAnnouncement();

    // 3. Keyboard shortcuts
    Shortcuts.init();

    // 4. PWA
    PWA.init();

    // 5. Spoiler protection
    UI.initSpoilers();

    // 6. Lazy-load images
    if (typeof UI !== 'undefined' && UI.lazyLoadImages) {
      UI.lazyLoadImages();
    }

    // 7. Reminders
    if (typeof Reminders !== 'undefined' && Reminders.loadReminders) {
      Reminders.loadReminders();
    }

    // 8. Page-specific initialisation
    initPage();
  };

  /**
   * Route to page-specific module based on data-page attribute.
   */
  const initPage = () => {
    const page = document.body.dataset.page;
    if (!page) return;

    if (page !== 'login' && page !== 'help') {
      if (typeof Auth !== 'undefined' && !Auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
      }
    }

    const pageModules = {
      home: () => typeof Home !== 'undefined' && Home.init?.(),
      login: () => typeof Login !== 'undefined' && Login.init?.(),
      watchlist: () => typeof Watchlist !== 'undefined' && Watchlist.init?.(),
      search: () => typeof Search !== 'undefined' && Search.init?.(),
      detail: () => typeof Detail !== 'undefined' && Detail.init?.(),
      character: () => typeof Character !== 'undefined' && Character.init?.(),
      seasonal: () => typeof Seasonal !== 'undefined' && Seasonal.init?.(),
      clubs: () => typeof Clubs !== 'undefined' && Clubs.init?.(),
      'club-detail': () => typeof ClubDetail !== 'undefined' && ClubDetail.init?.(),
      analytics: () => typeof Analytics !== 'undefined' && Analytics.init?.(),
      admin: () => typeof Admin !== 'undefined' && Admin.init?.(),
      profile: () => typeof Profile !== 'undefined' && Profile.init?.(),
      help: () => typeof Help !== 'undefined' && Help.init?.(),
    };

    const loader = pageModules[page];
    if (loader) loader();
  };

  return { init };
})();

// Boot when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
