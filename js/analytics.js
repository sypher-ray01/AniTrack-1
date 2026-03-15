/* ============================================
   AniTrack — Analytics Module
   ============================================ */

const initAnalytics = () => {
  const user = Auth.getUser();
  if (!user) { location.href = 'login.html'; return; }
  
  const stats = computeStats();
  document.getElementById('stat-shows').textContent = stats.totalShows;
  document.getElementById('stat-eps').textContent = stats.totalEpisodes;
  document.getElementById('stat-hours').textContent = stats.hours.toFixed(1);
  document.getElementById('stat-score').textContent = stats.avgScore.toFixed(1);
  
  initCharts();
  
  const top = computeTopRated();
  renderTopRated(top);
  
  loadAnalyticsRecommendations();
};

const computeStats = () => {
  const list = getWatchlist();
  const totalShows = list.length;
  let totalEpisodes = 0;
  let scoreSum = 0;
  let scoreCount = 0;
  
  list.forEach(e => {
    totalEpisodes += (e.watchedEp || 0);
    if (e.score > 0) {
      scoreSum += e.score;
      scoreCount++;
    }
  });
  
  const hours = totalEpisodes * 24 / 60;
  const avgScore = scoreCount > 0 ? scoreSum / scoreCount : 0;
  
  return { totalShows, totalEpisodes, hours, avgScore };
};

const computeGenreData = () => {
  const list = getWatchlist();
  const map = {};
  list.forEach(e => {
    (e.genres || []).forEach(g => {
      const name = typeof g === 'string' ? g : g.name;
      map[name] = (map[name] || 0) + 1;
    });
  });
  
  const sorted = Object.entries(map).sort((a,b) => b[1] - a[1]).slice(0, 6);
  return {
    labels: sorted.map(i => i[0]),
    data: sorted.map(i => i[1])
  };
};

const computeStatusData = () => {
  const list = getWatchlist();
  const map = { watching: 0, completed: 0, onhold: 0, dropped: 0, plantowatch: 0 };
  list.forEach(e => {
    if (map[e.status] !== undefined) map[e.status]++;
  });
  
  return {
    labels: ['Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'],
    data: [map.watching, map.completed, map.onhold, map.dropped, map.plantowatch],
    colors: ['#00B4D8', '#06D6A0', '#FFB703', '#EF476F', '#8338EC']
  };
};

const computeMonthlyActivity = () => {
  const list = getWatchlist();
  const labels = [];
  const data = Array(12).fill(0);
  
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleString('default', { month: 'short' }));
  }
  
  list.forEach(e => {
    const dateStr = e.updatedAt || e.addedAt;
    if (!dateStr) return;
    const date = new Date(dateStr);
    const monthsDiff = (now.getFullYear() - date.getFullYear()) * 12 + now.getMonth() - date.getMonth();
    
    if (monthsDiff >= 0 && monthsDiff < 12) {
      // Rough approximation of activity = episodes watched in that period,
      // but we only track total watched. So we just count title updates/adds
      // as "1 activity point" for the simplicity of this generic chart.
      data[11 - monthsDiff]++;
    }
  });
  
  return { labels, data };
};

const computeTopRated = () => {
  const list = getWatchlist();
  return list.filter(e => e.score > 0).sort((a,b) => b.score - a.score).slice(0, 5);
};

const renderTopRated = (top) => {
  const tbody = document.getElementById('top-rated-body');
  if (!tbody) return;
  
  if (top.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:var(--space-md); color:var(--text-muted);">No rated anime yet.</td></tr>';
    return;
  }
  
  let html = '';
  top.forEach((e, idx) => {
    html += `
      <tr>
        <td style="font-weight:bold; color:var(--accent-primary);">#${idx+1}</td>
        <td><img src="${sanitize(e.cover)}" style="width:32px; height:48px; border-radius:var(--radius-sm); object-fit:cover;"></td>
        <td style="font-weight:var(--font-semibold);"><a href="detail.html?id=${e.animeId}">${sanitize(e.title)}</a></td>
        <td style="color:var(--accent-gold); font-weight:bold;">★ ${e.score}</td>
        <td style="color:var(--text-muted);">${e.watchedEp}/${e.totalEp || '?'}</td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
};

const initCharts = () => {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js not loaded');
    return;
  }
  
  // Set defaults
  Chart.defaults.color = "var(--text-secondary)";
  Chart.defaults.font.family = "var(--font)";
  
  if (window.genreChart) window.genreChart.destroy();
  if (window.statusChart) window.statusChart.destroy();
  if (window.activityChart) window.activityChart.destroy();
  
  const gData = computeGenreData();
  const ctxGenre = document.getElementById('genre-chart');
  if (ctxGenre) {
    window.genreChart = new Chart(ctxGenre, {
      type: 'doughnut',
      data: {
        labels: gData.labels,
        datasets: [{
          data: gData.data,
          backgroundColor: ['#E8004D', '#0F3460', '#C9A84C', '#06D6A0', '#8338EC', '#FFB703'],
          borderWidth: 0
        }]
      },
      options: { cutout: '70%', plugins: { legend: { position: 'right' } } }
    });
  }
  
  const sData = computeStatusData();
  const ctxStatus = document.getElementById('status-chart');
  if (ctxStatus) {
    window.statusChart = new Chart(ctxStatus, {
      type: 'pie',
      data: {
        labels: sData.labels,
        datasets: [{
          data: sData.data,
          backgroundColor: sData.colors,
          borderWidth: 0
        }]
      },
      options: { plugins: { legend: { position: 'right' } } }
    });
  }
  
  const aData = computeMonthlyActivity();
  const ctxAct = document.getElementById('activity-chart');
  if (ctxAct) {
    window.activityChart = new Chart(ctxAct, {
      type: 'bar',
      data: {
        labels: aData.labels,
        datasets: [{
          label: 'Activity',
          data: aData.data,
          backgroundColor: '#E8004D',
          borderRadius: 4
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true, grid: { color: "var(--border-subtle)" } },
          x: { grid: { display: false } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }
};

const loadAnalyticsRecommendations = async () => {
  const wrap = document.getElementById('analytics-recommendations');
  if (!wrap) return;
  
  wrap.innerHTML = UI.renderSkeletonCards(5);
  
  const recs = await getPersonalRecommendations();
  if (recs.length === 0) {
    wrap.innerHTML = '<p style="color:var(--text-muted);">No recommendations at this time.</p>';
    return;
  }
  
  wrap.innerHTML = recs.slice(0, 10).map(r => UI.renderAnimeCard(r.entry, true)).join('');
};

window.Analytics = { init: initAnalytics };
