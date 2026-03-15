/* ============================================
   AniTrack — Reminders & Notifications Module
   ============================================ */

window.setReminder = (animeId, title, datetimeStr, message) => {
  const dt = new Date(datetimeStr).getTime();
  if (isNaN(dt) || dt <= Date.now()) {
    showToast('Please select a future date and time.', 'error');
    return;
  }
  
  const reminders = getReminders();
  reminders.push({
    id: crypto.randomUUID(),
    animeId,
    title,
    datetime: dt,
    message: message.trim() || `Reminder for ${title}`
  });
  
  localStorage.setItem('at_reminders', JSON.stringify(reminders));
  showToast('Reminder set successfully!', 'success');
  
  // Ask for notification permission if not asked
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
};

window.getReminders = () => {
  try {
    return JSON.parse(localStorage.getItem('at_reminders')) || [];
  } catch (err) {
    return [];
  }
};

window.deleteReminder = (id) => {
  const reminders = getReminders();
  const filtered = reminders.filter(r => r.id !== id);
  localStorage.setItem('at_reminders', JSON.stringify(filtered));
};

window.loadReminders = () => {
  // Check every minute
  setInterval(() => {
    const reminders = getReminders();
    const now = Date.now();
    let triggered = false;
    
    // Sort so we trigger the oldest ones first
    const due = reminders.filter(r => r.datetime <= now);
    const future = reminders.filter(r => r.datetime > now);
    
    if (due.length > 0) {
      due.forEach(r => {
        showReminderModal(r);
        triggerSystemNotification(r);
      });
      localStorage.setItem('at_reminders', JSON.stringify(future));
      triggered = true;
    }
    
  }, 60000);
  
  // Also check immediately on load
  setTimeout(() => {
    const reminders = getReminders();
    const now = Date.now();
    const due = reminders.filter(r => r.datetime <= now);
    const future = reminders.filter(r => r.datetime > now);
    
    if (due.length > 0) {
      due.forEach(r => {
        showReminderModal(r);
        triggerSystemNotification(r);
      });
      localStorage.setItem('at_reminders', JSON.stringify(future));
    }
  }, 2000);
};

const showReminderModal = (r) => {
  const body = `
    <div style="text-align:center; padding:var(--space-md);">
      <div style="font-size:40px; margin-bottom:var(--space-sm);">⏰</div>
      <h3 style="font-weight:bold; margin-bottom:var(--space-md);">${sanitize(r.title)}</h3>
      <p style="color:var(--text-secondary);">${sanitize(r.message)}</p>
    </div>
  `;
  const footer = `<button class="btn btn-primary" onclick="closeModal()">Got it</button>`;
  
  if (typeof openModal === 'function') {
    openModal('Reminder', body, footer);
  }
};

const triggerSystemNotification = (r) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('AniTrack Reminder: ' + sanitize(r.title), {
      body: sanitize(r.message),
      icon: '/icon-192.png'
    });
  }
};

window.Reminders = { loadReminders };
