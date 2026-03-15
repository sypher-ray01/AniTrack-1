# Contributing to AniTrack

Thanks for your interest in contributing! AniTrack is an open-source project and contributions are welcome.

---

## Getting Started

```bash
git clone https://github.com/USERNAME/anitrack.git
cd anitrack
npx serve .   # Serve locally
```

No build step, no npm install required.

---

## Rules

1. **No frameworks.** Keep it Vanilla JS. This is intentional.
2. **CSS variables only.** Never add raw color values in CSS files.
3. **Mobile-first.** All new UI must work at 375px before 1440px.
4. **No new localStorage keys** without updating the schema in CLAUDE.md and README.md.
5. **Preserve Jikan rate limiting.** Never add calls without `delay(400)` between them.

---

## How to Contribute

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test at 375px, 768px, 1440px
5. Run a Lighthouse audit on any page you modified
6. Submit a pull request with a clear description of changes

---

## Reporting Bugs

Open a GitHub Issue with:
- Steps to reproduce
- Expected behaviour
- Actual behaviour
- Browser + OS

---

## Feature Requests

Open a GitHub Issue tagged `enhancement`. Explain the feature and how it fits AniTrack's scope.

---

## Code Style

- 2-space indentation
- Single quotes in JavaScript
- Descriptive function and variable names
- Comment any logic that isn't immediately obvious
- `async/await` only — no `.then()` chains
