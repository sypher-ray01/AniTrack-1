/* ============================================
   AniTrack — Polls Module
   ============================================ */

window.createPoll = (clubId, question, optionsText, endsInDays = 7) => {
  if (!question.trim()) { showToast('Question required', 'warning'); return; }
  const optLines = optionsText.split('\\n').map(o => o.trim()).filter(Boolean);
  if (optLines.length < 2) { showToast('Minimum 2 options required', 'warning'); return; }
  if (optLines.length > 6) { showToast('Maximum 6 options allowed', 'warning'); return; }
  
  const user = getUser();
  if (!user) { showToast('Login required', 'warning'); return; }
  
  const clubs = getClubs();
  const c = clubs.find(cl => cl.clubId === clubId);
  if (!c) return;
  
  const endsAt = Date.now() + (parseInt(endsInDays, 10) * 24 * 60 * 60 * 1000);
  
  c.polls = c.polls || [];
  c.polls.push({
    pollId: crypto.randomUUID(),
    question: question.trim(),
    options: optLines,
    votes: {},
    endsAt,
    createdBy: user.id
  });
  
  saveClubs(clubs);
  showToast('Poll created', 'success');
  if (typeof loadClubDetail === 'function') loadClubDetail(clubId);
};

window.votePoll = (clubId, pollId, optionIndex) => {
  const user = getUser();
  if (!user) { showToast('Login required to vote', 'warning'); return; }
  
  const clubs = getClubs();
  const c = clubs.find(cl => cl.clubId === clubId);
  if (!c) return;
  
  const p = c.polls?.find(pl => pl.pollId === pollId);
  if (!p) return;
  
  if (isPollExpired(p)) { showToast('Poll has expired', 'error'); return; }
  if (p.votes[user.id] !== undefined) { showToast('Already voted', 'warning'); return; }
  
  p.votes[user.id] = optionIndex;
  saveClubs(clubs);
  showToast('Vote recorded', 'success');
  if (typeof loadClubDetail === 'function') loadClubDetail(clubId);
};

window.isPollExpired = (poll) => {
  return Date.now() > poll.endsAt;
};

window.renderPollsList = (polls, clubId) => {
  const wrap = document.getElementById('club-polls-list');
  if (!wrap) return;
  
  if (!polls || polls.length === 0) {
    wrap.innerHTML = '<p style="color:var(--text-muted); font-size:var(--text-sm);">No active polls.</p>';
    return;
  }
  
  const user = getUser();
  const now = Date.now();
  
  let html = '';
  polls.forEach(p => {
    const isExpired = isPollExpired(p);
    const hasVoted = user && p.votes[user.id] !== undefined;
    const totalVotes = Object.keys(p.votes).length;
    
    html += `
      <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius); padding:var(--space-md); margin-bottom:var(--space-md);">
        <h4 style="font-weight:var(--font-bold); margin-bottom:var(--space-sm);">${sanitize(p.question)}</h4>
        <div style="font-size:var(--text-xs); color:var(--text-muted); margin-bottom:var(--space-md); display:flex; justify-content:space-between;">
          <span>${totalVotes} votes</span>
          <span>${isExpired ? 'Ended' : ('Ends in ' + Math.ceil((p.endsAt - now)/(1000*60*60*24)) + 'd')}</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:var(--space-xs);">
    `;
    
    p.options.forEach((opt, idx) => {
      const votesForOpt = Object.values(p.votes).filter(v => parseInt(v) === idx).length;
      const pct = totalVotes > 0 ? Math.round((votesForOpt / totalVotes) * 100) : 0;
      const isWinner = isExpired && pct > 0 && pct === Math.max(...p.options.map((_, i) => totalVotes > 0 ? Math.round((Object.values(p.votes).filter(v => parseInt(v) === i).length / totalVotes) * 100) : 0));
      
      if (hasVoted || isExpired) {
        // Show results
        html += `
          <div style="position:relative; background:var(--bg-card); border-radius:var(--radius-sm); border:1px solid ${isWinner ? 'var(--accent-primary)' : 'var(--border-subtle)'}; overflow:hidden;">
            <div style="position:absolute; top:0; left:0; bottom:0; width:${pct}%; background:${isWinner ? 'var(--accent-glow)' : 'var(--bg-hover)'}; transition:width 1s ease;"></div>
            <div style="position:relative; display:flex; justify-content:space-between; padding:var(--space-xs) var(--space-sm); font-size:var(--text-sm); z-index:1;">
              <span>${sanitize(opt)} ${user && p.votes[user.id] == idx ? '✓' : ''}</span>
              <span style="font-weight:var(--font-bold);">${pct}%</span>
            </div>
          </div>
        `;
      } else {
        // Show voting buttons
        html += `
          <button onclick="window.votePoll('${clubId}', '${p.pollId}', ${idx})" 
            style="width:100%; text-align:left; padding:var(--space-xs) var(--space-sm); background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-sm); font-size:var(--text-sm); cursor:pointer; color:var(--text-primary); transition:border-color var(--transition);">
            ${sanitize(opt)}
          </button>
        `;
      }
    });
    
    html += '</div></div>';
  });
  
  wrap.innerHTML = html;
};
