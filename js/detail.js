/* ============================================
   AniTrack — Anime Detail Module
   ============================================ */

const initDetail = () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) {
    location.href = 'index.html';
    return;
  }
  loadDetailData(id);
  initTabs();
};

const loadDetailData = async (id) => {
  try {
    const [anime, episodes, chars] = await Promise.all([
      fetchAnimeById(id),
      fetchEpisodes(id),
      fetchCharacters(id)
    ]);
    
    await new Promise(r => setTimeout(r, 400));
    const [videos, streaming] = await Promise.all([
      fetchVideos(id),
      fetchStreamingLinks(id)
    ]);
    
    await new Promise(r => setTimeout(r, 400));
    const recs = await fetchRecommendations(id);
    
    if (!anime) {
      document.querySelector('.page-wrapper').innerHTML = renderErrorState('Anime not found.', () => location.reload());
      return;
    }
    
    renderHero(anime, videos);
    renderEpisodesTab(episodes);
    renderCharactersTab(chars);
    renderStreamingBadges(streaming);
    renderRecommendations(recs);
    checkWatchlistStatus(id, anime);
    
  } catch (err) {
    console.error('Detail load error:', err);
  }
};

const checkWatchlistStatus = (animeId, anime) => {
  const entry = getWatchlist().find(e => e.animeId == animeId);
  const btnWrap = document.getElementById('hero-action-wrap');
  if (!btnWrap) return;
  
  if (entry) {
    btnWrap.innerHTML = `
      <div style="background:var(--bg-card); padding:var(--space-md); border-radius:var(--radius); border:1px solid var(--border-active);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--space-sm);">
          <span style="font-weight:var(--fw-bold); color:var(--text-primary);">${UI.renderStatusBadge(entry.status)}</span>
          <button onclick="window.incrementEp(${animeId})" class="btn-primary" style="padding:4px 8px; font-size:12px;">+1 Ep</button>
        </div>
        <div id="progress-cell-${animeId}">${UI.renderProgress(entry.watchedEp, entry.totalEp || anime?.episodes)}</div>
      </div>
    `;
  } else {
    btnWrap.innerHTML = `
      <button class="btn btn-primary" style="width:100%; font-size:var(--text-md);" 
              onclick="window.openAddToListModal(${animeId}, '${sanitize(anime.title || '').replace(/'/g, "\\'")}', '${getAnimeImage(anime)}', ${anime.episodes || 0})">
        + Add to Watchlist
      </button>
    `;
  }
};

const renderHero = (anime, videos) => {
  document.title = `${sanitize(anime.title || 'Detail')} — AniTrack`;
  
  const coverImg = document.getElementById('detail-cover');
  if (coverImg) coverImg.src = getAnimeImage(anime);
  
  const title = document.getElementById('detail-title');
  if (title) title.textContent = sanitize(anime.title || '');
  
  const jpTitle = document.getElementById('detail-title-jp');
  if (jpTitle) jpTitle.textContent = sanitize(anime.title_japanese || '');
  
  const score = document.getElementById('detail-score-row');
  if (score) score.innerHTML = UI.renderStars(anime.score ? anime.score : 0) + ` <span style="color:var(--text-primary); margin-left:8px;">${anime.score || 'N/A'}</span> / 10`;
  
  const genres = document.getElementById('detail-genres');
  if (genres) {
    genres.innerHTML = (anime.genres || []).map(g => `<span class="genre-tag">${sanitize(g.name)}</span>`).join('');
  }
  
  const syn = document.getElementById('detail-synopsis');
  if (syn) syn.innerHTML = sanitize(anime.synopsis || 'No synopsis available.').replace(/\n/g, '<br>');
  
  const stats = document.getElementById('detail-stats-grid');
  if (stats) {
    stats.innerHTML = `
      <div><span style="color:var(--text-muted); font-size:var(--text-xs);">FORMAT</span><br>${sanitize(anime.type || '?')}</div>
      <div><span style="color:var(--text-muted); font-size:var(--text-xs);">EPISODES</span><br>${anime.episodes || '?'}</div>
      <div><span style="color:var(--text-muted); font-size:var(--text-xs);">STATUS</span><br>${sanitize(anime.status || '?')}</div>
      <div><span style="color:var(--text-muted); font-size:var(--text-xs);">STUDIO</span><br>${sanitize(anime.studios?.[0]?.name || '?')}</div>
    `;
  }
  
  const trailer = document.getElementById('detail-trailer');
  if (trailer && videos?.promo?.[0]?.trailer?.embed_url) {
    trailer.innerHTML = `<iframe width="100%" height="300" src="${sanitize(videos.promo[0].trailer.embed_url)}" frameborder="0" allowfullscreen style="border-radius:var(--radius); border:1px solid var(--border-subtle);"></iframe>`;
  }
};

