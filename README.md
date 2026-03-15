# AniTrack 🎌

> Your personal anime & TV series tracker — built fast, looks clean, works offline.

![AniTrack Banner](https://via.placeholder.com/1200x400/0D0D0D/E8004D?text=AniTrack)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://anitrack.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/USERNAME/anitrack)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa)](https://anitrack.netlify.app)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](./LICENSE)

---

## ✨ Features

### Core
- 📋 **Watchlist Manager** — Track anime with 6 status categories (Watching, Completed, On Hold, Dropped, Plan to Watch)
- 📊 **Episode Progress** — Per-show episode counter with visual progress bars
- 🔍 **Search & Discovery** — Live search with genre, year, language, and status filters
- 🎬 **Show Detail Pages** — Full info, trailers, episode list, streaming links, character cast
- 🌸 **Seasonal Calendar** — Weekly grid of currently airing anime
- 👥 **Custom Clubs** — Create communities, discussion threads, spoiler-protected posts
- 🗳️ **Polls & Voting** — Club polls with animated result bars
- ⭐ **Reviews & Ratings** — Write reviews with score ratings and helpful counters

### Advanced
- 🔔 **Episode Reminders** — Web Notifications API for episode alerts
- 📤 **Watchlist Sharing** — Share your list via encoded URL or CSV export
- 🤖 **Smart Recommendations** — Genre-affinity algorithm based on your watch history
- 📈 **Analytics Dashboard** — Genre distribution, monthly activity, personal stats via Chart.js
- 🎉 **Confetti on Completion** — Because finishing a series deserves a celebration
- ⌨️ **Keyboard Shortcuts** — Power user navigation ( `/` search, `W` watchlist, `D` dark mode)

### Platform
- 🌙 **Dark & Light Mode** — Full theme system with smooth transitions
- 📱 **PWA** — Installable on mobile, works offline with service worker caching
- 🔐 **Multi-user Auth** — Register/login with client-side SHA-256 hashing
- 🛡️ **Admin Panel** — Manage users, reported content, and global announcements

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic) |
| Styling | CSS3 (custom properties, flexbox, grid) |
| Logic | Vanilla JavaScript ES6+ |
| Anime Data | [Jikan API v4](https://api.jikan.moe/v4) (free, no key) |
| Charts | [Chart.js 4.x](https://www.chartjs.org/) |
| Auth | Web Crypto API (SHA-256) |
| Storage | localStorage |
| PWA | Service Worker + Web App Manifest |
| Deployment | Netlify / GitHub Pages |

**No frameworks. No build tools. No dependencies.**

---

## 🗂️ Project Structure

```
anitrack/
├── index.html          # Home page
├── list.html           # My Watchlist (core feature)
├── search.html         # Search + filters
├── detail.html         # Show detail page
├── character.html      # Character profiles
├── seasonal.html       # Seasonal calendar
├── clubs.html          # Community clubs
├── club-detail.html    # Club discussions
├── analytics.html      # Personal analytics
├── admin.html          # Admin panel
├── login.html          # Auth page
├── profile.html        # User profile
├── help.html           # Help + FAQ
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── css/                # Modular CSS (17 files)
└── js/                 # Modular JS (22 files)
```

---

## 🛠️ Local Development

No build step required — just open in a browser.

```bash
# Clone the repository
git clone https://github.com/USERNAME/anitrack.git
cd anitrack

# Serve locally (needed for service worker + SHA-256 crypto)
npx serve .
# or
python -m http.server 8000

# Open in browser
open http://localhost:3000
```

> ⚠️ **Note:** Web Notifications API and SHA-256 require a secure context (HTTPS or localhost). Do not open `index.html` directly as a `file://` URL.

---

## 📡 API Reference

AniTrack uses the [Jikan API v4](https://docs.api.jikan.moe/) — an unofficial MyAnimeList REST API.

- Base URL: `https://api.jikan.moe/v4`
- No API key required
- Rate limit: 3 requests/second, 60/minute
- All anime data, character info, seasonal data, and streaming links sourced from here

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `/` | Focus search |
| `W` | Go to Watchlist |
| `H` | Go to Home |
| `S` | Go to Search |
| `A` | Go to Analytics |
| `D` | Toggle Dark/Light mode |
| `ESC` | Close modal |
| `?` | Show shortcuts |
| `Ctrl + K` | Command palette |

---

## 🚢 Deployment

### Netlify (Recommended)
1. Push to GitHub
2. Connect repo at [netlify.com](https://netlify.com)
3. Build command: *(none)*
4. Publish directory: `/` (root)
5. Done — auto-deploys on every push

### GitHub Pages
1. Go to repo Settings → Pages
2. Source: Deploy from branch → `main` → `/root`
3. Live at `https://USERNAME.github.io/anitrack`

---

## 📊 Lighthouse Scores

| Category | Score |
|---|---|
| Performance | ≥ 85 |
| Accessibility | ≥ 90 |
| SEO | ≥ 90 |
| PWA | ≥ 90 |

---

## 📄 License

MIT License — see [LICENSE](./LICENSE)

---

## 🙏 Credits

- Anime data by [Jikan API](https://jikan.moe/) (unofficial MyAnimeList API)
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Chart.js](https://www.chartjs.org/)
- Font: [Inter](https://rsms.me/inter/) by Rasmus Andersson

---

## 👤 Developer

**Himanshu Jangid**
- Email: himanshujangid201@gmail.com
- Capstone project for Launched Global Web Development Program (Oct 2025 Batch)
