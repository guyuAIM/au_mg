# MG Australia EV Guides integration

## Deployment boundary

Deploy dist/ to a dedicated release directory, for example /srv/mg-geo/dist. Its root index.html is a customer/local preview launcher only: **do not replace the existing MG homepage or root /index.html**. No root / or global error handling is defined by the integration snippets.

The MG team adds its own navigation/footer entry pointing to https://mgmotor.com.au/explore/ev-guides. This delivery owns the guide list, 14 articles and namespaced /explore/ev-guides/assets/ and /scripts/ only. Existing FAQ/model navigation goes to the live MG pages.

Include nginx-geo-static.conf and legacy-guide-redirects.conf in the existing MG server block after changing the release-directory path. Test with nginx -t before release. Configure mappings alongside the existing routes without adding an SPA catch-all. The package maps exact content/resource URLs; unknown guide paths return 404. Thirty canonicalization rules redirect slash/index.html aliases; 25 legacy guide rules return 301.

After deployment verify all 15 canonical URLs return 200, the child sitemap returns XML, every legacy alias returns 301 to its canonical guide, and unknown guide paths return 404. Verify the MG homepage, FAQ/model pages, main sitemap and robots rules are unchanged.

## Child sitemap

Stable URL: https://mgmotor.com.au/sitemap_evguide.xml

The UTF-8 urlset contains only the 15 absolute, unique canonical content URLs. Article dates come from content data; the list date is the latest guide date. Preview launcher, 404, aliases, assets, FAQ and model pages are excluded. Regenerate the complete child file with each release, preserving still-active article URLs.

- Existing main sitemap is a sitemapindex: merge sitemap-index-snippet.xml as a child entry, retaining all existing entries, and persist the change in MG's sitemap generator configuration.
- Existing main sitemap is a urlset: do not insert a sitemap entry into that urlset and do not replace it. Merge robots-sitemap-snippet.txt into the root robots.txt, or submit the child URL separately through the verified Google Search Console/Bing Webmaster Tools account.
- Preserve existing robots restrictions and other Sitemap lines. This delivery intentionally contains no root robots.txt or generic sitemap.xml.

MG owns domain verification, submission accounts, TLS and production release. No new domain, CMS or server account needs to be supplied to us. We provide the release ZIP and URL list; MG deploys updated files and the complete child sitemap together.

## Preview and validation

Double-click dist/index.html with JavaScript enabled, or use npm run preview. HTTP uses clean canonical paths; file mode uses local index.html targets. No online assets are required for the guide presentation; official external links still require internet access.

npm run build regenerates the scoped Nginx snippets. qa/nginx-local.conf is for isolated local Docker acceptance only, not an MG production configuration. It separately exercises normal HTTP, scripts blocked by CSP, and preservation of simulated existing MG routes.

Rollback: restore the prior dedicated release directory and associated scoped snippets only; leave the existing MG homepage, robots policy and main sitemap intact.
