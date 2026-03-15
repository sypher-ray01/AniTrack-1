/* ============================================
   AniTrack — Profile Module
   ============================================ */

const initProfile = () => {
  const user = getUser();
  if (!user) { location.href = 'login.html'; return; }
  
  // Render Header
  const uname = document.getElementById('profile-username');
  if (uname) uname.textContent = sanitize(user.username);
  
  const bio = document.getElementById('profile-bio');
  if (bio) bio.textContent = sanitize(user.bio || 'New anime fan.');
  
  const avatar = document.getElementById('profile-avatar');
  if (avatar) avatar.src = sanitize(user.avatar || '/placeholder.png');
  
  const join = document.getElementById('profile-joined');
  if (join && user.joinedAt) join.textContent = `Joined ${new Date(user.joinedAt).toLocaleDateString()}`;
  
  // Stats
  if (typeof computeStats === 'function') {
    const stats = computeStats();
    const shows = document.getElementById('prof-stat-shows');
    if (shows) shows.textContent = stats.totalShows;
    const eps = document.getElementById('prof-stat-eps');
    if (eps) eps.textContent = stats.totalEpisodes;
    const hrs = document.getElementById('prof-stat-hours');
    if (hrs) hrs.textContent = stats.hours.toFixed(1);
    const score = document.getElementById('prof-stat-score');
    if (score) score.textContent = stats.avgScore.toFixed(1);
  }
  
  // Activity Feed
  renderActivityFeed();
};

window.toggleEditProfile = () => {
  const form = document.getElementById('edit-profile-form');
  if (!form) return;
  const isHidden = form.style.display === 'none' || form.style.display === '';
  form.style.display = isHidden ? 'block' : 'none';
  
  if (isHidden) {
    const user = getUser();
    document.getElementById('edit-bio').value = user.bio || '';
    document.getElementById('edit-avatar').value = user.avatar || '';
  }
};

window.saveProfileInfo = (e) => {
  e.preventDefault();
  const bio = document.getElementById('edit-bio').value.trim();
  const avatar = document.getElementById('edit-avatar').value.trim();
  
  updateUser({ bio, avatar });
  showToast('Profile updated', 'success');
  
  setTimeout(() => location.reload(), 1000);
};

window.changePassword = async (e) => {
  e.preventDefault();
  // Simplified mock without old password check
  const newPw = document.getElementById('new-password').value;
  const confirmPw = document.getElementById('confirm-password').value;
  
  if (newPw !== confirmPw) {
    showToast('Passwords do not match', 'error');
    return;
  }
  
  if (newPw.length < 6) {
    showToast('Password must be 6+ chars', 'warning');
    return;
  }
  
  if (typeof hashPassword === 'function') {
    const hash = await hashPassword(newPw);
    updateUser({ passwordHash: hash });
    showToast('Password changed successfully', 'success');
    e.target.reset();
  }
};

window.deleteAccount = () => {
  const code = document.getElementById('delete-confirm-code').value;
  if (code !== 'DELETE') {
    showToast('Please type DELETE to confirm', 'error');
    return;
  }
  
  // Wipe
  localStorage.removeItem('at_user');
  localStorage.removeItem('at_session');
  localStorage.removeItem('at_watchlist');
  
  showToast('Account deleted. Goodbye!', 'info');
  setTimeout(() => location.href = 'index.html', 1500);
};

const renderActivityFeed = () => {
  const wrap = document.getElementById('recent-activity-feed');
  if (!wrap) return;
  
  const list = getWatchlist().sort((a,b) => (b.updatedAt || b.addedAt) - (a.updatedAt || a.addedAt)).slice(0, 5);
  
  if (list.length === 0) {
    wrap.innerHTML = '<p style="color:var(--text-muted); padding:var(--space-md);">No recent activity.</p>';
    return;
  }
  
  let html = '';
  list.forEach(e => {
    let msg = `Added to <b>${sanitize(e.status)}</b>`;
    if (e.status === 'watching' && e.watchedEp > 0) {
      msg = `Watched episode ${e.watchedEp}`;
    } else if (e.status === 'completed') {
      msg = `Completed ${e.score ? 'and rated ★ ' + e.score : ''}`;
    }
    
    html += `
      <div style="display:flex; gap:12px; border-bottom:1px solid var(--border-subtle); padding:var(--space-md) 0;">
        <img src="${sanitize(e.cover)}" style="width:40px; height:60px; object-fit:cover; border-radius:var(--radius-sm);">
        <div>
          <a href="detail.html?id=${e.animeId}" style="font-weight:var(--font-bold); color:var(--text-primary);">${sanitize(e.title)}</a>
          <p style="color:var(--text-secondary); font-size:var(--text-sm); margin-top:4px;">${msg}</p>
          <span style="color:var(--text-muted); font-size:var(--text-xs);">${new Date(e.updatedAt || e.addedAt).toLocaleDateString()}</span>
        </div>
      </div>
    `;
  });
  
  wrap.innerHTML = html;
};

window.Profile = { init: initProfile };
