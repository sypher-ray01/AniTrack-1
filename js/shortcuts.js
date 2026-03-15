/* ============================================
   AniTrack — Keyboard Shortcuts + Command Palette
   ============================================ */

const Shortcuts = (() => {
  const COMMANDS = [
    { icon: '🏠', label: 'Go to Home',       shortcut: 'H',       action: () => { window.location.href = 'index.html'; } },
    { icon: '📋', label: 'Go to Watchlist',   shortcut: 'W',       action: () => { window.location.href = 'list.html'; } },
    { icon: '🔍', label: 'Go to Search',      shortcut: '/',       action: () => { window.location.href = 'search.html'; } },
    { icon: '📅', label: 'Go to Seasonal',    shortcut: 'S',       action: () => { window.location.href = 'seasonal.html'; } },
    { icon: '👥', label: 'Go to Clubs',       shortcut: 'C',       action: () => { window.location.href = 'clubs.html'; } },
    { icon: '📊', label: 'Go to Analytics',   shortcut: 'A',       action: () => { window.location.href = 'analytics.html'; } },
    { icon: '🌓', label: 'Toggle Theme',      shortcut: 'D',       action: () => { Theme.toggle(); } },
    { icon: '👤', label: 'Go to Profile',     shortcut: 'P',       action: () => { window.location.href = 'profile.html'; } },
    { icon: '❓', label: 'Go to Help',        shortcut: '?',       action: () => { window.location.href = 'help.html'; } },
  ];

  let paletteOverlay = null;
  let selectedIndex = 0;

  /**
   * Initialise global keyboard shortcuts.
   */
  const init = () => {
    document.addEventListener('keydown', handleKeydown);
  };

  const handleKeydown = (e) => {
    // Ignore if user is typing in an input / textarea
    const tag = e.target.tagName;
    const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable;

    // Command palette: Ctrl+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      togglePalette();
      return;
    }

    // Escape: close palette or modal
    if (e.key === 'Escape') {
      if (paletteOverlay) {
        closePalette();
      } else {
        UI.closeModal();
      }
      return;
    }

    // Don't intercept when typing
    if (isInput) return;

    // Single-key shortcuts
    switch (e.key) {
      case '/': e.preventDefault(); window.location.href = 'search.html'; break;
      case 'w': case 'W': window.location.href = 'list.html'; break;
      case 'd': case 'D': Theme.toggle(); break;
      default: break;
    }
  };

  /* ── Command Palette ─────────────────────── */

  const togglePalette = () => {
    if (paletteOverlay) {
      closePalette();
    } else {
      openPalette();
    }
  };

  const openPalette = () => {
    selectedIndex = 0;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay command-palette-overlay';

    overlay.innerHTML = `
      <div class="modal command-palette">
        <input
          type="text"
          class="command-palette-input"
          placeholder="Type a command…"
          id="command-palette-input"
          autocomplete="off"
        >
        <div class="command-palette-results" id="command-palette-results"></div>
        <div class="command-palette-footer">
          <span class="command-palette-hint"><kbd>↑↓</kbd> navigate</span>
          <span class="command-palette-hint"><kbd>↵</kbd> select</span>
          <span class="command-palette-hint"><kbd>esc</kbd> close</span>
        </div>
      </div>
    `;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePalette();
    });

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => overlay.classList.add('open'));

    paletteOverlay = overlay;

    const input = document.getElementById('command-palette-input');
    input.focus();
    input.addEventListener('input', () => renderResults(input.value));
    input.addEventListener('keydown', handlePaletteNav);

    renderResults('');
  };

  const closePalette = () => {
    if (!paletteOverlay) return;
    paletteOverlay.classList.remove('open');
    setTimeout(() => {
      paletteOverlay?.remove();
      paletteOverlay = null;
      document.body.style.overflow = '';
    }, 200);
  };

  const renderResults = (query) => {
    const container = document.getElementById('command-palette-results');
    if (!container) return;

    const q = query.toLowerCase().trim();
    const filtered = q
      ? COMMANDS.filter((c) => c.label.toLowerCase().includes(q))
      : COMMANDS;

    if (!filtered.length) {
      container.innerHTML = `<div class="command-palette-empty">No commands found</div>`;
      return;
    }

    selectedIndex = Math.min(selectedIndex, filtered.length - 1);

    container.innerHTML = filtered
      .map((cmd, i) => `
        <div class="command-palette-item ${i === selectedIndex ? 'selected' : ''}" data-index="${i}">
          <span class="command-palette-item-icon">${cmd.icon}</span>
          <span class="command-palette-item-label">${cmd.label}</span>
          ${cmd.shortcut ? `<span class="command-palette-item-shortcut">${cmd.shortcut}</span>` : ''}
        </div>
      `).join('');

    container.querySelectorAll('.command-palette-item').forEach((el) => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index, 10);
        filtered[idx]?.action();
        closePalette();
      });
      el.addEventListener('mouseenter', () => {
        selectedIndex = parseInt(el.dataset.index, 10);
        renderResults(query);
      });
    });
  };

  const handlePaletteNav = (e) => {
    const container = document.getElementById('command-palette-results');
    const items = container?.querySelectorAll('.command-palette-item') || [];
    const count = items.length;
    if (!count) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % count;
      updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + count) % count;
      updateSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      items[selectedIndex]?.click();
    }
  };

  const updateSelection = (items) => {
    items.forEach((el, i) => {
      el.classList.toggle('selected', i === selectedIndex);
    });
    items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
  };

  return { init };
})();

window.Shortcuts = Shortcuts;
