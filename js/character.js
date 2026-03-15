/* ============================================
   AniTrack — Character Profile Module
   ============================================ */

const initCharacter = () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) {
    location.href = 'index.html';
    return;
  }
  loadCharacterData(id);
};

const loadCharacterData = async (id) => {
  try {
    const char = await JikanAPI.getCharacterById(id);
    await new Promise(r => setTimeout(r, 400));
    const anime = await JikanAPI.getCharacterAnime(id);
    
    if (!char) {
      document.querySelector('.page-wrapper').innerHTML = renderErrorState('Character not found.', () => location.reload());
      return;
    }
    
    renderCharacterProfile(char);
    renderVoiceActors(char.voices || []);
    renderAppearances(anime || []);
    
  } catch (err) {
    console.error('Character load error:', err);
  }
};

const renderCharacterProfile = (char) => {
  const name = sanitize(char.name || 'Unknown');
  document.title = `${name} — AniTrack`;
  
  const cover = document.getElementById('char-cover');
  if (cover) cover.src = sanitize(char.images?.jpg?.image_url || '/placeholder.png');
  
  const title = document.getElementById('char-name');
  if (title) title.textContent = name;
  
  const jpName = document.getElementById('char-jp-name');
  if (jpName) jpName.textContent = sanitize(char.name_kanji || '');
  
  const bio = document.getElementById('char-bio');
  if (bio) bio.innerHTML = sanitize(char.about || 'No biography available.').replace(/\n/g, '<br>');
};

const renderVoiceActors = (vas) => {
  const tbody = document.getElementById('va-table-body');
  if (!tbody) return;
  
  if (!vas || vas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="2" style="text-align:center; padding:var(--space-md); color:var(--text-muted);">No voice actors available.</td></tr>';
    return;
  }
  
  let html = '';
  // Avoid massive list, show top 10
  vas.slice(0, 10).forEach(va => {
    const p = va.person;
    html += `
      <tr>
        <td style="width:60px; padding:var(--space-sm);">
          <img src="${sanitize(p.images?.jpg?.image_url || '/placeholder.png')}" alt="${sanitize(p.name)}" style="width:40px; height:40px; border-radius:var(--radius-full); object-fit:cover;">
        </td>
        <td style="padding:var(--space-sm);">
          <div style="font-weight:var(--font-bold); color:var(--text-primary);">${sanitize(p.name)}</div>
          <div style="font-size:var(--text-sm); color:var(--text-muted);">${sanitize(va.language)}</div>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
};

const renderAppearances = (anime) => {
  const grid = document.getElementById('char-appearances');
  if (!grid) return;
  
  if (!anime || anime.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);">No anime appearances found.</p>';
    return;
  }
  
  // Sort by popularity/role
  const sorted = anime.sort((a, b) => {
    if (a.role === 'Main' && b.role !== 'Main') return -1;
    if (a.role !== 'Main' && b.role === 'Main') return 1;
    return 0;
  });
  
  let html = '';
  sorted.slice(0, 20).forEach(r => {
    const a = r.anime;
    html += UI.renderAnimeCard(a, false);
  });
  
  grid.innerHTML = html;
};

window.Character = { init: initCharacter };
