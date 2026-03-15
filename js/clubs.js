/* ============================================
   AniTrack — Clubs & Threads Module
   ============================================ */

const initClubs = () => {
  loadClubs();
  const search = document.getElementById('club-search');
  if (search) {
    search.addEventListener('input', (e) => filterClubs(e.target.value.toLowerCase()));
  }
};

const initClubDetail = () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) {
    location.href = 'clubs.html';
    return;
  }
  loadClubDetail(id);
};

const loadClubs = () => {
  try {
    const clubs = JSON.parse(localStorage.getItem('at_clubs') || '[]')
    const grid = document.getElementById('clubs-grid')
    if (!grid) return

    if (clubs.length === 0) {
      grid.innerHTML = renderEmptyState(
        '👥',
        'No clubs yet',
        'Be the first to create a community',
        'Create Club',
        '#'
      )
      return
    }

    grid.innerHTML = clubs.map(club => renderClubCard(club)).join('')
  } catch(e) {
    console.error('loadClubs error:', e)
  }
}

const renderClubCard = (club) => {
  const user = getUser()
  const isMember = club.members?.includes(user?.id)
  const sanitize = (str) => 
    String(str || '').replace(/</g,'&lt;').replace(/>/g,'&gt;')

  return '<div class="club-card" onclick="location.href=\'club-detail.html?id=' + 
    club.clubId + '\'">' +
    '<div class="club-banner" style="background:var(--bg-surface);height:120px;' +
    (club.banner ? 'background-image:url(' + sanitize(club.banner) + ');' +
    'background-size:cover;background-position:center;' : '') + '"></div>' +
    '<div class="club-card-body" style="padding:var(--space-md);">' +
      '<div style="display:flex;justify-content:space-between;' +
      'align-items:flex-start;margin-bottom:var(--space-xs);">' +
        '<h3 style="font-size:var(--text-md);font-weight:var(--font-semibold);">' + 
          sanitize(club.name) + '</h3>' +
        '<span class="badge badge-' + club.privacy + '">' + 
          club.privacy + '</span>' +
      '</div>' +
      '<p style="font-size:var(--text-sm);color:var(--text-secondary);' +
      'margin-bottom:var(--space-sm);' +
      'display:-webkit-box;-webkit-line-clamp:2;' +
      '-webkit-box-orient:vertical;overflow:hidden;">' +
        sanitize(club.description) + '</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:var(--space-sm);">' +
        (club.tags || []).map(t => 
          '<span class="genre-tag">' + sanitize(t) + '</span>'
        ).join('') +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;">' +
        '<span style="font-size:var(--text-xs);color:var(--text-muted);">' +
          '👥 ' + (club.members?.length || 0) + ' members</span>' +
        '<button onclick="event.stopPropagation();' + 
          (isMember ? 'leaveClub' : 'joinClub') + '(\'' + club.clubId + '\')" ' +
          'style="padding:4px 12px;border-radius:var(--radius-full);border:1px solid ' +
          (isMember ? 'var(--border-subtle)' : 'var(--accent-primary)') + ';' +
          'background:' + (isMember ? 'transparent' : 'var(--accent-primary)') + ';' +
          'color:' + (isMember ? 'var(--text-secondary)' : '#fff') + ';' +
          'font-size:var(--text-xs);cursor:pointer;">' +
          (isMember ? 'Leave' : 'Join') + '</button>' +
      '</div>' +
    '</div>' +
  '</div>'
}

const filterClubs = (query) => {
  try {
    const clubs = JSON.parse(localStorage.getItem('at_clubs') || '[]')
    const grid = document.getElementById('clubs-grid')
    if (!grid) return
    
    if (!query) {
      loadClubs()
      return
    }
    
    const filtered = clubs.filter(c => 
      c.name.toLowerCase().includes(query) || 
      (c.tags || []).some(t => t.toLowerCase().includes(query))
    )
    
    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;">' + renderEmptyState('👥', 'No Clubs Found', 'Be the first to create one!', '', '') + '</div>'
      return
    }
    
    grid.innerHTML = filtered.map(club => renderClubCard(club)).join('')
  } catch(e) {
    console.error('filterClubs error:', e)
  }
}

