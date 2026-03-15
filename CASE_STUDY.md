# AniTrack — Case Study

**Developer:** Himanshu Jangid
**Duration:** ~3 weeks
**Stack:** HTML5, CSS3, Vanilla JavaScript, Jikan API v4, Chart.js
**Live:** https://anitrack.netlify.app

---

## The Problem

MyAnimeList (MAL) is the dominant anime tracking platform globally, but its UI is notoriously outdated and its mobile experience is poor. Users who want to track what they're watching, discover new anime, and discuss shows with a community have no modern alternative that works fully in a browser without downloading an app.

**Goal:** Build a modern, fast, installable web platform that does everything MAL does — but looks and feels like a 2026 product.

---

## Technical Decisions

### Why Vanilla JavaScript?
The brief explicitly required no frameworks. But beyond compliance — this was a deliberate architectural choice. Vanilla JS forces you to understand exactly what's happening in the browser. There's no abstraction layer between the code and the DOM. Every performance optimization, every event delegation pattern, every state management solution had to be written from scratch — which means understanding it fully.

The result: a 13-page application with 22 JavaScript modules, zero runtime dependencies, and a Lighthouse performance score above 85.

### Why localStorage for Everything?
No backend was available or required. localStorage offered a clean constraint: it forced a disciplined data schema design, a clear separation between data layer (storage.js) and UI layer (ui.js), and made multi-user support an interesting architectural challenge (user-scoped key prefixes rather than server-side isolation).

The 5MB localStorage limit required building a storage quota checker — a real engineering constraint that taught practical data management.

### Jikan API Rate Limiting
The biggest technical challenge was Jikan's 3 requests/second rate limit. Pages like the detail page require simultaneous calls for show info, episodes, characters, streaming links, and recommendations. The solution was a queuing strategy:
- Sequential calls with `delay(400)` between them for non-critical data
- `Promise.all` for maximum 3 parallel calls when speed mattered
- Automatic retry (once) on 429 responses with 1000ms backoff
- Graceful degradation — sections load independently, failures show error states without breaking the whole page

### CSS Architecture
A strict token-first CSS architecture prevented the common problem of design inconsistency at scale. Every color, spacing value, and transition duration is defined once in `variables.css` and referenced everywhere else. Light mode required adding only one override block — no duplicate stylesheets.

### Fake Auth Without a Backend
Client-side auth using the Web Crypto API's `crypto.subtle.digest('SHA-256')` provided a realistic auth experience without a server. Passwords are hashed before storage — never stored in plain text. Session tokens are UUID strings with expiry timestamps. The approach is clearly a simulation, but it demonstrates the auth flow pattern correctly.

---

## Challenges

**1. Jikan API null responses**
Anime data from Jikan is inconsistent — some shows have null episode counts, missing images, or empty streaming links. Every data access path required defensive optional chaining (`?.`) and fallback values. Built a `sanitizeAnime()` utility function that normalizes all Jikan responses before they touch the UI.

**2. Chart.js responsive behaviour**
Chart.js canvases don't respond well to CSS width changes without explicit configuration. Fixed with `maintainAspectRatio: false` and wrapping every canvas in a fixed-height container div.

**3. btoa() with Japanese characters**
The watchlist sharing feature encodes the watchlist as a base64 URL parameter. `btoa()` crashes on non-Latin characters (anime titles in Japanese). Fixed with `btoa(encodeURIComponent(str))` encoding and `decodeURIComponent(atob(str))` decoding.

**4. Service Worker cache invalidation**
After first deployment, the service worker cached all assets aggressively. Subsequent deploys weren't loading because users were served stale cached files. Implemented a versioned cache name (`anitrack-v{N}`) and an `activate` handler that deletes all caches not matching the current version on every deploy.

**5. localStorage across multiple users**
When implementing multi-user support, the flat key structure (`at_watchlist`) meant User A could see User B's data after a login switch. Fixed by prefixing all data keys with the user ID: `at_watchlist_usr_001`, `at_reviews_usr_001`, etc.

---

## What I'd Do Differently

**With a real backend:**
- Move auth to a real session/token system (JWT or session cookies)
- Store user data in a database (PostgreSQL or MongoDB) for cross-device sync
- Add real-time features (SSE or WebSockets) for live club discussions
- Implement proper MAL XML import to migrate existing MAL lists

**Architecturally:**
- Add a client-side router (hash-based or History API) instead of separate HTML files for a true SPA experience
- Use a state management pattern (observer/pub-sub) instead of direct localStorage reads in every module
- Build a proper component system with JS template functions rather than raw HTML string interpolation

---

## Results

| Metric | Result |
|---|---|
| Pages | 13 |
| JS Modules | 22 |
| CSS Modules | 17 |
| Features (brief) | 14/14 |
| Features (extras) | 8/8 |
| Lighthouse Performance | ≥ 85 |
| Lighthouse Accessibility | ≥ 90 |
| Lighthouse PWA | ≥ 90 |
| Runtime Dependencies | 0 |
| Console Errors | 0 |

---

## Key Learnings

- **Constraints are creative.** No framework, no backend, 5MB storage limit — each constraint forced a more thoughtful solution than a framework would have provided automatically.
- **API defensive programming is non-negotiable.** Real-world APIs return inconsistent data. Every access path needs a fallback.
- **CSS architecture matters at scale.** 17 CSS files without a token system would have been chaos. The variable-first approach made theming trivial.
- **Vanilla JS is not limiting — it's clarifying.** Writing state management, event delegation, and module patterns from scratch builds intuition that frameworks abstract away.
