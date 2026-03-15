# CLAUDE.md — AniTrack
> Single source of truth for Claude Code. Read this before every session.
> Project: AniTrack — Anime & TV Series Tracker Platform
> Developer: Himanshu Jangid | himanshujangid201@gmail.com
> Submitted for: Launched Global Web Development Capstone, Oct 2025 Batch

---

## 🧠 PROJECT IDENTITY

AniTrack is a full-featured, multi-page Anime & TV Series Tracker web platform built with pure HTML5, CSS3, and Vanilla JavaScript. It uses the free Jikan API v4 for anime data, Chart.js for analytics, and localStorage for all user data persistence. It is designed to be a portfolio-grade, resume-worthy project — not just a capstone submission.

---

## 🚫 ABSOLUTE RULES — NEVER BREAK THESE

1. NO frameworks. No React, Vue, Angular, Svelte, Alpine, HTMX, jQuery. Pure HTML/CSS/JS only.
2. NO npm packages in the final build. CDN-only for Chart.js and fonts.
3. NO backend, NO server, NO database. All persistence via localStorage only.
4. NO `var`. Always use `const` or `let`.
5. NO inline styles. Always use CSS classes and custom properties.
6. NO hardcoded color values in CSS. Always use `var(--token-name)`.
7. NO `alert()`, `confirm()`, or `prompt()`. Use custom modal/toast system.
8. NO `console.log` left in production code. Use `console.error` for errors only.
9. NO `innerHTML` with unsanitized user input. Always sanitize before injecting.
10. NO files modified or deleted without explicit confirmation.
11. ALWAYS use `async/await` for API calls, never `.then().catch()` chains.
12. ALWAYS handle null/undefined from API responses with optional chaining (`?.`).
13. ALWAYS add `loading="lazy"` to every `<img>` tag.
14. ALWAYS add descriptive `alt` text to every `<img>` tag.
15. ALWAYS make interactive elements keyboard accessible.

---

## ⚙️ TECH STACK

```
Markup:      HTML5 — semantic elements only (<nav>, <main>, <section>, <article>, <aside>)
Styling:     CSS3 — custom properties, flexbox, grid, mobile-first
Logic:       Vanilla JS ES6+ — const/let, arrow functions, async/await, template literals, modules
API:         Jikan v4 — https://api.jikan.moe/v4 (no API key, rate limit: 3 req/sec, 60/min)
Charts:      Chart.js 4.x — https://cdn.jsdelivr.net/npm/chart.js
Font:        Inter — https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700
Icons:       Lucide Icons — https://unpkg.com/lucide@latest
Storage:     window.localStorage (5MB limit — monitor usage)
PWA:         manifest.json + sw.js (service worker)
Deploy:      Netlify (primary) or GitHub Pages (fallback)
```

---

## 📁 COMPLETE FILE STRUCTURE