const createClub = () => {
  const name = document.getElementById('club-name')?.value?.trim()
  const desc = document.getElementById('club-desc')?.value?.trim()
  const banner = document.getElementById('club-banner')?.value?.trim() || ''
  const privacy = document.querySelector('input[name="club-privacy"]:checked')
    ?.value || 'public'
  const tagsInput = document.getElementById('club-tags')?.value?.trim() || ''
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : []

  // Validation
  if (!name || name.length < 3) {
    showToast('Club name must be at least 3 characters', 'error')
    return
  }
  if (!desc) {
    showToast('Description is required', 'error')
    return
  }

  const user = getUser()
  if (!user) {
    showToast('You must be logged in', 'error')
    return
  }

  const club = {
    clubId: crypto.randomUUID(),
    name,
    description: desc,
    banner,
    tags,
    privacy,
    members: [user.id],
    moderators: [user.id],
    threads: [],
    polls: [],
    createdBy: user.id,
    createdAt: Date.now()
  }

  // Save to localStorage
  try {
    const clubs = JSON.parse(localStorage.getItem('at_clubs') || '[]')
    clubs.push(club)
    localStorage.setItem('at_clubs', JSON.stringify(clubs))
  } catch(e) {
    showToast('Failed to save club', 'error')
    return
  }

  showToast('Club created successfully!', 'success')
  if (typeof closeModal === 'function') closeModal()
  loadClubs()
}

window.createClub = createClub;

window.joinClub = (clubId) => {
  const user = getUser();
  if (!user) { showToast('Please login first', 'warning'); return; }
  
  const clubs = getClubs();
  const c = clubs.find(cl => cl.clubId === clubId);
  if (!c) return;
  
  if (c.members.includes(user.id)) {
    showToast('Already a member', 'info');
    return;
  }
  c.members.push(user.id);
  saveClubs(clubs);
  showToast('Joined club!', 'success');
  loadClubDetail(clubId);
};

window.leaveClub = (clubId) => {
  const user = getUser();
  if (!user) return;
  
  const clubs = getClubs();
  const c = clubs.find(cl => cl.clubId === clubId);
  if (!c) return;
  
  c.members = c.members.filter(id => id !== user.id);
  saveClubs(clubs);
  showToast('Left club', 'info');
  loadClubDetail(clubId);
};

const loadClubDetail = (clubId) => {
  const c = getClubById(clubId);
  if (!c) {
    document.querySelector('.page-wrapper').innerHTML = renderErrorState('Club not found', () => location.href='clubs.html');
    return;
  }
  
  const user = getUser();
  const isMember = user && c.members.includes(user.id);
  const isMod = user && c.moderators.includes(user.id);
  
  document.title = `${sanitize(c.name)} — AniTrack Clubs`;
  
  const banner = document.getElementById('club-detail-banner');
  if (banner) banner.src = sanitize(c.banner || '/placeholder.png');
  
  const name = document.getElementById('club-detail-name');
  if (name) name.textContent = sanitize(c.name);
  
  const memCount = document.getElementById('club-detail-members-count');
  if (memCount) memCount.textContent = `${c.members.length} Members`;
  
  const joinBtn = document.getElementById('club-join-btn');
  if (joinBtn) {
    if (isMember) {
      joinBtn.textContent = 'Leave Club';
      joinBtn.classList.replace('btn-primary', 'btn-secondary');
      joinBtn.onclick = () => leaveClub(clubId);
    } else {
      joinBtn.textContent = 'Join Club';
      joinBtn.classList.replace('btn-secondary', 'btn-primary');
      joinBtn.onclick = () => joinClub(clubId);
    }
  }
  
  // Privacy check for threads
  const contentWrap = document.getElementById('club-content-wrap');
  if (!contentWrap) return;
  
  if (c.privacy === 'private' && !isMember && !isAdmin()) {
    contentWrap.innerHTML = renderEmptyState('🔒', 'Private Club', 'You must join this club to view its threads and polls.', '', '');
    return;
  }
  
  renderThreads(c.threads || [], clubId, isMod);
  if (typeof renderPollsList === 'function') renderPollsList(c.polls || [], clubId);
};

