# MG Australia client feedback — before and after

These screenshots record the local implementation of the three comments supplied in `MG website -GEO content building-20261001(1).pptx`. The PowerPoint itself was not edited.

- Build: local static build from the working tree
- Desktop viewport: `1440 × 1000`
- Mobile review viewport: `390 × 844`
- Baseline: Git `f315c34` before the local changes
- Desktop capture command: `node scripts/capture-client-feedback.mjs before|after`
- Mobile review command: `node scripts/capture-client-feedback.mjs after --mobile`

| Area | Before | After | Check shown |
| --- | --- | --- | --- |
| EV Guides hub | [01-guide-hub-before.png](./01-guide-hub-before.png) | [01-guide-hub-after.png](./01-guide-hub-after.png) | Only the red struck-through sentence is removed; `MG4 CHARGING` returns results |
| AC/DC charging guide | [02-charging-article-before.png](./02-charging-article-before.png) | [02-charging-article-after.png](./02-charging-article-after.png) | Infotainment image replaced by the MG Australia MG4 EV recharging image |
| EV questions | [03-questions-before.png](./03-questions-before.png) | [03-questions-after.png](./03-questions-after.png) | Search plus Topic only; `25000` returns Budget & offers questions |

The replacement image is stored locally as `public/assets/mg4-ev-recharging.jpg` and links to its [MG Australia source page](https://mgmotor.com.au/vehicles/electric).

The 390 px review covered the same three views. The introduction and search input wrap cleanly, Topic chips remain horizontally scrollable, FAQ results stay readable, and the charging image retains a useful crop without horizontal page overflow.
