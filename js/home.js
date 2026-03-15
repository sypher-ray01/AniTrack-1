/* ============================================
   AniTrack — Home Page Module
   ============================================ */

const Home = (() => {
  /**
   * Initialise the home page.
   */
  const init = async () => {
    // 1. Hero
    initHero();

    // 2. Airing Row
    loadRow('airing', fetchAiringNow, 'airing-track');

    // 3. Top Rated Row
    loadRow('rated', fetchTopAnime, 'rated-track');
    
    // 4. Bind scroll arrows
    bindScrollArrows();
  };

  const initHero = async () => {
    const hero = document.getElementById('hero-banner');
    if (!hero) return;

    try {
      const data = await fetchUpcoming();
      const anime = data.data?.[Math.floor(Math.random() * 5)];
      
      if (!anime) return;

      const title = anime.title_english || anime.title;
      const subtype = anime.type || 'TV';
      const score = anime.score || 'N/A';
      const year = anime.year || anime.aired?.prop?.from?.year || '';
      const bannerImg = getAnimeImage(anime);

      hero.innerHTML = `
        <div class="hero-backdrop" style="background-image: url('${bannerImg}')"></div>
        <div class="hero-content">
          <div class="hero-meta">
            <span class="badge badge-primary">${subtype}</span>
            <span class="hero-score">⭐ ${score}</span>
            <span>${year}</span>
          </div>
          <h1 class="hero-title">${title}</h1>
          <p class="hero-desc">${(anime.synopsis || '').substring(0, 160)}...</p>
          <div class="hero-actions">
            <button class="btn btn-primary" onclick="location.href='detail.html?id=${anime.mal_id}'">View Details</button>
            <button class="btn btn-secondary" onclick="window.openAddToListModal(${anime.mal_id}, '${(title || '').replace(/'/g, "\\'")}', '${bannerImg}', ${anime.episodes || 0})">+ Watchlist</button>
          </div>
        </div>
      `;
    } catch (err) {
      console.error('Hero init error:', err);
    }
  };

  const loadRow = async (type, fetchMethod, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const { data } = await fetchMethod(1);
      if (!data || data.length === 0) {
        container.innerHTML = '<p class="error-text">Failed to load content.</p>';
        return;
      }

      container.innerHTML = data.map(anime => UI.renderAnimeCard(anime, true)).join('');
    } catch (err) {
      console.error(`Error loading ${type} row:`, err);
    }
  };

  const bindScrollArrows = () => {
    document.querySelectorAll('.scroll-row-arrow').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = btn.dataset.dir;
        const track = btn.parentElement.querySelector('.scroll-row-track');
        if (!track) return;

        const scrollAmount = track.clientWidth * 0.8;
        track.scrollBy({
          left: dir === 'right' ? scrollAmount : -scrollAmount,
          behavior: 'smooth'
        });
      });
    });
  };

  return { init };
})();

window.Home = Home;
