# au_mg — MG Australia EV Guides GEO static source

This is an independent Astro static build of the approved MG Australia FAQ, MGS6 EV and EV Guides experience. The original React/Vite package remains the visual and content golden master.

## Requirements

- Node.js 22.12 or later
- npm 10 or later

## Commands

```powershell
npm ci
npm run build
npm run preview
```

Open the preview through HTTP, for example `http://localhost:4321/about/faqs`. Do not open files under `dist/` with a `file://` URL or by double-clicking an HTML file: production-root references such as `/assets/styles.css` would then resolve against the drive root instead of this site, so styles, fonts, images and scripts would not load.

The build creates 17 canonical HTML pages in `dist/`. Every page contains its visible copy, tables, references, internal links and JSON-LD before client JavaScript executes. There is deliberately no root `/` page and no SPA fallback.

`npm run package` rebuilds, verifies and writes `FILE_MANIFEST_SHA256.txt` for the source and delivery output.

On Windows, the project uses the vendored official WASI build of Astro's parser so that the build remains reproducible on machines where application control blocks native parser DLLs. Node may print an experimental WASI warning; this is a build-time runtime notice and does not add client JavaScript or affect the generated HTML.

## Content safety

The four source-data files and the approved stylesheet are copied byte-for-byte from the golden project. `npm run verify:content` rejects any unexpected change to those files. Git preserves exact file bytes using `.gitattributes`, so checkout line-ending conversion cannot invalidate the source hashes.

Building this repository does not require the original project. Optional comparison with that project also checks copied images/fonts. Set its actual local path before running the comparison:

```powershell
$env:ORIGINAL_PROJECT = 'C:\path\to\MG_Australia_EV_Guides_Source_20260916'
npm run verify:original
```

The repository is named `au_mg` and the local working copy is `D:\gy\au_mg`. Generated `dist/`, dependency `node_modules/`, `.astro/` and local environment files are not committed. Run `npm run build` after a fresh clone to regenerate the static output.

## MG integration

See `deployment/README.md`. No backend, database, CMS, authentication, deployment or production mutation is included.

Current content, browser, interaction, HTTP and build evidence, including remaining limitations, is recorded in `qa/recheck/REPORT.md` and `qa/reports/acceptance.json`. The older `qa/QA_REPORT.md` is retained as historical evidence and is superseded by the recheck.
