/* ============================================
   AniTrack — Jikan API v4 Wrapper
   Rate limiting · Response caching · Null-safe
   ============================================ */

const JikanAPI = (() => {
  const BASE_URL = 'https://api.jikan.moe/v4';
  const RATE_LIMIT_MS = 340;          // ~3 req/sec
  const CACHE_TTL = 5 * 60 * 1000;    // 5 minutes

  let lastRequestTime = 0;
  const cache = new Map();

  /* ── Rate-limited fetch ──────────────────── */
  const rateLimitedFetch = async (url, retryCount = 0) => {
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < RATE_LIMIT_MS) {
      await new Promise((r) => setTimeout(r, RATE_LIMIT_MS - elapsed));
    }
    lastRequestTime = Date.now();

    // Check cache
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 429 && retryCount < 2) {
          // Rate limited — exponential backoff retry (1000ms, 2000ms)
          const waitTime = Math.pow(2, retryCount) * 1000;
          await new Promise((r) => setTimeout(r, waitTime));
          return rateLimitedFetch(url, retryCount + 1);
        }
        console.error(`[JikanAPI] ${res.status} — ${url}`);
        return null;
      }

      const json = await res.json();
      
      // Cache size limit
      if (cache.size > 200) {
        cache.delete(cache.keys().next().value);
      }
      
      cache.set(url, { data: json, timestamp: Date.now() });
      return json;
    } catch (err) {
      console.error(`[JikanAPI] Fetch error — ${url}`, err);
      return null;
    }
  };

  /**
   * Extract data array safely.
   */
  const extractData = (response) => response?.data ?? [];
  const extractSingle = (response) => response?.data ?? null;
  const extractPagination = (response) => response?.pagination ?? null;

  /* ── Endpoints ───────────────────────────── */

  /** Top anime (default or filtered). */
  const getTopAnime = async (page = 1, filter = '') => {
    const filterParam = filter ? `&filter=${filter}` : '';
    const res = await rateLimitedFetch(
      `${BASE_URL}/top/anime?page=${page}&limit=24${filterParam}`
    );
    return { data: extractData(res), pagination: extractPagination(res) };
  };

  /** Top airing anime. */
  const getAiring = async (page = 1) => {
    return getTopAnime(page, 'airing');
  };

  /** Search anime with optional filters. */
  const search = async (query = '', filters = {}, page = 1) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('page', page);
    params.set('limit', '20');
    if (filters.genres) params.set('genres', filters.genres);
    if (filters.type) params.set('type', filters.type);
    if (filters.status) params.set('status', filters.status);
    if (filters.rating) params.set('rating', filters.rating);
    if (filters.orderBy) params.set('order_by', filters.orderBy);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.minScore) params.set('min_score', filters.minScore);
    if (filters.maxScore) params.set('max_score', filters.maxScore);
    if (filters.startDate) params.set('start_date', filters.startDate);
    if (filters.endDate) params.set('end_date', filters.endDate);

    const res = await rateLimitedFetch(`${BASE_URL}/anime?${params.toString()}`);
    return { data: extractData(res), pagination: extractPagination(res) };
  };

  /** Full anime details by ID. */
  const getAnimeById = async (id) => {
    const res = await rateLimitedFetch(`${BASE_URL}/anime/${id}/full`);
    return extractSingle(res);
  };

  /** Episode list for an anime. */
  const getEpisodes = async (id, page = 1) => {
    const res = await rateLimitedFetch(
      `${BASE_URL}/anime/${id}/episodes?page=${page}`
    );
    return { data: extractData(res), pagination: extractPagination(res) };
  };

  /** Videos / trailers for an anime. */
  const getVideos = async (id) => {
    const res = await rateLimitedFetch(`${BASE_URL}/anime/${id}/videos`);
    return extractSingle(res);
  };

  /** Streaming links for an anime. */
  const getStreaming = async (id) => {
    const res = await rateLimitedFetch(`${BASE_URL}/anime/${id}/streaming`);
    return extractData(res);
  };

  /** Recommendations for an anime. */
  const getRecommendations = async (id) => {
    const res = await rateLimitedFetch(
      `${BASE_URL}/anime/${id}/recommendations`
    );
    return extractData(res);
  };

  /** Characters for an anime. */
  const getCharacters = async (id) => {
    const res = await rateLimitedFetch(`${BASE_URL}/anime/${id}/characters`);
    return extractData(res);
  };

  /** Staff for an anime. */
  const getStaff = async (id) => {
    const res = await rateLimitedFetch(`${BASE_URL}/anime/${id}/staff`);
    return extractData(res);
  };

  /** Character details by ID. */
  const getCharacterById = async (id) => {
    const res = await rateLimitedFetch(`${BASE_URL}/characters/${id}/full`);
    return extractSingle(res);
  };

  /** Character's anime appearances. */
  const getCharacterAnime = async (id) => {
    const res = await rateLimitedFetch(`${BASE_URL}/characters/${id}/anime`);
    return extractData(res);
  };

  /** All genres list. */
  const getGenres = async () => {
    const res = await rateLimitedFetch(`${BASE_URL}/genres/anime`);
    return extractData(res);
  };

  /** Current season anime. */
  const getCurrentSeason = async (page = 1) => {
    const res = await rateLimitedFetch(
      `${BASE_URL}/seasons/now?page=${page}&limit=24`
    );
    return { data: extractData(res), pagination: extractPagination(res) };
  };

  /** Specific season anime. */
  const getSeason = async (year, season, page = 1) => {
    const res = await rateLimitedFetch(
      `${BASE_URL}/seasons/${year}/${season}?page=${page}&limit=24`
    );
    return { data: extractData(res), pagination: extractPagination(res) };
  };

  /** All seasons list. */
  const getSeasonsList = async () => {
    const res = await rateLimitedFetch(`${BASE_URL}/seasons`);
    return extractData(res);
  };

  /** News for an anime. */
  const getAnimeNews = async (id) => {
    const res = await rateLimitedFetch(`${BASE_URL}/anime/${id}/news`);
    return extractData(res);
  };

  /** Clear the response cache. */
  const clearCache = () => {
    cache.clear();
  };

  /**
   * Helper: get image URL safely from an anime object.
   */
  const getImageUrl = (item) => {
    return item?.images?.jpg?.large_image_url
      ?? item?.images?.jpg?.image_url
      ?? item?.images?.webp?.large_image_url
      ?? '';
  };

  return {
    getTopAnime,
    getAiring,
    search,
    getAnimeById,
    getEpisodes,
    getVideos,
    getStreaming,
    getRecommendations,
    getCharacters,
    getStaff,
    getCharacterById,
    getCharacterAnime,
    getGenres,
    getCurrentSeason,
    getSeason,
    getSeasonsList,
    getAnimeNews,
    clearCache,
    getImageUrl,
  };
})();

window.JikanAPI = JikanAPI;
