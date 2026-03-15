/* ============================================
   AniTrack — Share & Export Module
   ============================================ */

window.shareWatchlist = async () => {
  const user = getUser();
  if (!user) { showToast('Login to share your watchlist', 'warning'); return; }
  
  const url = `${window.location.origin}/list.html?u=${user.id}`;
  const title = `${user.username}'s Watchlist on AniTrack`;
  const text = `Check out my anime watchlist!`;
  
  shareOrCopy(title, text, url);
};

window.shareAnime = async (id, dtTitle) => {
  const url = `${window.location.origin}/detail.html?id=${id}`;
  const title = `AniTrack: ${dtTitle}`;
  const text = `Check out this anime on AniTrack.`;
  
  shareOrCopy(title, text, url);
};

window.shareClub = async (id, dtTitle) => {
  const url = `${window.location.origin}/club-detail.html?id=${id}`;
  const title = `AniTrack Club: ${dtTitle}`;
  const text = `Join this club on AniTrack!`;
  
  shareOrCopy(title, text, url);
};

const shareOrCopy = async (title, text, url) => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      showToast('Shared successfully!', 'success');
    } catch (err) {
      if (err.name !== 'AbortError') {
        fallbackCopy(url);
      }
    }
  } else {
    fallbackCopy(url);
  }
};

const fallbackCopy = (url) => {
  navigator.clipboard.writeText(url).then(() => {
    showToast('Link copied to clipboard!', 'info');
  }).catch(() => {
    showToast('Failed to copy link', 'error');
  });
};

window.exportData = () => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('at_')) {
      data[key] = localStorage.getItem(key);
    }
  }
  
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `anitrack-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Data exported successfully', 'success');
};

window.importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        Object.keys(data).forEach(k => {
          if (k.startsWith('at_')) localStorage.setItem(k, data[k]);
        });
        showToast('Data imported successfully. Reloading...', 'success');
        setTimeout(() => location.reload(), 1500);
        resolve();
      } catch (err) {
        showToast('Invalid backup file format.', 'error');
        reject(err);
      }
    };
    reader.readAsText(file);
  });
};

window.Share = {
  shareWatchlist, shareAnime, shareClub, exportData, importData
};
