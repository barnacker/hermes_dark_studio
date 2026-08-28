# Hermes Dark Studio

Hermes **desktop app** theme derived from the [Dark Studio](https://github.com/barnacker/dark_studio)
OBS theme — same palette, one tuned for the desktop app instead of OBS.

The app paints its UI from CSS variables fed by a single `DesktopTheme` object:
a ~22-key `colors` block (surfaces, text ladder, borders, accent, user message
bubbles, destructive), optional `typography`, and an optional terminal ANSI
set for the app's integrated terminal pane. This theme is one desktop plugin
that registers that object; the app then lists **Dark Studio** in Appearance
and ⌘K exactly like a built-in.

## What's where

| File | Role |
|---|---|
| `plugin.js` | The whole theme — one editable `V` table at the top, every hex annotated with its OBS origin (`Dark_Studio.obt` CSS var) and the element it paints. Registers the theme + two ⌘K commands (apply, copy palette JSON) + the OBS maroon composer field and red typed-text (scoped CSS; no theme token reaches that element). |
| `install.ps1` | One-shot install onto a Windows machine running the desktop app. |

## Install

📦 **[Click here to install the Dark Studio theme in the Hermes desktop app](hermes://plugin-desktop/install?repo=barnacker/hermes_dark_studio&force=true)**

It opens the app's **Install plugin** modal — it probes the repository, shows a
**View repository** review link, and asks before anything runs. 🛡 Only do that
if you trust this repo (it's `barnacker/hermes_dark_studio` — check the page).

**Updating later = clicking the same link again.** It carries `force`, so the
modal reinstalls from `master` and the theme hot-reloads. That's the update key.

*The click does nothing?* Browsers can block `hermes://` navigation — right-click
the link → copy → paste it into your OS address bar. Or use the classic path below
(clone + installer).

The link, raw:

```
hermes://plugin-desktop/install?repo=barnacker/hermes_dark_studio&force=true
```

**Or the classic way — `git clone` + installer (any OS):**

```powershell
git clone https://github.com/barnacker/hermes_dark_studio
.\hermes_dark_studio\install.ps1
```

**Or manually, any OS** — copy the repo's `plugin.js` into a folder named
`hermes_dark_studio` inside the desktop app's `desktop-plugins` dir
(`<home>\desktop-plugins\hermes_dark_studio\plugin.js`). That home is
`$HERMES_HOME` if set, else
`%LOCALAPPDATA%\hermes` on Windows (the documented default), else
`~/.hermes` on macOS/Linux. The app's **Settings → Plugins** shows the exact
folder it loads plugins from — that answer wins if it differs.

Then in the app:

1. **⌘K** (or **Ctrl+K**) → **Reload desktop plugins** — first load only
2. **⌘K** → **Theme: apply Dark Studio** — or Appearance → pick Dark Studio

The theme is stored per app machine (the desktop app's own setting), not on
the gateway — a remote-gateway setup keeps managing servers/headless boxes;
the app's look always lives with the app.

## Editing

Open `plugin.js`, change a value in the `V` table, save. The app
hot-reloads the plugin; run the ⌘K apply command again to re-apply.

To map a detail you want:

- Everything in the composer/inputs: `card` (fill), `foreground` (text),
  `mutedForeground` (placeholder/disabled), `border`/`input` (idle outline),
  `composerRing` (focus)
- Your message bubbles: `bubble`, `bubbleBorder`
- Sidebar: `sidebar`, `sidebar`-derived + `border`
- Menus/dropdowns: `popover`, `popoverForeground`
- Errors/Stop: `danger` (there is no standalone status token in the theme model —
  status colors live in the terminal `ANSI` block only)
- The composer field you type in: `composerField` (maroon `--input_bg`) and
  `composerText` (red `--input_text`) — applied by scoped CSS to the composer
  only, so it never tints other themes or other input fields
- Terminal pane only: the `ANSI` block (the OBS ramps verbatim)

Every new hex: keep `#RRGGBB` form. The app derives secondary/accent tints,
the title bar, and contrast-safe foregrounds from these seeds, so one value
moves several related elements predictably — the comments explain which.

## Notes

- `name: dark-studio` must not collide with a built-in desktop theme
  (`nous`, `mono`, `slate`, `cyberpunk`, `midnight`, `ember`).
- Iosevka Term is first in the font stack for the OBS-parity look; it falls
  through to system fonts where it isn't installed (Nerd Fonts site).
- This repo is desktop-app theming only. The OBS half of the palette lives in
  `barnacker/dark_studio`.
