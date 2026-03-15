/* ============================================
   AniTrack — UI Helpers
   Toast · Modal · Skeleton · Spoiler · Confetti
   Lazy loading · Debounce · Throttle
   ============================================ */

const UI = (() => {
  /* ── Toast System ────────────────────────── */

  const ensureToastContainer = () => {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  };

  const TOAST_ICONS = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  /**
   * Show a toast notification.
   * @param {string} message
   * @param {'success'|'error'|'warning'|'info'} type
   * @param {number} duration — ms (default 4000)
   */
  const showToast = (message, type = 'info', duration = 4000) => {
    const container = ensureToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${TOAST_ICONS[type] || 'ℹ'}</span>
      <div class="toast-content">
        <span class="toast-message">${message}</span>
      </div>
      <button class="toast-close" aria-label="Close">&times;</button>
      <div class="toast-progress" style="animation-duration: ${duration}ms"></div>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => dismissToast(toast));

    container.appendChild(toast);

    const timer = setTimeout(() => dismissToast(toast), duration);
    toast._timer = timer;
  };

  const dismissToast = (toast) => {
    if (toast._dismissed) return;
    toast._dismissed = true;
    clearTimeout(toast._timer);
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove());
  };

  /* ── Modal System ────────────────────────── */

  /**
   * Show a modal dialog.
   * @param {object} options
   * @param {string} options.title
   * @param {string} options.body — HTML content
   * @param {string} [options.size] — 'sm', 'lg', 'fullscreen'
   * @param {Array<{label,class,onClick}>} [options.actions]
   * @param {Function} [options.onClose]
   * @returns {HTMLElement} the overlay element
   */
  const showModal = ({ title = '', body = '', size = '', actions = [], onClose = null }) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const sizeClass = size ? `modal-${size}` : '';

    let footerHtml = '';
    if (actions.length) {
      const btns = actions.map(
        (a, i) => `<button class="${a.class || 'btn btn-secondary'}" data-action="${i}">${a.label}</button>`
      ).join('');
      footerHtml = `<div class="modal-footer">${btns}</div>`;
    }

    overlay.innerHTML = `
      <div class="modal ${sizeClass}">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">${body}</div>
        ${footerHtml}
      </div>
    `;

    const close = () => {
      overlay.classList.remove('open');
      setTimeout(() => {
        overlay.remove();
        document.body.style.overflow = '';
      }, 200);
      if (onClose) onClose();
    };

    overlay.querySelector('.modal-close').addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    actions.forEach((action, i) => {
      const btn = overlay.querySelector(`[data-action="${i}"]`);
      btn?.addEventListener('click', () => {
        if (action.onClick) action.onClick(close);
      });
    });

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => overlay.classList.add('open'));

    overlay._close = close;
    return overlay;
  };

  /**
   * Close the topmost modal.
   */
  const closeModal = () => {
    const overlays = document.querySelectorAll('.modal-overlay.open');
    const top = overlays[overlays.length - 1];
    if (top?._close) top._close();
  };

  /**
   * Show a confirmation dialog.
   */
  const confirm = ({ title = 'Are you sure?', message = '', type = 'warning', confirmLabel = 'Confirm', cancelLabel = 'Cancel' }) => {
    return new Promise((resolve) => {
      showModal({
        title,
        body: `
          <div class="modal-confirm-icon ${type}">
            ${type === 'danger' ? '⚠' : type === 'success' ? '✓' : '⚠'}
          </div>
          <p class="modal-confirm-text">${message}</p>
        `,
        size: 'sm',
        actions: [
          { label: cancelLabel, class: 'btn btn-secondary', onClick: (close) => { close(); resolve(false); } },
          { label: confirmLabel, class: `btn btn-primary`, onClick: (close) => { close(); resolve(true); } },
        ],
        onClose: () => resolve(false),
      });
    });
  };

  /* ── Skeleton Loaders ────────────────────── */

  /**
   * Show skeleton placeholders inside a container.
   * @param {HTMLElement} container
   * @param {'card'|'row'|'text'} type
   * @param {number} count
   */
  const showSkeleton = (container, type = 'card', count = 6) => {
    let html = '';
    if (type === 'card') {
      html = `<div class="skeleton-grid">`;
      for (let i = 0; i < count; i++) {
        html += `
          <div class="skeleton-card">
            <div class="skeleton-card-cover skeleton"></div>
            <div class="skeleton-card-body">
              <div class="skeleton-card-title skeleton"></div>
              <div class="skeleton-card-meta skeleton"></div>
            </div>
          </div>`;
      }
      html += `</div>`;
    } else if (type === 'row') {
      for (let i = 0; i < count; i++) {
        html += `
          <div class="skeleton-row">
            <div class="skeleton-row-cover skeleton"></div>
            <div class="skeleton-row-content">
              <div class="skeleton-row-title skeleton"></div>
              <div class="skeleton-row-sub skeleton"></div>
            </div>
            <div class="skeleton-row-badge skeleton"></div>
          </div>`;
      }
    } else if (type === 'text') {
      html = `<div class="skeleton-paragraph">`;
      for (let i = 0; i < count; i++) {
        html += `<div class="skeleton-text skeleton" style="width: ${70 + Math.random() * 30}%"></div>`;
      }
      html += `</div>`;
    }

    container.innerHTML = html;
  };

  /**
   * Remove skeletons from a container.
   */
  const hideSkeleton = (container) => {
    container.innerHTML = '';
  };

  /* ── Spoiler Toggle ──────────────────────── */

  const toggleSpoiler = (element) => {
    element.classList.toggle('spoiler-revealed');
    if (element.classList.contains('spoiler-revealed')) {
      element.style.filter = 'none';
      element.style.cursor = 'default';
    } else {
      element.style.filter = 'blur(6px)';
      element.style.cursor = 'pointer';
    }
  };

  const initSpoilers = () => {
    document.querySelectorAll('[data-spoiler]').forEach((el) => {
      el.style.filter = 'blur(6px)';
      el.style.cursor = 'pointer';
      el.style.transition = 'filter 0.3s ease';
      el.addEventListener('click', () => toggleSpoiler(el));
    });
  };

  /* ── Confetti ────────────────────────────── */

  const fireConfetti = () => {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const colors = ['#E8004D', '#06D6A0', '#FFB703', '#00B4D8', '#8338EC', '#C9A84C'];
    const particles = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.3,
        opacity: 1,
      });
    }

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.vy += p.gravity;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.008;

        if (p.opacity <= 0) return;
        alive = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      frame++;
      if (alive && frame < 180) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };

    requestAnimationFrame(animate);
  };

  /* ── Lazy Load Images ────────────────────── */

  const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '200px' }
    );

    images.forEach((img) => observer.observe(img));
  };

  /* ── Utility Functions ───────────────────── */

  const debounce = (fn, ms = 400) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  };

  const throttle = (fn, ms = 200) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= ms) {
        last = now;
        fn(...args);
      }
    };
  };

  /**
   * Format a number with commas.
   */
  const formatNumber = (n) => {
    return new Intl.NumberFormat().format(n ?? 0);
  };

  /**
   * Relative time string (e.g. "3 days ago").
   */
  const timeAgo = (dateStr) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    const intervals = [
      { label: 'year', s: 31536000 },
      { label: 'month', s: 2592000 },
      { label: 'week', s: 604800 },
      { label: 'day', s: 86400 },
      { label: 'hour', s: 3600 },
      { label: 'minute', s: 60 },
    ];

    for (const { label, s } of intervals) {
      const count = Math.floor(seconds / s);
      if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
    }
    return 'just now';
  };

  /* ── Anime Components ────────────────────── */

  /**
   * Render an anime card.
   */
  const renderAnimeCard = (anime, showAddBtn = true) => {
    const title = anime.title_english || anime.title || 'Unknown';
    const score = anime.score || 'N/A';
    const img = (typeof getAnimeImage === 'function' 
      ? getAnimeImage(anime) 
      : anime?.images?.jpg?.large_image_url) || 
      '/placeholder.png';
    const type = anime.type || 'TV';
    const year = anime.year || anime.aired?.prop?.from?.year || '';

    return `
      <div class="anime-card" data-id="${anime.mal_id}">
        <div class="anime-card-cover" onclick="location.href='detail.html?id=${anime.mal_id}'">
          <img src="${img}" alt="${title}" loading="lazy">
          <div class="anime-card-score">⭐ ${score}</div>
          ${showAddBtn ? `<button class="anime-card-add" onclick="event.stopPropagation(); window.openAddToListModal(${anime.mal_id}, '${title.replace(/'/g, "\\'")}', '${img}', ${anime.episodes || 0})">+</button>` : ''}
        </div>
        <div class="anime-card-body">
          <h3 class="anime-card-title" title="${title}">${title}</h3>
          <div class="anime-card-meta">
            <span>${type}</span>
            <span>${year}</span>
          </div>
        </div>
      </div>
    `;
  };

  /**
   * Render skeleton cards.
   */
  const renderSkeletonCards = (count = 10) => {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="anime-card skeleton-card">
          <div class="skeleton-card-cover skeleton"></div>
          <div class="skeleton-card-body">
            <div class="skeleton-card-title skeleton"></div>
            <div class="skeleton-card-meta skeleton"></div>
          </div>
        </div>`;
    }
    return html;
  };

  /**
   * Render status badge.
   */
  const renderStatusBadge = (status) => {
    const labels = {
      watching: 'Watching',
      completed: 'Completed',
      onhold: 'On Hold',
      dropped: 'Dropped',
      plantowatch: 'Plan to Watch'
    };
    return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
  };

  /**
   * Render star rating.
   */
  const renderStars = (score) => {
    let html = '';
    const full = Math.floor(score / 2);
    const half = (score % 2) >= 1 ? 1 : 0;
    const empty = 5 - full - half;

    for (let i = 0; i < full; i++) html += '<span class="star-filled">★</span>';
    if (half) html += '<span class="star-half">★</span>';
    for (let i = 0; i < empty; i++) html += '<span class="star-empty">☆</span>';
    return html;
  };

  /**
   * Render progress bar.
   */
  const renderProgress = (watched, total) => {
    const pct = total ? Math.min(100, (watched / total) * 100) : 0;
    return `
      <div class="progress-container">
        <div class="progress-bar" style="width: ${pct}%"></div>
        <span class="progress-text">${watched} / ${total || '?'}</span>
      </div>
    `;
  };

  /**
   * Render error state.
   */
  const renderErrorState = (message, retryFn) => {
    return `
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>${message}</p>
        ${retryFn ? `<button class="btn btn-primary" onclick="${retryFn.name}()" style="margin-top:var(--space-md);">Retry</button>` : ''}
      </div>
    `;
  };

  /**
   * Render empty state.
   */
  const renderEmptyState = (icon, title, subtitle, ctaText, ctaHref) => {
    return `
      <div class="empty-state">
        <div class="empty-icon">${icon}</div>
        <h3>${title}</h3>
        <p>${subtitle}</p>
        ${ctaText ? `<button class="btn btn-primary" onclick="location.href='${ctaHref}'" style="margin-top:var(--space-md);">${ctaText}</button>` : ''}
      </div>
    `;
  };

  return {
    showToast,
    showModal,
    closeModal,
    confirm,
    showSkeleton,
    hideSkeleton,
    toggleSpoiler,
    initSpoilers,
    fireConfetti,
    lazyLoadImages,
    debounce,
    throttle,
    formatNumber,
    timeAgo,
    renderAnimeCard,
    renderSkeletonCards,
    renderStatusBadge,
    renderStars,
    renderProgress,
    renderErrorState,
    renderEmptyState
  };
})();

/**
 * Global sanitize function.
 */
function sanitize(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.showToast = UI.showToast;
window.openModal = UI.showModal;
window.closeModal = UI.closeModal;
window.sanitize = sanitize;
window.renderAnimeCard = UI.renderAnimeCard;
window.renderSkeletonCards = UI.renderSkeletonCards;
window.renderStars = UI.renderStars;
window.renderStatusBadge = UI.renderStatusBadge;
window.renderProgress = UI.renderProgress;
window.renderErrorState = UI.renderErrorState;
window.renderEmptyState = UI.renderEmptyState;
window.UI = UI;
