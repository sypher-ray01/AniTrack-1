/* ============================================
   AniTrack — PWA Support
   Service Worker registration · Install prompt
   ============================================ */

const PWA = (() => {
  let deferredPrompt = null;

  /**
   * Register the service worker.
   */
  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const reg = await navigator.serviceWorker.register('/sw.js');

      // Listen for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            UI.showToast('A new version is available! Refresh to update.', 'info', 8000);
          }
        });
      });

      // Service worker registered
    } catch (err) {
      console.warn('[PWA] Service worker registration failed:', err);
    }
  };

  /**
   * Capture the beforeinstallprompt event.
   */
  const handleInstallPrompt = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      hideInstallButton();
      UI.showToast('AniTrack installed successfully!', 'success');
    });
  };

  /**
   * Show install button in UI.
   */
  const showInstallButton = () => {
    let btn = document.getElementById('pwa-install-btn');
    if (btn) {
      btn.classList.remove('hidden');
      return;
    }

    btn = document.createElement('button');
    btn.id = 'pwa-install-btn';
    btn.className = 'btn btn-primary btn-sm';
    btn.textContent = '📲 Install App';
    btn.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 24px;
      z-index: 999;
    `;
    btn.addEventListener('click', promptInstall);
    document.body.appendChild(btn);
  };

  const hideInstallButton = () => {
    const btn = document.getElementById('pwa-install-btn');
    btn?.classList.add('hidden');
  };

  /**
   * Trigger the install prompt.
   */
  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      UI.showToast('Installing AniTrack…', 'info');
    }
    deferredPrompt = null;
  };

  /**
   * Initialise PWA features.
   */
  const init = () => {
    registerServiceWorker();
    handleInstallPrompt();
  };

  return { init, promptInstall };
})();

window.PWA = PWA;
