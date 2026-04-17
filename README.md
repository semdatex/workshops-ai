# workshops-ai

Landing page for SEMDATEX's AI Knowledge Sharing Workshop series. Sessions and progress are rendered from `content.json`; the page is hosted on GitHub Pages and updates on every merge to `main`.

Live site: https://semdatex.github.io/workshops-ai/

## Stack

Static single-page app. No build step.

- `index.html` — page shell, dark theme.
- `main.js` — fetches `content.json` and renders the epic card, progress bar, and session grid.
- `content.json` — epic metadata and session list. Refreshed from Notion.
- Tailwind CSS via CDN.

## Preview locally

```sh
python3 -m http.server 8080
# then open http://localhost:8080
```

Any static file server works (`npx serve`, `caddy file-server`, etc.) — the only requirement is that `content.json` is served alongside `index.html` so `fetch('./content.json')` resolves.