```
anitrack/
├── index.html               ← Home: hero, top airing row, top rated row, announcement banner
├── list.html                ← My Watchlist (CORE feature — tabs, episode counter, table)
├── search.html              ← Search + genre/year/language/status filters
├── detail.html              ← Show detail, episodes, trailer, reviews, streaming links
├── character.html           ← Character profile + voice actor (uses ?id= param)
├── seasonal.html            ← Seasonal airing calendar (week grid view)
├── clubs.html               ← Club directory + create club
├── club-detail.html         ← Club threads, polls, members (uses ?id= param)
├── analytics.html           ← Personal stats + Chart.js visualizations
├── admin.html               ← Admin panel (protected route)
├── help.html                ← FAQ accordions + keyboard shortcuts reference
├── login.html               ← Login + Register (fake auth via localStorage)
├── profile.html             ← User profile + settings
├── manifest.json            ← PWA manifest
├── sw.js                    ← Service worker (cache + offline)
├── robots.txt
├── sitemap.xml
├── netlify.toml
├── .env.example
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── PRIVACY_POLICY.md
├── TERMS_OF_SERVICE.md
├── css/
│   ├── variables.css        ← ALL CSS custom properties (single source of truth)
│   ├── reset.css            ← Box-sizing normalize + base reset
│   ├── layout.css           ← Page wrappers, containers, grid helpers
│   ├── navbar.css           ← Fixed top navbar + hamburger
│   ├── hero.css             ← Home hero banner
│   ├── cards.css            ← Anime card component (used everywhere)
│   ├── watchlist.css        ← Watchlist table + status tabs
│   ├── detail.css           ← Show detail page layout
│   ├── seasonal.css         ← Seasonal calendar grid
│   ├── clubs.css            ← Club cards and detail
│   ├── analytics.css        ← Chart wrappers and stat cards
│   ├── admin.css            ← Admin panel tables
│   ├── auth.css             ← Login/register forms
│   ├── profile.css          ← Profile page
│   ├── modal.css            ← ALL modal/overlay styles
│   ├── toast.css            ← Toast notification stack
│   ├── skeleton.css         ← Shimmer skeleton loaders
│   ├── badges.css           ← Status badges, genre tags, platform badges
│   └── themes.css           ← Light mode overrides ONLY
└── js/
    ├── api.js               ← ALL Jikan API fetch functions (single source)
    ├── storage.js           ← localStorage CRUD helpers
    ├── auth.js              ← Login/register/session/route guard
    ├── ui.js                ← Shared DOM render functions
    ├── navbar.js            ← Navbar injection + active state + hamburger
    ├── watchlist.js         ← Watchlist CRUD operations
    ├── progress.js          ← Episode counter + progress bar logic
    ├── search.js            ← Search input + debounce + filter logic
    ├── detail.js            ← Show detail page orchestration
    ├── character.js         ← Character profile page
    ├── seasonal.js          ← Seasonal calendar data + rendering
    ├── clubs.js             ← Club/thread/reply CRUD
    ├── polls.js             ← Poll create/vote/render
    ├── reviews.js           ← Reviews + comments CRUD
    ├── recommendations.js   ← Genre-affinity scoring algorithm
    ├── analytics.js         ← Chart.js instantiation + data computation
    ├── admin.js             ← Admin panel operations
    ├── theme.js             ← Dark/light toggle + persist
    ├── reminders.js         ← Web Notifications API
    ├── share.js             ← btoa/atob watchlist sharing + CSV export
    ├── shortcuts.js         ← Keyboard shortcut bindings
    ├── pwa.js               ← Service worker registration
    └── app.js               ← Entry point: auth guard + page init router
```

---

## 🎨 DESIGN TOKENS (variables.css — exact values)

```css
:root {
  /* === BACKGROUNDS === */
  --bg-primary:       #0D0D0D;
  --bg-card:          #1A1A2E;
  --bg-surface:       #16213E;
  --bg-hover:         #22223A;
  --bg-overlay:       rgba(0, 0, 0, 0.75);

  /* === ACCENT === */
  --accent-primary:   #E8004D;
  --accent-hover:     #FF1A63;
  --accent-gold:      #C9A84C;
  --accent-blue:      #0F3460;
  --accent-glow:      rgba(232, 0, 77, 0.25);

  /* === TEXT === */
  --text-primary:     #FFFFFF;
  --text-secondary:   #AAAAAA;
  --text-muted:       #666680;
  --text-inverse:     #0D0D0D;

  /* === STATUS COLORS === */
  --status-watching:  #00B4D8;
  --status-complete:  #06D6A0;
  --status-hold:      #FFB703;
  --status-dropped:   #EF476F;
  --status-plan:      #8338EC;

  /* === SEMANTIC === */
  --success:          #06D6A0;
  --warning:          #FFB703;
  --error:            #EF476F;
  --info:             #00B4D8;

  /* === BORDERS === */
  --border-subtle:    #2A2A3E;
  --border-active:    #E8004D;
  --border-input:     #3A3A5E;

  /* === SHAPE === */
  --radius-sm:        4px;
  --radius:           8px;
  --radius-lg:        16px;
  --radius-full:      9999px;

  /* === SHADOWS === */
  --shadow-sm:        0 2px 8px rgba(0,0,0,0.3);
  --shadow:           0 4px 20px rgba(0,0,0,0.4);
  --shadow-lg:        0 8px 40px rgba(0,0,0,0.5);
  --shadow-glow:      0 0 20px rgba(232,0,77,0.3);

  /* === TRANSITIONS === */
  --transition-fast:  0.15s ease;
  --transition:       0.2s ease;
  --transition-slow:  0.35s ease;

  /* === TYPOGRAPHY === */
  --font:             'Inter', sans-serif;
  --text-xs:          11px;
  --text-sm:          13px;
  --text-base:        14px;
  --text-md:          16px;
  --text-lg:          20px;
  --text-xl:          24px;
  --text-2xl:         32px;
  --text-3xl:         40px;
  --font-light:       300;
  --font-normal:      400;
  --font-medium:      500;
  --font-semibold:    600;
  --font-bold:        700;

  /* === SPACING === */
  --space-xs:         4px;
  --space-sm:         8px;
  --space-md:         16px;
  --space-lg:         24px;
  --space-xl:         40px;
  --space-2xl:        64px;
  --space-3xl:        96px;

  /* === LAYOUT === */
  --container:        1400px;
  --navbar-height:    60px;
  --sidebar-width:    260px;
}

/* === LIGHT THEME OVERRIDES === */
body[data-theme="light"] {
  --bg-primary:       #F0F2F8;
  --bg-card:          #FFFFFF;
  --bg-surface:       #E8EAF2;
  --bg-hover:         #DADDF0;
  --text-primary:     #1A1A2E;
  --text-secondary:   #44446A;
  --text-muted:       #888899;
  --border-subtle:    #D5D8EE;
  --border-input:     #BBBBCC;
  --shadow-sm:        0 2px 8px rgba(0,0,0,0.08);
  --shadow:           0 4px 20px rgba(0,0,0,0.1);
}
```

