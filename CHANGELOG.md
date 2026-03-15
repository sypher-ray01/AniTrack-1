# Changelog

All notable changes to AniTrack are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Planned
- Real-time watching count simulation (SSE polling)
- Studio profile pages
- Voice actor pages
- MAL XML import support

---

## [1.0.0] — 2026-03-XX

### Added
- Full watchlist manager with 6 status categories
- Episode progress tracking with visual progress bars
- Search page with genre, year, language, and status filters
- Show detail pages with episode list, trailers, and streaming links
- Character profile pages via Jikan /characters endpoint
- Seasonal airing calendar with weekly grid view
- Custom Clubs with discussion threads and threaded replies
- Polls system with animated voting result bars
- Reviews and comments with helpful/not helpful counters
- Spoiler protection with blur reveal on click
- Episode reminders via Web Notifications API
- Watchlist sharing via btoa URL encoding + CSV export
- Genre-affinity recommendation engine
- Personal analytics dashboard (genre doughnut, activity bar, status pie charts)
- Admin panel with user management, report queue, and announcements
- User profile page with stats and settings
- Multi-user authentication with SHA-256 password hashing
- Dark and Light mode with smooth CSS variable transitions
- PWA support — installable, offline-capable via service worker
- Keyboard shortcuts for power navigation
- Confetti animation on show completion
- Drag-and-drop watchlist reordering
- Skeleton loaders on all async content sections
- Toast notification system (success, error, info, warning)
- Mobile-first responsive layout (375px → 1440px)
- netlify.toml, robots.txt, sitemap.xml configured

### Technical
- 13 HTML pages
- 17 CSS modules
- 22 JavaScript modules
- Zero npm runtime dependencies
- Jikan API v4 integration with rate limiting and retry logic
- localStorage schema with at_ prefix (6 data stores)
- Web Crypto API for secure password hashing (requires HTTPS)

---

## [0.1.0] — 2026-03-01

### Added
- Initial project scaffold
- CSS design token system (variables.css)
- Storage and API modules
- Basic navbar and theme toggle