const renderThreads = (threads, clubId, isMod) => {
  const wrap = document.getElementById('club-threads-list');
  if (!wrap) return;
  
  if (threads.length === 0) {
    wrap.innerHTML = '<p style="color:var(--text-muted); padding:var(--space-md);">No threads yet. Start the conversation!</p>';
    return;
  }
  
  const sorted = [...threads].sort((a,b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.createdAt - a.createdAt;
  });
  
  let html = '';
  sorted.forEach(t => {
    const pinBtn = isMod ? `<button onclick="window.pinThread('${clubId}', '${t.threadId}')" style="background:none; border:none; color:var(--text-muted); cursor:pointer;" title="Toggle Pin">📌</button>` : '';
    const delBtn = (isMod || (getUser() && t.author === getUser().username)) ? `<button onclick="window.deleteThread('${clubId}', '${t.threadId}')" style="background:none; border:none; color:var(--error); cursor:pointer;" title="Delete Thread">🗑️</button>` : '';
    
    html += `
      <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius); padding:var(--space-md); margin-bottom:var(--space-sm);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:var(--space-sm);">
          <h4 style="font-size:var(--text-md); font-weight:var(--font-bold); color:var(--text-primary);">
            ${t.pinned ? '📌 ' : ''}${sanitize(t.title)}
          </h4>
          <div style="display:flex; gap:var(--space-xs);">
            ${pinBtn} ${delBtn}
          </div>
        </div>
        <div style="color:var(--text-secondary); font-size:var(--text-sm); margin-bottom:var(--space-md);">
          ${wrapSpoiler(sanitize(t.body), t.spoiler)}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:var(--text-xs); color:var(--text-muted);">
          <span>By <b>${sanitize(t.author)}</b> · ${new Date(t.createdAt).toLocaleDateString()}</span>
          <span>${t.replies ? t.replies.length : 0} Replies</span>
        </div>
      </div>
    `;
  });
  wrap.innerHTML = html;
};

window.createThread = (clubId, title, body, spoiler) => {
  if (!title.trim() || !body.trim()) { showToast('Title and body required', 'warning'); return; }
  const user = getUser();
  if (!user) { showToast('Login required', 'warning'); return; }
  
  const clubs = getClubs();
  const c = clubs.find(cl => cl.clubId === clubId);
  if (!c) return;
  
  c.threads.push({
    threadId: crypto.randomUUID(),
    title: title.trim(),
    body: body.trim(),
    author: user.username,
    spoiler: !!spoiler,
    pinned: false,
    replies: [],
    createdAt: Date.now()
  });
  
  saveClubs(clubs);
  showToast('Thread created', 'success');
  loadClubDetail(clubId);
};

window.deleteThread = (clubId, threadId) => {
  const clubs = getClubs();
  const c = clubs.find(cl => cl.clubId === clubId);
  if (!c) return;
  
  c.threads = c.threads.filter(t => t.threadId !== threadId);
  saveClubs(clubs);
  showToast('Thread deleted', 'info');
  loadClubDetail(clubId);
};

window.pinThread = (clubId, threadId) => {
  const clubs = getClubs();
  const c = clubs.find(cl => cl.clubId === clubId);
  if (!c) return;
  
  const t = c.threads.find(th => th.threadId === threadId);
  if (t) {
    t.pinned = !t.pinned;
    saveClubs(clubs);
    loadClubDetail(clubId);
  }
};

window.reportContent = (contentId, type, reason) => {
  const user = getUser();
  if (!user) { showToast('Login required to report', 'warning'); return; }
  
  addReport({
    contentId, type, reason, reportedBy: user.username, createdAt: Date.now()
  });
  showToast('Report submitted for moderation', 'success');
  if (typeof closeModal === 'function') closeModal();
};

window.Clubs = { init: initClubs, initClubDetail };