const renderEpisodesTab = (resp) => {
  const episodesData = resp?.data || [];
  const tab = document.getElementById('tab-episodes');
  if (!tab) return;
  
  if (episodesData.length === 0) {
    tab.innerHTML = '<p style="color:var(--text-muted);">No episode information available.</p>';
    return;
  }
  
  let html = '<div style="display:flex; flex-direction:column; gap:var(--space-sm);">';
  episodesData.forEach(ep => {
    const filler = ep.filler ? '<span class="badge badge-dropped" style="margin-left:auto;">Filler</span>' : '';
    html += `
      <div style="padding:var(--space-md); background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius); display:flex; gap:var(--space-md); align-items:center;">
        <div style="font-weight:var(--font-bold); color:var(--accent-primary); width:40px;">${ep.mal_id}</div>
        <div>
          <div style="font-weight:var(--font-medium);">${sanitize(ep.title || 'Episode ' + ep.mal_id)}</div>
          <div style="font-size:var(--text-sm); color:var(--text-muted);">${sanitize(ep.title_japanese || '')}</div>
        </div>
        ${filler}
      </div>
    `;
  });
  html += '</div>';
  tab.innerHTML = html;
};

const renderCharactersTab = (chars) => {
  const tab = document.getElementById('tab-characters');
  if (!tab) return;
  
  if (!chars || chars.length === 0) {
    tab.innerHTML = '<p style="color:var(--text-muted);">No characters found.</p>';
    return;
  }
  
  let html = '<div class="grid-auto">';
  const charsList = Array.isArray(chars) ? chars : [];
  charsList.slice(0, 20).forEach(c => {
    const charName = sanitize(c.character?.name || '');
    const charImg = sanitize(c.character?.images?.jpg?.image_url || '/placeholder.png');
    const vaName = sanitize(c.voice_actors?.[0]?.person?.name || 'Unknown VA');
    const role = c.role === 'Main' ? '<span style="color:var(--accent-primary); font-size:10px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">Main</span>' : '';
    
    html += `
      <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius); overflow:hidden; display:flex;">
        <img src="${charImg}" alt="${charName}" style="width:64px; height:80px; object-fit:cover;">
        <div style="padding:var(--space-sm); display:flex; flex-direction:column; justify-content:center;">
          <a href="character.html?id=${c.character?.mal_id}" style="font-size:var(--text-sm); font-weight:var(--font-bold); margin-bottom:2px;">${charName}</a>
          ${role}
          <div style="font-size:var(--text-xs); color:var(--text-muted); margin-top:auto;">${vaName}</div>
        </div>
      </div>
    `;
  });
  html += '</div>';
  tab.innerHTML = html;
};

const renderStreamingBadges = (links) => {
  const wrap = document.getElementById('streaming-badges');
  if (!wrap || !links || links.length === 0) return;
  
  const badges = links.map(l => renderPlatformBadge(l.name, l.url)).join('');
  wrap.innerHTML = badges;
};

const renderRecommendations = (recs) => {
  const wrap = document.getElementById('detail-recommendations');
  if (!wrap || !recs || recs.length === 0) return;
  
  const html = recs.slice(0, 10).map(r => UI.renderAnimeCard(r.entry, false)).join('');
  wrap.innerHTML = html;
};

const initTabs = () => {
  const btns = document.querySelectorAll('.detail-tab-btn');
  const panels = document.querySelectorAll('.detail-tab-panel');
  
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      e.currentTarget.classList.add('active');
      const targetId = e.currentTarget.dataset.tab;
      const targetPanel = document.getElementById('tab-' + targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
};

window.Detail = { init: initDetail };
