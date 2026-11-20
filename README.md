# The Corridor

Short interactive leadership stories for senior roles in Peru's mining sector. Each story puts the player in a senior role at a fictional copper mine in the southern Andes, with animated scenes, narrated dialogue (browser text-to-speech) and word-by-word subtitles. Scoring is rule-based, with no AI.

## Stories

| Path | Domain | Story |
|---|---|---|
| `social/` | Corporate Affairs & Social License | 30 days as VP Corporate Affairs during a road blockade |
| `cfo/` | Finance & Commercial (CFO) | 45 days as CFO: record copper, tight cash, a loan covenant and an expansion vote |

General Management, Projects & Engineering and Operations are planned.

## Structure

```
index.html          Home page: pick a role
shared/style.css    Look and animations
shared/base.js      Line helpers for story files
shared/art.js       Illustration helpers (inline SVG)
shared/engine.js    Scenes, voices, subtitles, scoring and results
social/index.html   Story + scoring config for one domain
cfo/index.html      Story + scoring config for one domain
```

To add a domain, copy one of the story folders and replace its `CFG`: people, meters, target competency profile, flags, art and scenes.

## Run it

Open `index.html` in a browser, or host it with GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**.

## Status

Prototype. Scores are not calibrated yet, and results aren't stored anywhere; each player sees them only on their own screen.