---

## 🗄️ LOCALSTORAGE SCHEMA (storage.js)

```javascript
// ─── KEY: "at_user" ──────────────────────────────────────────────────
{
  id: "usr_" + Date.now(),
  username: string,
  email: string,
  passwordHash: string,          // SHA-256 hex of password
  avatar: "",                    // base64 or URL string
  bio: "",
  darkMode: true,
  isAdmin: false,
  joinedAt: timestamp,
  stats: {
    totalWatched: 0,
    totalEpisodes: 0,
    totalHours: 0,
    avgScore: 0
  }
}

// ─── KEY: "at_session" ───────────────────────────────────────────────
{
  userId: string,
  token: string,                 // random UUID
  expiresAt: timestamp           // Date.now() + 7 days
}

// ─── KEY: "at_watchlist" ─────────────────────────────────────────────
[{
  animeId: number,               // Jikan MAL ID
  title: string,
  titleJp: string,               // Japanese title
  cover: string,                 // images.jpg.large_image_url
  type: string,                  // TV, Movie, OVA, etc.
  totalEp: number,
  watchedEp: number,
  status: "watching" | "completed" | "onhold" | "dropped" | "plantowatch",
  score: number | null,          // 1–10
  startDate: string | null,
  finishDate: string | null,
  notes: string,
  genres: [string],
  addedAt: timestamp,
  updatedAt: timestamp
}]

// ─── KEY: "at_clubs" ─────────────────────────────────────────────────
[{
  clubId: string,
  name: string,
  description: string,
  banner: string,
  tags: [string],
  privacy: "public" | "private",
  members: [userId],
  moderators: [userId],
  threads: [{
    threadId: string,
    title: string,
    body: string,
    author: string,
    spoiler: boolean,
    pinned: boolean,
    replies: [{
      replyId: string,
      author: string,
      body: string,
      spoiler: boolean,
      likes: number,
      createdAt: timestamp
    }],
    createdAt: timestamp
  }],
  polls: [{
    pollId: string,
    question: string,
    options: [string],           // max 6
    votes: { [userId]: number }, // userId → option index
    endsAt: timestamp,
    createdBy: string
  }],
  createdBy: string,
  createdAt: timestamp
}]

// ─── KEY: "at_reviews" ───────────────────────────────────────────────
[{
  reviewId: string,
  animeId: number,
  animeTitle: string,
  author: string,
  score: number,                 // 1–10
  body: string,
  spoiler: boolean,
  helpful: [userId],
  notHelpful: [userId],
  comments: [{
    commentId: string,
    author: string,
    body: string,
    createdAt: timestamp
  }],
  createdAt: timestamp
}]

// ─── KEY: "at_reminders" ─────────────────────────────────────────────
[{
  reminderId: string,
  animeId: number,
  title: string,
  episodeNo: number,
  fireAt: timestamp,
  fired: boolean
}]

// ─── KEY: "at_theme" ─────────────────────────────────────────────────
"dark" | "light"

// ─── KEY: "at_announcement" ──────────────────────────────────────────
{ text: string, active: boolean, createdAt: timestamp }

// ─── KEY: "at_reported" ──────────────────────────────────────────────
[{ contentId: string, type: "review"|"thread"|"reply", reason: string, reportedBy: string, createdAt: timestamp }]
```

