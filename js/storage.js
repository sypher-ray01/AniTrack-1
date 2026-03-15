/* ============================================
   AniTrack — localStorage CRUD Helpers
   All keys auto-prefixed with "at_"
   ============================================ */

const Storage = (() => {
  const PREFIX = 'at_';

  /**
   * Get a value from localStorage (auto-parsed from JSON).
   * @param {string} key — raw key (prefix added automatically)
   * @returns {*} parsed value or null
   */
  const getItem = (key) => {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  /**
   * Set a value in localStorage (auto-stringified to JSON).
   */
  const setItem = (key, value) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      console.error(`[Storage] Failed to write key "${key}"`);
      return false;
    }
  };

  /**
   * Remove a key from localStorage.
   */
  const removeItem = (key) => {
    localStorage.removeItem(PREFIX + key);
  };

  /**
   * Check if a key exists.
   */
  const hasItem = (key) => {
    return localStorage.getItem(PREFIX + key) !== null;
  };

  /**
   * Get all AniTrack keys & values.
   */
  const getAll = () => {
    const result = {};
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (fullKey?.startsWith(PREFIX)) {
        const shortKey = fullKey.slice(PREFIX.length);
        result[shortKey] = getItem(shortKey);
      }
    }
    return result;
  };

  /**
   * Clear all AniTrack keys only.
   */
  const clearAll = () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (fullKey?.startsWith(PREFIX)) {
        keys.push(fullKey);
      }
    }
    keys.forEach((k) => localStorage.removeItem(k));
  };

  /* ── Multi-user helpers ──────────────────── */

  /**
   * Get a per-user value: at_{userId}_{key}
   */
  const getUserData = (userId, key) => {
    return getItem(`${userId}_${key}`);
  };

  /**
   * Set a per-user value.
   */
  const setUserData = (userId, key, value) => {
    return setItem(`${userId}_${key}`, value);
  };

  /**
   * Remove a per-user value.
   */
  const removeUserData = (userId, key) => {
    removeItem(`${userId}_${key}`);
  };

  /* ── Export / Import ─────────────────────── */

  /**
   * Export all AniTrack data as a JSON string.
   */
  const exportData = () => {
    return JSON.stringify(getAll(), null, 2);
  };

  /**
   * Import a full backup JSON string.
   */
  const importData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      Object.entries(data).forEach(([key, value]) => {
        setItem(key, value);
      });
      return true;
    } catch {
      console.error('[Storage] Import failed — invalid JSON');
      return false;
    }
  };

  /**
   * Generate a UUID v4.
   */
  const generateId = () => {
    return crypto.randomUUID?.() ??
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
  };

  return {
    getItem,
    setItem,
    removeItem,
    hasItem,
    getAll,
    clearAll,
    getUserData,
    setUserData,
    removeUserData,
    exportData,
    importData,
    generateId,
  };
})();

/* ── Watchlist CRUD ──────────────────────── */

window.getWatchlist = () => {
  return Storage.getItem('watchlist') || [];
};

window.saveWatchlist = (list) => {
  Storage.setItem('watchlist', list);
};

window.addToWatchlist = (item) => {
  const list = getWatchlist();
  if (list.find((e) => e.animeId === item.animeId)) return;
  list.push({
    ...item,
    addedAt: Date.now(),
    updatedAt: Date.now(),
  });
  saveWatchlist(list);
};

window.removeFromWatchlist = (animeId) => {
  const list = getWatchlist().filter((e) => e.animeId !== animeId);
  saveWatchlist(list);
};

window.updateWatchlistEntry = (animeId, updates) => {
  const list = getWatchlist();
  const index = list.findIndex((e) => e.animeId === animeId);
  if (index === -1) return;
  list[index] = { ...list[index], ...updates, updatedAt: Date.now() };
  saveWatchlist(list);
};

window.getWatchlistByStatus = (status) => {
  const list = getWatchlist();
  if (!status || status === 'all') return list;
  return list.filter((e) => e.status === status);
};

// Make available globally
window.Storage = Storage;
