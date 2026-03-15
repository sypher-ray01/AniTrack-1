/* ============================================
   AniTrack — Navbar Renderer
   Injects navbar HTML · Active link · Mobile menu
   ============================================ */

const Navbar = (() => {
  const NAV_LINKS = [
    { href: 'index.html',    icon: '🏠', label: 'Home',     shortcut: '' },
    { href: 'list.html',     icon: '📋', label: 'Watchlist', shortcut: 'W' },
    { href: 'search.html',   icon: '🔍', label: 'Search',   shortcut: '/' },
    { href: 'seasonal.html', icon: '📅', label: 'Seasonal',  shortcut: '' },
    { href: 'clubs.html',    icon: '👥', label: 'Clubs',     shortcut: '' },
    { href: 'analytics.html',icon: '📊', label: 'Analytics', shortcut: '' },
  ];

  /**
   * Render the navbar into #navbar or create one.
   */
  const render = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'login.html') return;

    let target = document.getElementById('navbar');
    if (!target) {
      target = document.createElement('nav');
      target.id = 'navbar';
      document.body.prepend(target);
    }

    const user = Auth.getCurrentUser();

    const linksHtml = NAV_LINKS.map((link) => {
      const active = currentPage === link.href ? 'active' : '';
      const shortcut = link.shortcut
        ? `<span class="nav-link-shortcut">${link.shortcut}</span>`
        : '';
      return `<a href="${link.href}" class="nav-link ${active}">
        <span class="nav-link-icon">${link.icon}</span>
        <span class="hide-mobile">${link.label}</span>
        ${shortcut}
      </a>`;
    }).join('');

    const userSection = user
      ? `<div class="navbar-user">
          <button class="navbar-avatar" id="navbar-avatar-btn" aria-label="User menu">
            ${user.avatar ? `<img src="${user.avatar}" alt="${user.username}">` : user.username.charAt(0).toUpperCase()}
          </button>
          <div class="user-dropdown" id="user-dropdown">
            <div class="user-dropdown-header">
              <div class="user-dropdown-name">${user.username}</div>
              <div class="user-dropdown-email">${user.email || ''}</div>
            </div>
            <a href="profile.html" class="user-dropdown-item">👤 Profile</a>
            <a href="analytics.html" class="user-dropdown-item">📊 Statistics</a>
            ${user.isAdmin ? '<a href="admin.html" class="user-dropdown-item">⚙️ Admin Panel</a>' : ''}
            <a href="help.html" class="user-dropdown-item">❓ Help</a>
            <div class="user-dropdown-divider"></div>
            <button class="user-dropdown-item danger" id="navbar-logout-btn">🚪 Log Out</button>
          </div>
        </div>`
      : `<a href="login.html" class="navbar-login">Sign In</a>`;

    target.className = 'navbar';
    target.innerHTML = `
      <div class="navbar-inner">
        <a href="index.html" class="navbar-logo">
          <div class="navbar-logo-icon">▶</div>
          <div class="navbar-logo-text">Ani<span>Track</span></div>
        </a>

        <div class="navbar-nav" id="navbar-nav">
          ${linksHtml}
        </div>

        <div class="navbar-actions">
          <button class="theme-toggle" id="theme-toggle-btn" aria-label="Toggle theme"></button>
          ${userSection}
          <button class="navbar-hamburger" id="navbar-hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    `;

    bindEvents();
  };

  /**
   * Bind navbar interactivity.
   */
  const bindEvents = () => {
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    themeBtn?.addEventListener('click', () => Theme.toggle());

    // Mobile hamburger
    const hamburger = document.getElementById('navbar-hamburger');
    const nav = document.getElementById('navbar-nav');
    hamburger?.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      nav?.classList.toggle('open');
    });

    // Close mobile nav on link click
    nav?.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger?.classList.remove('open');
        nav?.classList.remove('open');
      });
    });

    // User dropdown
    const avatarBtn = document.getElementById('navbar-avatar-btn');
    const dropdown = document.getElementById('user-dropdown');
    avatarBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown?.classList.toggle('open');
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (dropdown && !dropdown.contains(e.target) && e.target !== avatarBtn) {
        dropdown.classList.remove('open');
      }
    });

    // Logout
    const logoutBtn = document.getElementById('navbar-logout-btn');
    logoutBtn?.addEventListener('click', () => {
      Auth.logout();
    });
  };

  /**
   * Show announcement banner if active.
   */
  const showAnnouncement = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'login.html') return;

    const ann = Storage.getItem('announcement');
    if (!ann?.active || !ann?.text) return;

    const existing = document.querySelector('.announcement-banner');
    if (existing) return;

    const banner = document.createElement('div');
    banner.className = 'announcement-banner';
    banner.innerHTML = `
      <span>${ann.text}</span>
      <button class="announcement-banner-close" aria-label="Dismiss">&times;</button>
    `;
    banner.querySelector('.announcement-banner-close').addEventListener('click', () => {
      banner.remove();
    });

    document.body.prepend(banner);
  };

  return { render, showAnnouncement };
})();

window.Navbar = Navbar;
