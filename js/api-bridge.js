/* ─────────────────────────────────────────────────
   api-bridge.js
   Maps old function names → JikanAPI object methods
   Explicitly attaches to window for global access
───────────────────────────────────────────────── */

(function(window) {
  if (!window.JikanAPI) {
    console.error('api-bridge.js: JikanAPI not found. Make sure api.js is loaded first.');
    return;
  }

  // Home
  window.fetchTopAnime = (page = 1) => JikanAPI.getTopAnime(page);
  window.fetchAiringNow = (page = 1) => JikanAPI.getAiring(page);
  window.fetchTopAiring = () => JikanAPI.getAiring(1);
  window.fetchUpcoming = () => JikanAPI.getTopAnime(1, 'upcoming');

  // Search
  window.fetchSearch = (query, page = 1, filters = {}) => JikanAPI.search(query, filters, page);
  window.fetchGenres = () => JikanAPI.getGenres();
  window.fetchByGenre = (genreId, page = 1) => JikanAPI.search('', { genres: genreId }, page);

  // Detail
  window.fetchAnimeById = (id) => JikanAPI.getAnimeById(id);
  window.fetchEpisodes = (id, page = 1) => JikanAPI.getEpisodes(id, page);
  window.fetchVideos = (id) => JikanAPI.getVideos(id);
  window.fetchStreamingLinks = (id) => JikanAPI.getStreaming(id);
  window.fetchRecommendations = (id) => JikanAPI.getRecommendations(id);
  window.fetchCharacters = (id) => JikanAPI.getCharacters(id);
  window.fetchStaff = (id) => JikanAPI.getStaff(id);

  // Character
  window.fetchCharacterById = (id) => JikanAPI.getCharacterById(id);
  window.fetchCharacterAnime = (id) => JikanAPI.getCharacterAnime(id);

  // Seasonal
  window.fetchSeasonNow = () => JikanAPI.getCurrentSeason();
  window.fetchSeason = (year, season) => JikanAPI.getSeason(year, season);
  window.fetchSeasonsList = () => JikanAPI.getSeasonsList();

  // Image helper
  window.getAnimeImage = (anime) => (JikanAPI.getImageUrl(anime) || '/placeholder.png');

  console.log('AniTrack API Bridge initialized successfully.');
})(window);
