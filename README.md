# au_mg — MG Australia EV Guides static source

Independent Astro static delivery: one `EV Guides & Advice` entry containing a guide list, a `Questions & Answers` page and 14 guide articles. The existing MG owner FAQ and model pages remain on the official website and are not replaced by this package. The developer-built Astro architecture, official-site shell and visual system remain the implementation baseline; this repository owns the EV content layer.

## Commands

Node.js >=22.12 and npm >=10 are required.

```powershell
npm ci
npm run build
npm run preview
npm test
npm run package
```

The root preview URL and dist/index.html directly contain the full guide list; neither redirects nor loads the body through JavaScript. Double-click dist/index.html for local-file browsing with JavaScript enabled. Real-browser file-mode verification may require a manual check; see the current QA report. `npm run preview` starts the local fixed-folder URL mapper at http://127.0.0.1:4330.

Build output: dist/index.html (complete guide hub), dist/sitemap_evguide.xml, dist/404.html, dist/assets/, dist/scripts/, dist/questions/index.html and dist/<slug>/index.html (14 articles). The old nested dist/explore/ev-guides/ is no longer emitted. No backend/API/CMS is required. HTTP content and links remain usable without JavaScript.

Public source assets remain immutable. Astro develops using the canonical routes and namespaced resources in .generated/public; the build finalizer relocates only generated files into the flat delivery root. The derived stylesheet embeds original font bytes for local-file compatibility, with layout/style declarations unchanged.

npm run package produces a timestamped ZIP in release/, including dist/, deployment instructions and SHA-256 checksums. It extracts the archive to a Chinese/space-containing verification directory and checks every file. FILE_MANIFEST_SHA256.txt separately inventories source and built output; generated caches/releases are excluded.

## Content safety

npm run verify:content checks the four original data files and original CSS against frozen SHA-256 values. Git preserves their exact bytes. Optional original-project comparison also checks copied images/fonts:

```powershell
$env:ORIGINAL_PROJECT = 'C:\path\to\MG_Australia_EV_Guides_Source_20260916'
npm run verify:original
```

The original project is not required to build. The protected content sources publish 14 guides and 16 EV questions at `/explore/ev-guides/questions`; no `/about/faqs` or local model route is created. dist/, .generated/, node_modules/, release/ and local environment files are not committed.

## Integration and acceptance

See deployment/README.md and DELIVERY.md. Do not replace MG's homepage, main sitemap, owner FAQ or robots policy. Only map the 16 EV content pages, namespaced resources, 25 legacy redirects and /sitemap_evguide.xml.

Current directory layout and acceptance: deployment/FIXED_DIRECTORY.md and qa/FLAT_DELIVERY_REPORT.md. Earlier QA reports describe their dated layouts and must not be treated as current entry-point evidence.

No automatic Git push, remote deployment or webmaster-account submission occurs.
# 双模式交付（默认带导航）

`npm run build` / `npm run package` 默认带导航；`npm run build:content` /
`npm run package:content` 输出不带header/footer的内容页面。显式带导航命令为
`build:nav` / `package:nav`。配置入口 `config/delivery.mjs`；详细说明见
[deployment/NAVIGATION_MODES.md](deployment/NAVIGATION_MODES.md)。模式切换不会修改指南正文、原始CSS或正式URL。
