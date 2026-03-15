/* ============================================
   AniTrack — Seasonal Calendar Module
   ============================================ */

let currentYear = new Date().getFullYear();
let currentSeason = 'winter';

const initSeasonal = async () => {
  initNavigation();
  loadSeasonsList();
  
  // Default load now
  await loadCurrentSeason();
};

const loadCurrentSeason = async () => {
  const label = document.getElementById('season-label');
  if (label) label.textContent = 'Loading Current Season...';
  
  try {
    const res = await fetchSeasonNow();
    const data = res?.data;
    if (!data) {
      if (label) label.textContent = 'Failed to load season data.';
      return;
    }
    
    // Attempt to parse out strictly what year/season it represents
    // Jikan usually returns it inside the general response or we can guess from first item
    if (data[0] && data[0].year && data[0].season) {
      currentYear = data[0].year;
      currentSeason = data[0].season.toLowerCase();
      updateDropdownSilently(currentYear, currentSeason);
      updateLabel(currentYear, currentSeason);
    } else {
      if (label) label.textContent = 'Currently Airing';
    }
    
    const grouped = groupByDay(data);
    renderSeasonGrid(grouped);
    
  } catch (err) {
    console.error('Current season load error:', err);
  }
};

const updateLabel = (year, season) => {
  const label = document.getElementById('season-label');
  if (!label) return;
  const s = season.charAt(0).toUpperCase() + season.slice(1);
  label.textContent = `${s} ${year} — Currently Airing`;
};

const loadSeason = async (year, season) => {
  const label = document.getElementById('season-label');
  if (label) label.textContent = 'Loading...';
  
  try {
    const res = await fetchSeason(year, season);
    const data = res?.data;
    if (!data) {
      if (label) label.textContent = 'Failed to load season data.';
      return;
    }
    
    currentYear = parseInt(year, 10);
    currentSeason = season.toLowerCase();
    
    const s = season.charAt(0).toUpperCase() + season.slice(1);
    if (label) label.textContent = `${s} ${year}`;
    
    const grouped = groupByDay(data);
    renderSeasonGrid(grouped);
    
  } catch (err) {
    console.error('Season load error:', err);
  }
};

const groupByDay = (animes) => {
  const grouped = {
    Mondays: [], Tuesdays: [], Wednesdays: [], Thursdays: [],
    Fridays: [], Saturdays: [], Sundays: [], Unknown: []
  };
  
  animes.forEach(a => {
    let day = a.broadcast?.day;
    if (day) {
      // "Mondays at 00:00 (JST)" -> "Mondays"
      const d = day.split(' ')[0];
      if (grouped[d]) {
        grouped[d].push(a);
      } else {
        grouped.Unknown.push(a);
      }
    } else {
      grouped.Unknown.push(a);
    }
  });
  
  return grouped;
};

const renderSeasonGrid = (grouped) => {
  const days = ['Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays'];
  
  days.forEach(day => {
    const col = document.querySelector(`[data-day="${day.toLowerCase()}"]`);
    if (!col) return;
    
    if (grouped[day].length === 0) {
      col.innerHTML = '<p style="color:var(--text-muted); font-size:var(--text-sm);">No airing shows.</p>';
      return;
    }
    
    // Sort by score or members inside day
    const sorted = grouped[day].sort((a, b) => (b.members || 0) - (a.members || 0));
    
    const html = sorted.map(a => UI.renderAnimeCard(a, true)).join('');
    col.innerHTML = html;
  });
  
  // Unknown / TBA
  const tbaScroll = document.getElementById('tba-scroll');
  if (tbaScroll) {
    if (grouped.Unknown.length === 0) {
      tbaScroll.innerHTML = '<p style="color:var(--text-muted);">None</p>';
    } else {
      const sorted = grouped.Unknown.sort((a, b) => (b.members || 0) - (a.members || 0));
      tbaScroll.innerHTML = sorted.map(a => UI.renderAnimeCard(a, true)).join('');
    }
  }
};

const loadSeasonsList = async () => {
  const sel = document.getElementById('season-dropdown');
  if (!sel) return;
  
  try {
    const data = await fetchSeasonsList();
    if (!data) return;
    
    let html = '';
    data.forEach(item => {
      const y = item.year;
      item.seasons.forEach(s => {
        const seasonName = s.charAt(0).toUpperCase() + s.slice(1);
        html += `<option value="${y}-${s}">${seasonName} ${y}</option>`;
      });
    });
    
    sel.innerHTML = html;
    
  } catch (err) {
    console.error('Seasons list load error:', err);
  }
};

const initNavigation = () => {
  const prev = document.getElementById('season-prev');
  const next = document.getElementById('season-next');
  const sel = document.getElementById('season-dropdown');
  
  if (sel) {
    sel.addEventListener('change', (e) => {
      const [y, s] = e.target.value.split('-');
      if (y && s) loadSeason(y, s);
    });
  }
  
  const seasonsOrder = ['winter', 'spring', 'summer', 'fall'];
  
  const moveSeason = (offset) => {
    let idx = seasonsOrder.indexOf(currentSeason);
    if (idx === -1) idx = 0;
    
    idx += offset;
    let y = currentYear;
    
    if (idx < 0) {
      idx = 3;
      y--;
    } else if (idx > 3) {
      idx = 0;
      y++;
    }
    
    const newS = seasonsOrder[idx];
    updateDropdownSilently(y, newS);
    loadSeason(y, newS);
  };
  
  if (prev) prev.addEventListener('click', () => moveSeason(-1));
  if (next) next.addEventListener('click', () => moveSeason(1));
};

const updateDropdownSilently = (year, season) => {
  const sel = document.getElementById('season-dropdown');
  if (sel) {
    const val = `${year}-${season}`;
    // Check if option exists
    if (sel.querySelector(`option[value="${val}"]`)) {
      sel.value = val;
    }
  }
};

window.Seasonal = { init: initSeasonal };
