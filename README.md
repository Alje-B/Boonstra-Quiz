````markdown
```markdown
# Boonstra Quiz — GitHub Pages compatible (static)

This branch converts the app to a static, client-side-only site so it can be hosted on GitHub Pages. The app stores data in the browser's localStorage.

What changed
- Removed server dependency: all user registration and admin features are client-side and stored in localStorage.
- Admin console remains password-protected (default password: `changeme`). The password is stored in localStorage for the browser that sets it.

How to publish on GitHub Pages
- Option A (recommended): Push this branch and open a PR, then merge to a branch configured for GitHub Pages (e.g., `gh-pages` or `main`). You can also configure Pages to serve from the `docs/` folder.
- Option B: Create a branch named `gh-pages` containing the `public/` folder contents at the repository root.

Notes and limitations
- This static version is intentionally minimal: it uses localStorage, not a server-side persistent store. Therefore, users/scores are only available in the browser where they were created.
- If you need a server-backed implementation (shared users/scores), keep or run the Express backend from the `server.js` implementation and host it on a server.

Next steps (possible improvements)
- Convert this static app to call a server API for shared data if you want a global scoreboard.
- Improve admin authentication (e.g., OAuth or other server-backed auth).
````