---

## 🌐 API MODULE — api.js (complete function signatures)

```javascript
const JIKAN = 'https://api.jikan.moe/v4';
const delay = ms => new Promise(r => setTimeout(r, ms));

// ── HOME ──
async function fetchTopAnime(page = 1)
async function fetchAiringNow(page = 1)
async function fetchTopAiring()
async function fetchUpcoming()
async function fetchTopMovies()

// ── SEARCH ──
async function fetchSearch(query, page = 1, filters = {})
// filters: { genres, year, status, type, orderBy, sort }

// ── DETAIL ──
async function fetchAnimeById(id)          // /anime/{id}/full
async function fetchEpisodes(id, page = 1) // /anime/{id}/episodes
async function fetchVideos(id)             // /anime/{id}/videos
async function fetchStreamingLinks(id)     // /anime/{id}/streaming
async function fetchRecommendations(id)    // /anime/{id}/recommendations
async function fetchCharacters(id)         // /anime/{id}/characters
async function fetchStaff(id)              // /anime/{id}/staff
async function fetchNews(id)               // /anime/{id}/news

// ── CHARACTER ──
async function fetchCharacterById(id)      // /characters/{id}/full
async function fetchCharacterAnime(id)     // /characters/{id}/anime

// ── SEASONAL ──
async function fetchSeasonNow()            // /seasons/now
async function fetchSeason(year, season)   // /seasons/{year}/{season}
async function fetchSeasonsList()          // /seasons

// ── GENRES ──
async function fetchGenres()               // /genres/anime

// ── ERROR HANDLING (wrap all above) ──
// On 429: wait 1000ms and retry once
// On any error: return null, call showToast(message, 'error')
// Always check response.data exists before returning
```

---

## 🔐 AUTH MODULE — auth.js

```javascript
// Simple fake auth — no real backend

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
}

function generateToken() {
  return crypto.randomUUID();
}

// Register: check username not taken → hash password → save at_user
// Login: find user → hash input → compare → save at_session
// Logout: delete at_session
// isLoggedIn(): check at_session exists and not expired
// getUser(): return at_user parsed
// guardRoute(): if not logged in → redirect to login.html
// isAdmin(): return at_user.isAdmin === true
```

**Enable Admin for testing (browser console):**
```javascript
const u = JSON.parse(localStorage.getItem('at_user'));
u.isAdmin = true;
localStorage.setItem('at_user', JSON.stringify(u));
location.reload();
```

---

## 💡 UI MODULE — ui.js (component patterns)

```javascript
// Anime Card
function renderAnimeCard(anime, showAddBtn = true)
// → returns HTML string with cover, score badge, title, meta, add button

// Skeleton
function renderSkeletonCards(count = 10)
// → returns N shimmer skeleton cards

// Status Badge
function renderStatusBadge(status)
// → <span class="badge badge-{status}">{Label}</span>

// Star Rating Display
function renderStars(score)
// → filled/half/empty star spans for score 1–10

// Progress Bar
function renderProgress(watched, total)
// → <div class="progress-bar"><div style="width:{pct}%"></div></div>

// Toast (4 types: success, error, info, warning)
function showToast(message, type = 'info', duration = 3000)
// → injects toast into #toast-container, auto-removes after duration

// Modal
function openModal(title, bodyHTML, footerHTML = '')
function closeModal()

// Spoiler Wrapper
function wrapSpoiler(content, hasSpoiler)
// → <div class="spoiler-wrap {hasSpoiler ? 'spoiler' : ''}" onclick="this.classList.remove('spoiler')">{content}</div>

// Empty State
function renderEmptyState(icon, title, subtitle, ctaText, ctaHref)
// → full empty state card with icon, message, and CTA button

// Error State
function renderErrorState(message, retryFn)
// → error card with message and retry button

// Platform Badge (streaming links)
function renderPlatformBadge(name, url)
// → colored badge anchor for Crunchyroll, Netflix, etc.
```

---

## 🧮 RECOMMENDATIONS ALGORITHM — recommendations.js

