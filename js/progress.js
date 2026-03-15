/* ============================================
   AniTrack — Progress Tracking Module
   ============================================ */

window.getProgress = (animeId) => {
  const entry = getWatchlist().find(e => e.animeId === animeId);
  if (!entry) return { watched: 0, total: 0, pct: 0 };
  const watched = entry.watchedEp || 0;
  const total = entry.totalEp || 0;
  const pct = total > 0 ? Math.round((watched / total) * 100) : 0;
  return { watched, total, pct };
};

window.updateProgressBar = (animeId) => {
  const cell = document.getElementById('progress-cell-' + animeId);
  if (!cell) return;
  const data = getProgress(animeId);
  cell.innerHTML = renderProgress(data.watched, data.total);
};

window.incrementEp = (animeId) => {
  const entry = getWatchlist().find(e => e.animeId === animeId);
  if (!entry) return;
  
  const max = entry.totalEp || 9999;
  let next = (entry.watchedEp || 0) + 1;
  if (next > max) next = max;
  
  updateWatchlistEntry(animeId, { watchedEp: next });
  
  const el = document.getElementById('ep-count-' + animeId);
  if (el) el.textContent = next;
  
  updateProgressBar(animeId);
  
  if (next === entry.totalEp && entry.status !== 'completed') {
    window.updateStatus(animeId, 'completed');
  }
};

window.decrementEp = (animeId) => {
  const entry = getWatchlist().find(e => e.animeId === animeId);
  if (!entry) return;
  
  let next = (entry.watchedEp || 0) - 1;
  if (next < 0) next = 0;
  
  updateWatchlistEntry(animeId, { watchedEp: next });
  
  const el = document.getElementById('ep-count-' + animeId);
  if (el) el.textContent = next;
  
  updateProgressBar(animeId);
};
