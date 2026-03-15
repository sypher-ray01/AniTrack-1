/* ============================================
   AniTrack — Reviews Module
   ============================================ */

window.loadReviews = (animeId) => {
  const wrap = document.getElementById('reviews-list');
  if (!wrap) return;
  
  const reviews = getReviewsByAnime(animeId);
  renderReviews(reviews, animeId);
};

window.submitReview = (animeId, score, bodyText, spoilerCheck) => {
  const user = getUser();
  if (!user) { showToast('Login required to review', 'warning'); return; }
  
  const scoreVal = parseInt(score, 10);
  if (isNaN(scoreVal) || scoreVal < 1 || scoreVal > 10) { showToast('Invalid score', 'warning'); return; }
  
  const body = bodyText.trim();
  if (!body || body.length < 50) { showToast('Review must be at least 50 characters', 'warning'); return; }
  
  const reviews = getReviewsByAnime(animeId);
  if (reviews.find(r => r.author === user.username)) {
    showToast('You already reviewed this anime', 'warning');
    return;
  }
  
  // anime title passed implicitly in real usage, we pull from DOM hook if possible, or fallback
  const titleEl = document.getElementById('detail-title');
  const animeTitle = titleEl ? titleEl.textContent : 'Unknown Anime';
  
  const review = {
    reviewId: crypto.randomUUID(),
    animeId: parseInt(animeId, 10),
    animeTitle,
    author: user.username,
    score: scoreVal,
    body: body,
    spoiler: !!spoilerCheck,
    helpful: [],
    notHelpful: [],
    comments: [],
    createdAt: Date.now()
  };
  
  saveReview(review);
  showToast('Review published!', 'success');
  loadReviews(animeId);
};

window.markHelpful = (reviewId) => {
  const user = getUser();
  if (!user) { showToast('Login required', 'warning'); return; }
  
  const reviews = getReviews();
  const r = reviews.find(rv => rv.reviewId === reviewId);
  if (!r) return;
  
  if (r.helpful.includes(user.id)) {
    r.helpful = r.helpful.filter(id => id !== user.id);
  } else {
    r.helpful.push(user.id);
    r.notHelpful = r.notHelpful.filter(id => id !== user.id);
  }
  
  saveReviews(reviews);
  loadReviews(r.animeId);
};

window.markNotHelpful = (reviewId) => {
  const user = getUser();
  if (!user) { showToast('Login required', 'warning'); return; }
  
  const reviews = getReviews();
  const r = reviews.find(rv => rv.reviewId === reviewId);
  if (!r) return;
  
  if (r.notHelpful.includes(user.id)) {
    r.notHelpful = r.notHelpful.filter(id => id !== user.id);
  } else {
    r.notHelpful.push(user.id);
    r.helpful = r.helpful.filter(id => id !== user.id);
  }
  
  saveReviews(reviews);
  loadReviews(r.animeId);
};

window.addComment = (reviewId, bodyText) => {
  const user = getUser();
  if (!user) { showToast('Login required to comment', 'warning'); return; }
  
  const body = bodyText.trim();
  if (!body) return;
  
  const reviews = getReviews();
  const r = reviews.find(rv => rv.reviewId === reviewId);
  if (!r) return;
  
  r.comments = r.comments || [];
  r.comments.push({
    commentId: crypto.randomUUID(),
    author: user.username,
    body: body,
    createdAt: Date.now()
  });
  
  saveReviews(reviews);
  showToast('Comment added', 'success');
  loadReviews(r.animeId);
};

window.deleteReview = (reviewId) => {
  const user = getUser();
  if (!user) return;
  
  const reviews = getReviews();
  const r = reviews.find(rv => rv.reviewId === reviewId);
  if (!r) return;
  
  if (r.author !== user.username && !isAdmin()) {
    showToast('Unauthorized', 'error'); return;
  }
  
  const filtered = reviews.filter(rv => rv.reviewId !== reviewId);
  saveReviews(filtered);
  showToast('Review deleted', 'info');
  loadReviews(r.animeId);
};

window.renderReviews = (reviews, animeId) => {
  const wrap = document.getElementById('reviews-list');
  if (!wrap) return;
  
  if (reviews.length === 0) {
    wrap.innerHTML = renderEmptyState('✍️', 'No Reviews Yet', 'Be the first to share your thoughts!', '', '');
    return;
  }
  
  const user = getUser();
  const sorted = [...reviews].sort((a,b) => (b.helpful?.length || 0) - (a.helpful?.length || 0) || (b.createdAt - a.createdAt));
  
  let html = '';
  sorted.forEach(r => {
    const isOwnerOrAdmin = user && (r.author === user.username || isAdmin());
    const delBtn = isOwnerOrAdmin ? `<button onclick="window.deleteReview('${r.reviewId}')" style="background:none; border:none; color:var(--error); cursor:pointer;">Delete</button>` : '';
    const reportBtn = user ? `<button onclick="window.reportContent('${r.reviewId}', 'review', 'Inappropriate content')" style="background:none; border:none; color:var(--warning); cursor:pointer;">Flag</button>` : '';
    
    html += `
      <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:var(--space-lg); margin-bottom:var(--space-md);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:var(--space-sm); margin-bottom:var(--space-md);">
          <div>
            <span style="font-weight:var(--font-bold); color:var(--accent-primary); margin-right:8px;">${sanitize(r.author)}</span>
            <span style="color:var(--text-muted); font-size:var(--text-sm);">${new Date(r.createdAt).toLocaleDateString()}</span>
          </div>
          <div>${renderStars(Math.round(r.score/2))} <span style="font-weight:bold; margin-left:4px;">${r.score}</span></div>
        </div>
        
        <div style="color:var(--text-secondary); line-height:1.6; font-size:var(--text-md); margin-bottom:var(--space-md);">
          ${wrapSpoiler(sanitize(r.body).replace(/\\n/g, '<br>'), r.spoiler)}
        </div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:var(--space-md); border-top:1px dashed var(--border-subtle); font-size:var(--text-sm);">
          <div style="display:flex; gap:var(--space-sm);">
            <button onclick="window.markHelpful('${r.reviewId}')" style="background:none; border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:4px 8px; color:${user && r.helpful?.includes(user.id) ? 'var(--accent-primary)' : 'var(--text-primary)'}; cursor:pointer;">
              👍 ${(r.helpful || []).length} Helpful
            </button>
            <button onclick="window.markNotHelpful('${r.reviewId}')" style="background:none; border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:4px 8px; color:${user && r.notHelpful?.includes(user.id) ? 'var(--error)' : 'var(--text-primary)'}; cursor:pointer;">
              👎 ${(r.notHelpful || []).length}
            </button>
          </div>
          <div style="display:flex; gap:var(--space-sm); font-size:var(--text-xs);">
            ${reportBtn}
            ${delBtn}
          </div>
        </div>
      </div>
    `;
  });
  
  wrap.innerHTML = html;
};
