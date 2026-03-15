/* ============================================
   AniTrack — Watchlist Module
   ============================================ */

let currentStatusFilter = 'all';

const initWatchlist = () => {
  if (!document.getElementById('watchlist-table')) return;
  initTabs();
  renderWatchlistTable(getWatchlistByStatus(currentStatusFilter));
};

const renderWatchlistTable = (entries) => {
  const tbody = document.getElementById('watchlist-tbody');
  const emptyState = document.getElementById('watchlist-empty');
  const tableWrap = document.getElementById('watchlist-table-wrap');

  if (!tbody || !emptyState || !tableWrap) return;

  if (entries.length === 0) {
    tableWrap.style.display = 'none';
    emptyState.style.display = 'flex';
    return;
  }

  tableWrap.style.display = 'block';
  emptyState.style.display = 'none';

  let html = '';
  entries.forEach((entry, index) => {
    const safeTitle = sanitize(entry.title);
    const safeCover = sanitize(entry.cover);
    const typeLabel = sanitize(entry.type || 'TV');
    const scoreVal = entry.score || '';
    
    html += `
      <tr data-index="${index}" data-id="${entry.animeId}" draggable="true">
        <td style="cursor:grab; color:var(--text-muted); text-align:center;">⋮⋮</td>
        <td>
          <img src="${safeCover}" alt="${safeTitle} cover" 
               style="width:40px; height:56px; border-radius:var(--radius-sm); object-fit:cover;" loading="lazy">
        </td>
        <td style="font-weight:var(--font-medium); max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${safeTitle}">
          <a href="detail.html?id=${entry.animeId}">${safeTitle}</a>
        </td>
        <td>
          <input type="number" min="1" max="10" value="${scoreVal}" 
                 onchange="updateScore(${entry.animeId}, this.value)" 
                 style="width:60px; padding:var(--space-xs); text-align:center;">
        </td>
        <td>
          <div class="ep-counter">
            <button class="ep-btn" onclick="decrementEp(${entry.animeId})" aria-label="Decrease episode">-</button>
            <span id="ep-count-${entry.animeId}">${entry.watchedEp}</span> / ${entry.totalEp || '?'}
            <button class="ep-btn" onclick="incrementEp(${entry.animeId})" aria-label="Increase episode">+</button>
          </div>
        </td>
        <td style="width:120px;" id="progress-cell-${entry.animeId}">
          ${UI.renderProgress(entry.watchedEp, entry.totalEp)}
        </td>
        <td><span class="badge" style="background:var(--bg-surface); border:1px solid var(--border-subtle);">${typeLabel}</span></td>
        <td>
          <select onchange="window.updateStatus(${entry.animeId}, this.value)" style="padding:var(--space-xs); font-size:var(--text-xs);">
            <option value="watching" ${entry.status === 'watching' ? 'selected' : ''}>Watching</option>
            <option value="completed" ${entry.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="onhold" ${entry.status === 'onhold' ? 'selected' : ''}>On Hold</option>
            <option value="dropped" ${entry.status === 'dropped' ? 'selected' : ''}>Dropped</option>
            <option value="plantowatch" ${entry.status === 'plantowatch' ? 'selected' : ''}>Plan to Watch</option>
          </select>
        </td>
        <td>
          <button onclick="window.deleteEntry(${entry.animeId})" 
                  style="background:transparent; border:none; color:var(--error); font-size:18px; cursor:pointer;"
                  aria-label="Delete ${safeTitle}">✕</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  initDragDrop();
};

const initTabs = () => {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      currentStatusFilter = target.dataset.status || 'all';
      renderWatchlistTable(getWatchlistByStatus(currentStatusFilter));
    });
  });
};

const initDragDrop = () => {
  const tbody = document.getElementById('watchlist-body');
  if (!tbody) return;

  let dragStartIndex = -1;

  const rows = tbody.querySelectorAll('tr');
  rows.forEach(row => {
    row.addEventListener('dragstart', (e) => {
      dragStartIndex = parseInt(row.dataset.index, 10);
      row.style.opacity = '0.5';
    });

    row.addEventListener('dragend', () => {
      row.style.opacity = '1';
      rows.forEach(r => {
        r.style.borderTop = '';
        r.style.borderBottom = '';
      });
    });

    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      const dropIndex = parseInt(row.dataset.index, 10);
      if (dragStartIndex === dropIndex) return;

      const bounding = row.getBoundingClientRect();
      const offset = bounding.y + (bounding.height / 2);
      if (e.clientY - offset > 0) {
        row.style.borderBottom = '2px solid var(--accent-primary)';
        row.style.borderTop = '';
      } else {
        row.style.borderTop = '2px solid var(--accent-primary)';
        row.style.borderBottom = '';
      }
    });

    row.addEventListener('dragleave', () => {
      row.style.borderTop = '';
      row.style.borderBottom = '';
    });

    row.addEventListener('drop', (e) => {
      e.preventDefault();
      const dropIndex = parseInt(row.dataset.index, 10);
      if (dragStartIndex === dropIndex || dragStartIndex === -1) return;

      const bounding = row.getBoundingClientRect();
      const offset = bounding.y + (bounding.height / 2);
      const isAfter = e.clientY - offset > 0;
      
      let finalDropIndex = dropIndex;
      if (isAfter && dragStartIndex > dropIndex) finalDropIndex++;
      if (!isAfter && dragStartIndex < dropIndex) finalDropIndex--;

      try {
        const list = getWatchlistByStatus(currentStatusFilter);
        const item = list.splice(dragStartIndex, 1)[0];
        list.splice(finalDropIndex, 0, item);
        
        if (currentStatusFilter === 'all') {
          saveWatchlist(list);
        } else {
          const fullList = getWatchlist();
          const filteredItemsIds = list.map(e => e.animeId);
          // A bit complex to reorder main list based on filtered, simple approach:
          // Just save full list if 'all', else don't support perfect reorder.
          if (currentStatusFilter === 'all') saveWatchlist(list);
        }
        renderWatchlistTable(getWatchlistByStatus(currentStatusFilter));
      } catch (err) {
        console.error('Drag drop error:', err);
      }
    });
  });
};

window.deleteEntry = (animeId) => {
  removeFromWatchlist(animeId);
  renderWatchlistTable(getWatchlistByStatus(currentStatusFilter));
  showToast('Entry removed', 'info');
};

window.updateScore = (animeId, score) => {
  const val = parseInt(score, 10);
  if (isNaN(val) || val < 1 || val > 10) return;
  updateWatchlistEntry(animeId, { score: val });
  showToast('Score updated', 'success');
};

window.updateStatus = (animeId, status) => {
  const list = getWatchlist();
  const entry = list.find(e => e.animeId === animeId);
  if (!entry) return;

  const wasCompleted = entry.status === 'completed';
  updateWatchlistEntry(animeId, { status });
  
  if (status === 'completed' && !wasCompleted) {
    fireConfetti();
    setTimeout(() => {
      showToast('Congratulations on completing another anime!', 'success');
    }, 500);
  } else {
    showToast('Status updated', 'success');
  }

  // If filtered view hide it immediately
  if (currentStatusFilter !== 'all' && currentStatusFilter !== status) {
    renderWatchlistTable(getWatchlistByStatus(currentStatusFilter));
  }
};

const fireConfetti = () => {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const colors = ['#06D6A0', '#00B4D8', '#FFB703', '#EF476F', '#E8004D'];
  const particles = Array(80).fill(0).map(() => ({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    vx: (Math.random() - 0.5) * 20,
    vy: (Math.random() - 1) * 20 - 5,
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 10
  }));

  let req;
  const draw = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let active = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.5; // gravity
      p.rotation += p.rotSpeed;
      
      if (p.y < window.innerHeight) active = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
      ctx.restore();
    });
    
    if (active) {
      req = requestAnimationFrame(draw);
    }
  };
  
  requestAnimationFrame(draw);
  setTimeout(() => {
    cancelAnimationFrame(req);
    canvas.remove();
  }, 4000);
};

window.openAddToListModal = async (animeId, title = '', cover = '', totalEp = 0) => {
  if (!title) {
    const data = await JikanAPI.getAnimeById(animeId);
    if (!data) {
      showToast('Anime not found', 'error');
      return;
    }
    title = data.title || data.title_english || 'Unknown';
    cover = data.images?.jpg?.large_image_url || '/placeholder.png';
    totalEp = data.episodes || 0;
  }

  const safeTitle = sanitize(title);
  const safeCover = sanitize(cover);
  
  const body = `
    <div style="display:flex; gap:var(--space-md); margin-bottom:var(--space-md);">
      <img src="${safeCover}" alt="${safeTitle}" style="width:80px; height:120px; border-radius:var(--radius-sm); object-fit:cover;">
      <div style="flex:1;">
        <h3 style="font-size:var(--text-md); font-weight:var(--font-semibold); margin-bottom:var(--space-sm);">${safeTitle}</h3>
        <label for="modal-status-select" style="display:block; font-size:var(--text-sm); color:var(--text-secondary); margin-bottom:var(--space-xs);">Select Status</label>
        <select id="modal-status-select" style="width:100%; border-radius:var(--radius); border:1px solid var(--border-input); padding:var(--space-sm);">
          <option value="watching">Watching</option>
          <option value="completed">Completed</option>
          <option value="onhold">On Hold</option>
          <option value="dropped">Dropped</option>
          <option value="plantowatch">Plan to Watch</option>
        </select>
      </div>
    </div>
  `;
  const footer = `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="window.confirmAddToList(${animeId}, '${safeTitle.replace(/'/g, "\\'")}', '${safeCover}', ${totalEp})">Save to List</button>
  `;
  
  UI.showModal({
    title: 'Add to Watchlist',
    body: body,
    footer: footer
  });
};

window.confirmAddToList = (animeId, title, cover, totalEp) => {
  const statusEl = document.getElementById('modal-status-select');
  if (!statusEl) return;
  const status = statusEl.value;

  addToWatchlist({
    animeId,
    title,
    cover,
    type: 'TV',
    totalEp,
    watchedEp: 0,
    status,
    score: null,
    startDate: new Date().toISOString(),
    finishDate: null,
    notes: '',
    genres: []
  });

  showToast('Added to watchlist', 'success');
  closeModal();
  if (document.body.dataset.page === 'watchlist') {
    renderWatchlistTable(getWatchlistByStatus(currentStatusFilter));
  }
};

window.Watchlist = { init: initWatchlist };
