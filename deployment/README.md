# MG website integration

Deploy `dist/` to a dedicated static release directory (the example uses `/srv/mg-geo/dist`). This package does not own `/` and intentionally contains no root `index.html`.

1. Include `legacy-guide-redirects.conf` in the MG website `server` block.
2. Include `nginx-geo-static.conf` in the existing server block after replacing the release directory. It maps exact page and asset paths only; it does not replace the website's root location or error handling. Check existing asset paths for conflicts before integrating.
3. Confirm the 17 canonical routes return `200`, all 25 legacy routes return `301`, and an unknown route returns `404`.
4. Do not add an SPA catch-all such as `/* /index.html 200`.

The application server, TLS termination and production release switch remain outside this package.

The generated sitemap contains these 17 pages only. Integrate it with the existing MG sitemap (for example as a child sitemap in the site's sitemap index); do not overwrite a larger existing sitemap or robots policy with this package's standalone examples. Unknown guide paths return 404; paths belonging to the rest of the MG website remain under its existing routing.

Regenerate both Nginx snippets with `node scripts/generate-deployment.mjs` after changing the route or public asset inventory. Actual Nginx configuration validation and production 301 verification are deployment acceptance steps and have not been run against MG infrastructure.
