# 🚀 ANTIGRAVITY MISSION PROMPT — AniTrack v2.0
## Paste this as your first mission in Antigravity Agent Manager

---

## MISSION STATEMENT

Build **AniTrack** — a full-featured, production-grade Anime & TV Series Tracker web platform. This is a portfolio-quality project, not a prototype. It must look and feel like a real product that could be shipped to users.

**Stack:** HTML5 + CSS3 + Vanilla JavaScript (ES6+) only. No frameworks. Jikan API v4 for data. Chart.js via CDN for analytics. localStorage for all persistence.

**Reference:** MyAnimeList (MAL) — copy the data model and feature set. Do NOT copy the UI — build something that looks significantly better.

---

## AGENT RULES

1. Build one phase at a time. Complete a phase fully before starting the next.
2. After each file is written, verify it has no syntax errors.
3. Never install npm packages in the project. CDN only.
4. Never use frameworks, never use `var`, never use inline styles.
5. After completing each phase, list all files created and run the browser verification checklist for that phase.
6. When uncertain about a Jikan API response shape — log the raw response first, then build the parser.
7. All colors via CSS variables. All fonts via Google Fonts CDN. All charts via Chart.js CDN.
8. Test at 375px, 768px, and 1440px viewport widths after building each page.

---

## COMPLETE PAGES (13 total)

| Page | File | Purpose |
|---|---|---|
| Home | index.html | Hero banner, top airing row, top rated row, announcement |
| My Watchlist | list.html | CORE — 6 status tabs, episode counter, table view |
| Search | search.html | Search + genre/year/language/status filter sidebar |
| Show Detail | detail.html | Full show info, episodes, trailer, reviews, streaming links |
| Character | character.html | Character profile + voice actor info |
| Seasonal | seasonal.html | Weekly airing calendar grid |
| Clubs | clubs.html | Club directory + create club form |
| Club Detail | club-detail.html | Threads, polls, members, pinned posts |
| Analytics | analytics.html | Personal stats + Chart.js charts |
| Admin Panel | admin.html | Users, reports, announcements |
| Help | help.html | FAQ accordions + shortcuts reference |
| Login/Register | login.html | Fake auth via localStorage + Web Crypto API |
| Profile | profile.html | User settings, stats, avatar |

---

## DESIGN SYSTEM

### Color Tokens (define ALL in css/variables.css — no other file should have raw color values)
```
Dark theme (default):
--bg-primary: #0D0D0D        --bg-card: #1A1A2E
--bg-surface: #16213E        --bg-hover: #22223A
--accent-primary: #E8004D    --accent-hover: #FF1A63
--accent-gold: #C9A84C       --text-primary: #FFFFFF
--text-secondary: #AAAAAA    --text-muted: #666680
--status-watching: #00B4D8   --status-complete: #06D6A0
--status-hold: #FFB703       --status-dropped: #EF476F
--status-plan: #8338EC       --border-subtle: #2A2A3E

Light theme (body[data-theme="light"] overrides):
--bg-primary: #F0F2F8        --bg-card: #FFFFFF
--bg-surface: #E8EAF2        --text-primary: #1A1A2E
--text-secondary: #44446A    --border-subtle: #D5D8EE
```

### Typography
- Font: Inter (Google Fonts) — weights 300, 400, 500, 600, 700
- Scale: 11 / 13 / 14 / 16 / 20 / 24 / 32 / 40px

### Layout
- Max container width: 1400px, centred with auto margin
- Navbar: fixed top, 60px height, z-index 1000
- Cards: consistent 2:3 aspect ratio cover image, object-fit: cover
- Grid: CSS grid with auto-fill minmax(180px, 1fr) for card grids

---

## ALL FEATURES TO BUILD (22 total)

### Core Brief Features (14)
1. **Watchlist with 6 status tabs** — All / Watching / Completed / On Hold / Dropped / Plan to Watch
   - Table: # | Cover | Title | Score | Progress | Episodes | Type | Status | Actions
   - Episode counter (+/- buttons), progress bar per row
   - Auto-complete when watchedEp === totalEp
   - Drag-and-drop reorder (HTML5 Drag API)

2. **Episode Progress Tracking** — per-show counter, last watched timestamp, visual progress bar

3. **Custom Clubs & Discussion Boards** — create clubs, threads, threaded replies, club admin controls

4. **Spoiler Protection** — `filter: blur(6px)` on marked content, click to reveal

5. **Polls & Ratings** — club polls with animated result bars, one vote per user

6. **User Reviews & Comments** — star rating + textarea on detail page, helpful/not helpful, comment threads

7. **Episode & Season Reminders** — datetime-local input + Web Notifications API

8. **Streaming Integration** — platform badges from Jikan external_links (Crunchyroll, Netflix, etc.)