```javascript
function getPersonalRecommendations() {
  const watchlist = getWatchlist();
  
  // Step 1: Build genre affinity map from completed/watching shows
  const genreScore = {};
  watchlist
    .filter(e => ['watching', 'completed'].includes(e.status))
    .forEach(entry => {
      const weight = (entry.score || 5) / 10; // higher scored = stronger preference
      entry.genres.forEach(genre => {
        genreScore[genre] = (genreScore[genre] || 0) + weight;
      });
    });
  
  // Step 2: Sort genres by affinity score
  const topGenres = Object.entries(genreScore)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);
  
  // Step 3: Fetch from Jikan top anime in top genres
  // Filter out anime already in watchlist
  // Sort by score descending
  // Return top 20
}
```

---

## 🔔 HOOKS SYSTEM (Claude Code)

Hooks file location: `anitrack/.claude/settings.json`

```json
{
  "permissions": {
    "allow": [
      "Bash(node:*)",
      "Bash(npx prettier*)",
      "Bash(npx serve*)",
      "Bash(open:*)",
      "Bash(cat:*)",
      "Bash(ls:*)",
      "Bash(cp:*)",
      "Bash(mkdir:*)",
      "Bash(touch:*)",
      "Bash(echo:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git push:*)",
      "Bash(git status:*)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(sudo:*)",
      "Bash(curl:*)",
      "Bash(wget:*)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [{
          "type": "command",
          "command": "echo \"[PreWrite] Writing: $CLAUDE_TOOL_INPUT_FILE_PATH\""
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [{
          "type": "command",
          "command": "FILE=$CLAUDE_TOOL_INPUT_FILE_PATH; EXT=${FILE##*.}; if [ \"$EXT\" = \"js\" ] || [ \"$EXT\" = \"css\" ] || [ \"$EXT\" = \"html\" ]; then npx prettier --write \"$FILE\" 2>/dev/null && echo \"[Prettier] Formatted: $FILE\"; fi"
        }]
      },
      {
        "matcher": "Write",
        "hooks": [{
          "type": "command",
          "command": "FILE=$CLAUDE_TOOL_INPUT_FILE_PATH; if [[ \"$FILE\" == *.js ]]; then node --check \"$FILE\" 2>&1 && echo \"[SyntaxOK] $FILE\" || echo \"[SyntaxERR] $FILE — fix before continuing\"; fi"
        }]
      }
    ],
    "Notification": [
      {
        "hooks": [{
          "type": "command",
          "command": "osascript -e 'display notification \"AniTrack: Claude needs input\" with title \"Claude Code\" sound name \"Ping\"' 2>/dev/null || notify-send 'Claude Code' 'AniTrack: needs input' 2>/dev/null || true"
        }]
      }
    ],
    "Stop": [
      {
        "hooks": [{
          "type": "command",
          "command": "echo \"[Done] Phase complete. Files written: $(git diff --name-only HEAD 2>/dev/null | wc -l) changed\" && osascript -e 'display notification \"Phase complete!\" with title \"AniTrack Build\"' 2>/dev/null || true"
        }]
      }
    ]
  }
}
```

---

## 🔑 KEYBOARD SHORTCUTS (shortcuts.js)

| Key | Action |
|---|---|
| `/` | Focus search input |
| `W` | Go to Watchlist |
| `H` | Go to Home |
| `S` | Go to Search |
| `A` | Go to Analytics |
| `D` | Toggle Dark/Light mode |
| `ESC` | Close modal / clear search |
| `?` | Open keyboard shortcuts help |
| `Ctrl + K` | Open command palette (search modal) |

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile-first base → no query needed */
/* Tablet */    @media (min-width: 768px) { ... }
/* Desktop */   @media (min-width: 1024px) { ... }
/* Large */     @media (min-width: 1440px) { ... }
```

Behaviour changes:
- Mobile (<768px): single column, hamburger menu, bottom-sheet modals, card stack
- Tablet (768px+): 3-col grid, collapsible sidebar, centred modals
- Desktop (1024px+): full watchlist table view, 4-col grid, persistent sidebar
- Large (1440px+): 5-col grid, max-width container, expanded navbar

---

## 🛠️ JIKAN RATE LIMIT STRATEGY

```javascript
// Max 3 req/sec, 60/min
// Rule 1: Always add delay(400) between sequential calls
// Rule 2: Never Promise.all more than 3 calls simultaneously
// Rule 3: On 429 response → wait 1000ms → retry once → if still 429 → show error toast

const delay = ms => new Promise(r => setTimeout(r, ms));

