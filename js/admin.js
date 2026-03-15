/* ============================================
   AniTrack — Admin Panel Module
   ============================================ */

const initAdmin = () => {
  if (!isAdmin()) { location.href = 'index.html'; return; }
  
  initTabs();
  loadUsers();
  loadReports();
  loadCurrentAnnouncement();
};

const initTabs = () => {
  const btns = document.querySelectorAll('.admin-tab-btn');
  const panels = document.querySelectorAll('.admin-panel');
  
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      e.currentTarget.classList.add('active');
      const targetId = e.currentTarget.dataset.tab;
      const targetPanel = document.getElementById('panel-' + targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
};

const loadUsers = () => {
  const tbody = document.getElementById('admin-users-body');
  if (!tbody) return;
  
  // Note: in a real app or multi-user mock, we'd iterate getAllUsers.
  // Here we just mock the current user + a few fake accounts to show the UI.
  let users = (typeof getAllUsers === 'function') ? getAllUsers() : [];
  if (users.length === 0) {
    const me = getUser();
    if (me) users = [me];
  }
  
  let html = '';
  users.forEach(u => {
    // Check if the id is the real one, this demo logic is slightly superficial due to lack of real backend
    const uData = u.email ? u : { username: u.username, id: u.id, joinedAt: Date.now(), isAdmin: u.username === 'admin', isBanned: false };
    const date = new Date(uData.joinedAt).toLocaleDateString();
    
    html += `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:var(--space-sm);">
            <div style="width:32px; height:32px; border-radius:var(--radius-full); background:var(--bg-hover); display:flex; align-items:center; justify-content:center; color:var(--text-muted);">
              ${uData.username.charAt(0).toUpperCase()}
            </div>
            <span style="font-weight:var(--font-semibold);">${sanitize(uData.username)}</span>
          </div>
        </td>
        <td style="color:var(--text-muted);">${date}</td>
        <td>-</td>
        <td>
          <label style="display:flex; align-items:center; cursor:pointer;">
            <input type="checkbox" onchange="window.toggleAdmin('${uData.id}')" ${uData.isAdmin ? 'checked' : ''} style="accent-color:var(--accent-primary);">
            <span style="margin-left:8px; font-size:var(--text-sm);">Admin</span>
          </label>
        </td>
        <td>
          <button onclick="window.banUser('${uData.id}')" style="background:var(--error); color:white; border:none; padding:4px 12px; border-radius:var(--radius-sm); font-size:var(--text-xs); font-weight:var(--font-bold); cursor:pointer;">
            ${uData.isBanned ? 'UNBAN' : 'BAN'}
          </button>
        </td>
      </tr>
    `;
  });
  
  tbody.innerHTML = html;
};

window.toggleAdmin = (userId) => {
  // Mock logic without full backend
  showToast('Admin privileges toggled', 'success');
};

window.banUser = (userId) => {
  // Mock logic
  showToast('User access revoked', 'info');
};

const loadReports = () => {
  const list = document.getElementById('admin-reports-list');
  if (!list) return;
  
  const reported = (typeof getReported === 'function') ? getReported() : [];
  if (reported.length === 0) {
    list.innerHTML = renderEmptyState('✅', 'All Clear', 'No pending reports to moderate.', '', '');
    return;
  }
  
  let html = '';
  reported.forEach(r => {
    html += `
      <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius); padding:var(--space-md); margin-bottom:var(--space-sm);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:var(--space-sm); margin-bottom:var(--space-sm);">
          <div style="display:flex; gap:12px; align-items:center;">
            <span class="badge" style="background:var(--bg-hover); color:var(--text-primary); text-transform:uppercase;">${sanitize(r.type)}</span>
            <span style="color:var(--text-muted); font-size:var(--text-sm);">Reported by ${sanitize(r.reportedBy)}</span>
          </div>
          <span style="color:var(--text-muted); font-size:var(--text-xs);">${new Date(r.createdAt).toLocaleString()}</span>
        </div>
        <div style="font-weight:var(--font-semibold); margin-bottom:4px;">Reason: ${sanitize(r.reason)}</div>
        <div style="font-family:monospace; color:var(--text-secondary); font-size:var(--text-sm); margin-bottom:var(--space-md); background:var(--bg-surface); padding:8px; border-radius:4px;">Content ID: ${r.contentId}</div>
        <div style="display:flex; gap:var(--space-md);">
          <button onclick="window.resolveReport('${r.contentId}', 'approve')" class="btn-primary" style="padding:6px 16px; font-size:13px; background:var(--success);">Approve (Ignore)</button>
          <button onclick="window.resolveReport('${r.contentId}', 'remove')" class="btn-primary" style="padding:6px 16px; font-size:13px;">Delete Content</button>
        </div>
      </div>
    `;
  });
  
  list.innerHTML = html;
};

window.resolveReport = (contentId, action) => {
  const reported = getReported();
  const r = reported.find(rp => rp.contentId === contentId);
  if (!r) return;
  
  if (action === 'remove') {
    if (r.type === 'review') {
      const reviews = getReviews();
      saveReviews(reviews.filter(rev => rev.reviewId !== contentId));
    } else if (r.type === 'thread' || r.type === 'reply') {
      const clubs = getClubs();
      clubs.forEach(c => {
        c.threads = c.threads.filter(t => t.threadId !== contentId);
        c.threads.forEach(t => {
          if (t.replies) t.replies = t.replies.filter(rep => rep.replyId !== contentId);
        });
      });
      saveClubs(clubs);
    }
    showToast('Content permanently deleted', 'success');
  } else {
    showToast('Report dismissed', 'info');
  }
  
  const filtered = reported.filter(rp => rp.contentId !== contentId);
  try { localStorage.setItem('at_reported', JSON.stringify(filtered)); } catch {}
  
  loadReports();
};

const loadCurrentAnnouncement = () => {
  const textInput = document.getElementById('announcement-text');
  const activeCheck = document.getElementById('announcement-active');
  if (!textInput || !activeCheck) return;
  
  const current = (typeof getAnnouncement === 'function') ? getAnnouncement() : null;
  if (current) {
    textInput.value = current.text || '';
    activeCheck.checked = !!current.active;
  }
};

window.saveAnnouncementAction = () => {
  const text = document.getElementById('announcement-text')?.value;
  const active = document.getElementById('announcement-active')?.checked;
  if (text === undefined) return;
  
  if (typeof saveAnnouncement === 'function') {
    saveAnnouncement({ text, active, createdAt: Date.now() });
    showToast('Announcement updated globally', 'success');
  }
};

window.Admin = { init: initAdmin };
