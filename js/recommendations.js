/* ============================================
   AniTrack — Recommendations Algorithm
   ============================================ */

const getPersonalRecommendations = async () => {
  try {
    const cached = sessionStorage.getItem('at_recs');
    if (cached) {
      const data = JSON.parse(cached);
      if (Date.now() - data.timestamp < 1000 * 60 * 60 * 24) {
        return data.recs; // valid for 24h
      }
    }
    
    const watchlist = getWatchlist();
    const active = watchlist.filter(e => ['watching', 'completed'].includes(e.status));
    
    if (active.length === 0) {
      // Fallback to top anime if list is empty
      const top = await fetchTopAnime(1);
      return top ? top.map(a => ({ entry: a })) : [];
    }
    
    const genreScore = {};
    active.forEach(entry => {
      const weight = (entry.score || 5) / 10;
      (entry.genres || []).forEach(g => {
        const name = typeof g === 'string' ? g : g.name;
        const id = g.mal_id;
        if (id) {
          genreScore[id] = (genreScore[id] || 0) + weight;
        }
      });
    });
    
    const topGenres = Object.entries(genreScore)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
      
    if (topGenres.length === 0) {
      const top = await fetchTopAnime(1);
      return top ? top.map(a => ({ entry: a })) : [];
    }
    
    let allRecs = [];
    for (const gid of topGenres) {
      await delay(400);
      const res = await window.fetchByGenre ? window.fetchByGenre(gid) : await fetchSearch('', 1, { genres: gid, order_by: 'score', sort: 'desc' });
      if (res) allRecs.push(...res);
    }
    
    // Deduplicate
    const uniqueMap = new Map();
    allRecs.forEach(a => {
      if (!uniqueMap.has(a.mal_id)) uniqueMap.set(a.mal_id, a);
    });
    
    let mixed = Array.from(uniqueMap.values());
    
    // Filter out already in watchlist
    const watchedIds = new Set(watchlist.map(e => parseInt(e.animeId, 10)));
    mixed = mixed.filter(a => !watchedIds.has(parseInt(a.mal_id, 10)));
    
    // Sort by score
    mixed.sort((a,b) => (b.score || 0) - (a.score || 0));
    
    const finalRecs = mixed.slice(0, 20).map(a => ({ entry: a }));
    
    sessionStorage.setItem('at_recs', JSON.stringify({
      timestamp: Date.now(),
      recs: finalRecs
    }));
    
    return finalRecs;
    
  } catch (err) {
    console.error('Recommendation engine error:', err);
    return [];
  }
};

window.getPersonalRecommendations = getPersonalRecommendations;