// Sequential pattern:
const anime = await fetchAnimeById(id);
await delay(400);
const episodes = await fetchEpisodes(id);
await delay(400);
const videos = await fetchVideos(id);

// Parallel pattern (max 3):
const [anime, episodes, chars] = await Promise.all([
  fetchAnimeById(id),
  fetchEpisodes(id),
  fetchCharacters(id)
]);
```

---

## 🌐 PWA SETUP (manifest.json + sw.js)

**manifest.json:**
```json
{
  "name": "AniTrack",
  "short_name": "AniTrack",
  "description": "Your personal anime & TV series tracker",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#0D0D0D",
  "theme_color": "#E8004D",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**sw.js caching strategy:**
- Cache name: `anitrack-v1` (increment on each deploy)
- Cache on install: all CSS, JS, HTML, manifest
- Network-first for API calls (Jikan)
- Cache-first for static assets (fonts, icons)
- Fallback to cached index.html for navigation requests (offline support)

---

## 🐛 COMMON MISTAKES — AVOID THESE

| Mistake | Fix |
|---|---|
| `btoa()` on Japanese characters | `btoa(encodeURIComponent(str))` and `decodeURIComponent(atob(str))` |
| Chart.js canvas without height | Wrap in `<div style="height:300px">` |
| Web Notifications on `file://` | Only works on HTTPS. Test on Netlify preview |
| localStorage full (5MB) | Add `getStorageUsage()` function with quota warning at 80% |
| Stale SW cache after deploy | Increment cache name from `anitrack-v1` to `anitrack-v2` |
| Jikan images breaking | Always use `?.images?.jpg?.large_image_url` with fallback to placeholder |
| SHA-256 in non-HTTPS | `crypto.subtle` requires secure context — HTTPS or localhost only |
| Multiple Chart.js instances | Always `chart.destroy()` before re-rendering on same canvas |
| localStorage sync across tabs | Use `window.addEventListener('storage', handler)` to sync state |

---

## 🔢 BUILD PRIORITY ORDER

When building, always follow this sequence:

**Phase 1 — Foundation** (build first, everything depends on it)
- variables.css → reset.css → layout.css → navbar.css → modal.css → toast.css → skeleton.css → badges.css → themes.css
- storage.js → auth.js → api.js → ui.js → theme.js → navbar.js → shortcuts.js → pwa.js → app.js

**Phase 2 — Auth + Core**
- login.html + auth.css
- index.html (home page with live Jikan data)
- list.html + watchlist.js + progress.js + watchlist.css

**Phase 3 — Discovery**
- search.html + search.js
- detail.html + detail.js + detail.css
- character.html + character.js

**Phase 4 — Seasonal**
- seasonal.html + seasonal.js + seasonal.css

**Phase 5 — Community**
- clubs.html + club-detail.html + clubs.js + polls.js + reviews.js + clubs.css
- Spoiler protection, confetti animation

**Phase 6 — Dashboard + Admin**
- analytics.html + analytics.js + analytics.css
- admin.html + admin.js + admin.css
- profile.html + profile.css

**Phase 7 — Polish + Launch**
- recommendations.js
- reminders.js
- share.js
- help.html
- manifest.json + sw.js
- robots.txt + sitemap.xml + netlify.toml
- README.md + CHANGELOG.md

---

## 🚀 DEPLOYMENT

```bash
# Netlify (recommended)
# 1. Push to GitHub
git init && git add . && git commit -m "AniTrack v1.0"
git remote add origin https://github.com/USERNAME/anitrack.git
git push -u origin main

# 2. Connect repo at netlify.com → auto-deploys on every push
# Live URL: https://anitrack.netlify.app

# GitHub Pages (fallback)
# Settings → Pages → Deploy from main → root
# Live URL: https://USERNAME.github.io/anitrack
```

---

## 📊 SUCCESS METRICS

- Lighthouse Performance: ≥ 85
- Lighthouse Accessibility: ≥ 90
- Lighthouse SEO: ≥ 90
- Lighthouse PWA: ≥ 90
- Zero console errors
- All 14 brief features implemented + 8 extras
- Works offline for cached pages
- Installable on mobile via PWA

---

## 🔖 REFERENCES

- Jikan API docs: https://docs.api.jikan.moe/
- Chart.js docs: https://www.chartjs.org/docs/
- Web Notifications API: https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API
- Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- Service Worker: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- Launched Global contact: support@launched.org.in | 08062181856