9. **Watchlist Sharing** — btoa() URL encoding, read-only shared view, CSV export

10. **Dark & Light Mode** — toggle in navbar, 200ms CSS transition, persisted in localStorage

11. **Tags & Filters** — genre checkboxes, year dropdown, language (Sub/Dub), status — all client-side

12. **Analytics Dashboard** — genre doughnut, monthly activity bar, status pie, stat cards, top 5 rated

13. **Admin Panel** — user management table, reported content queue, global announcement banner

14. **Web Optimization + PWA** — lazy images, debounced search (400ms), skeleton loaders, manifest.json, service worker, offline support

### Portfolio Extras (8)
15. **Fake Auth System** — login/register with Web Crypto API SHA-256 hashing, session tokens, protected routes

16. **Seasonal Calendar** — visual weekly grid showing what's airing each day/time slot

17. **Character Pages** — character profiles, voice actors, anime appearances via Jikan /characters

18. **AI-Style Recommendations** — genre-affinity scoring algorithm from personal watchlist data

19. **Keyboard Shortcuts** — / for search, W for watchlist, D for dark mode, ESC to close, Ctrl+K command palette

20. **Confetti on Completion** — canvas confetti fires when a show is marked Completed

21. **Watchlist Stats Card** — shareable styled summary card (Canvas API or styled div)

22. **Multi-user Support** — each registered user has their own isolated watchlist (via userId prefix in localStorage keys)

---

## JIKAN API ENDPOINTS

Base URL: `https://api.jikan.moe/v4`
Rate limit: 3 requests/second, 60/minute
No API key required.

```
GET /top/anime                           → Top anime (home)
GET /top/anime?filter=airing             → Top airing (home)
GET /seasons/now                         → Currently airing season
GET /seasons/{year}/{season}             → Specific season
GET /seasons                             → All seasons list
GET /anime?q={query}&limit=20            → Search
GET /anime?genres={id}&order_by=score    → By genre
GET /anime/{id}/full                     → Full details + links
GET /anime/{id}/episodes                 → Episode list
GET /anime/{id}/videos                   → Trailers + promos
GET /anime/{id}/streaming                → Streaming platform links
GET /anime/{id}/recommendations          → Similar shows
GET /anime/{id}/characters               → Cast list
GET /anime/{id}/staff                    → Staff list
GET /anime/{id}/news                     → News articles
GET /characters/{id}/full                → Character profile
GET /characters/{id}/anime               → Character's anime list
GET /genres/anime                        → All genre list
```

Image field: `data.images.jpg.large_image_url`
Always use `?.` optional chaining when accessing nested API data.

---

## LOCALSTORAGE SCHEMA

All keys prefixed with `at_` to avoid conflicts.

```javascript
at_user          → { id, username, email, passwordHash, avatar, bio, darkMode, isAdmin, joinedAt, stats }
at_session       → { userId, token, expiresAt }
at_watchlist     → Array of { animeId, title, titleJp, cover, type, totalEp, watchedEp, status, score, genres, notes, startDate, finishDate, addedAt, updatedAt }
at_clubs         → Array of { clubId, name, description, banner, tags, privacy, members, moderators, threads[], polls[], createdBy, createdAt }
at_reviews       → Array of { reviewId, animeId, author, score, body, spoiler, helpful[], notHelpful[], comments[], createdAt }
at_reminders     → Array of { reminderId, animeId, title, episodeNo, fireAt, fired }
at_theme         → "dark" | "light"
at_announcement  → { text, active, createdAt }
at_reported      → Array of { contentId, type, reason, reportedBy, createdAt }
```

---

## BUILD SEQUENCE

**🟥 Phase 1 — Foundation (build this first)**
Files: css/variables.css, css/reset.css, css/layout.css, css/navbar.css, css/modal.css, css/toast.css, css/skeleton.css, css/badges.css, css/themes.css, js/storage.js, js/auth.js, js/api.js, js/ui.js, js/theme.js, js/navbar.js, js/shortcuts.js, js/pwa.js, js/app.js

Verification:
- [ ] No CSS syntax errors
- [ ] No JS syntax errors
- [ ] Dark/Light mode toggles correctly
- [ ] localStorage helpers read/write correctly (test in console)
- [ ] Navbar renders on all pages

**🟧 Phase 2 — Auth + Core Pages**
Files: login.html, css/auth.css, index.html, css/hero.css, css/cards.css, list.html, css/watchlist.css, js/watchlist.js, js/progress.js

Verification:
- [ ] Register creates user in localStorage
- [ ] Login verifies password hash
- [ ] Protected routes redirect to login
- [ ] Home page loads real anime from Jikan
- [ ] Skeleton loaders appear while loading
- [ ] Watchlist: add → refresh → data persists
- [ ] Episode counter increments and updates progress bar

**🟨 Phase 3 — Discovery**
Files: search.html, js/search.js, detail.html, css/detail.css, js/detail.js, character.html, js/character.js

Verification:
- [ ] Search returns live Jikan results with debounce
- [ ] Filters work client-side (genre, year, status)
- [ ] Active filter chips display and are removable
- [ ] Detail page loads for anime ID 1 (Cowboy Bebop) via ?id=1
- [ ] Streaming links render as platform badges
- [ ] Character page loads from ?id= param

**🟩 Phase 4 — Seasonal**
Files: seasonal.html, css/seasonal.css, js/seasonal.js

Verification:
- [ ] Weekly grid shows current season
- [ ] Each day column has airing shows
- [ ] Can navigate to previous/next seasons

**🟦 Phase 5 — Community**
Files: clubs.html, club-detail.html, css/clubs.css, js/clubs.js, js/polls.js, js/reviews.js

Verification:
- [ ] Create club → appears in club directory
- [ ] Create thread → appears in club detail
- [ ] Spoiler content is blurred, click reveals
- [ ] Poll: vote → result bars update with %
- [ ] Review + rating saves to localStorage
- [ ] Helpful/Not Helpful counters work
- [ ] Confetti fires when show marked Completed

**🟪 Phase 6 — Dashboard + Admin + Profile**
Files: analytics.html, css/analytics.css, js/analytics.js, admin.html, css/admin.css, js/admin.js, profile.html, css/profile.css, js/recommendations.js

Verification:
- [ ] Stat cards show correct totals from watchlist
- [ ] All 3 Chart.js charts render
- [ ] Admin panel only accessible when isAdmin === true
- [ ] Announcement banner shows on home when active
- [ ] Recommendations show genre-matched anime

**⬛ Phase 7 — Polish + Deploy**
Files: js/reminders.js, js/share.js, help.html, manifest.json, sw.js, robots.txt, sitemap.xml, netlify.toml, README.md, CHANGELOG.md

Verification:
- [ ] Set reminder → notification fires at correct time
- [ ] Share URL encodes/decodes watchlist correctly
- [ ] CSV export downloads correctly
- [ ] Keyboard shortcuts all work
- [ ] PWA installable on mobile (test on Netlify HTTPS)
- [ ] Service worker caches static assets
- [ ] App loads offline from cache
- [ ] Lighthouse Performance ≥ 85
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Lighthouse PWA ≥ 90
- [ ] Zero console errors

---

## BROWSER AGENT VERIFICATION PROMPTS

Use these exact prompts with Antigravity's Browser Agent after each phase:

**Phase 2:** "Go to index.html. Verify anime cards load with real images and titles from Jikan. Then go to login.html, register as 'TestUser', then go to list.html and add One Piece (ID: 21) to the watchlist with status Watching. Refresh the page and confirm the entry persists."

**Phase 3:** "Go to search.html. Type 'Naruto' and wait for debounce. Confirm results appear. Click the Genres filter and select Shonen — confirm results filter. Click on any result and confirm the detail page loads with full information."

**Phase 4:** "Go to seasonal.html. Confirm the current season grid loads with anime grouped by day. Verify clicking any show navigates to its detail page."

**Phase 5:** "Go to clubs.html. Create a club named 'Test Club'. Go to its detail page. Create a thread with spoiler checked. Confirm the thread body is blurred. Click to reveal it. Go back to list.html, mark a show as Completed — verify confetti animation fires."

**Phase 6:** "Go to analytics.html. Verify all three charts render. Verify stat cards show non-zero values. Open browser console and run: const u = JSON.parse(localStorage.getItem('at_user')); u.isAdmin = true; localStorage.setItem('at_user', JSON.stringify(u)); location.reload(); — then navigate to admin.html and confirm it loads."

**Phase 7:** "Run Lighthouse audit on index.html. Report Performance, Accessibility, SEO, and PWA scores. List any failing audits."

---

## CONSTRAINTS SUMMARY

- ❌ No React, Vue, Angular, jQuery, Alpine, HTMX
- ❌ No npm packages in final build
- ❌ No backend, server, or database
- ❌ No `var` — use `const` / `let` only
- ❌ No inline styles — use CSS classes only
- ❌ No hardcoded color values in CSS
- ❌ No `alert()` — use toast system
- ❌ No unguarded API calls — always handle null returns
- ✅ Chart.js via CDN only
- ✅ Inter font via Google Fonts CDN
- ✅ Jikan API only for anime data
- ✅ localStorage for all persistence
- ✅ Deployed to Netlify or GitHub Pages (static)

---

## DEVELOPER INFO

- Name: Himanshu Jangid
- Email: himanshujangid201@gmail.com
- Capstone Batch: Launched Global Web Development, October 2025
- Submission contact: support@launched.org.in
- Jikan API Docs: https://docs.api.jikan.moe/
