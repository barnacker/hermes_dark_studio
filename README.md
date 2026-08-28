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
| `dark-studio/plugin.js` | The whole theme — one editable `V` table at the top, every hex annotated with its OBS origin (`Dark_Studio.obt` CSS var) and the element it paints. Registers the theme + two ⌘K commands (apply, copy palette JSON) + the OBS maroon composer field and red typed-text (scoped CSS; no theme token reaches that element). |
| `dark-studio/install.ps1` | One-shot install onto a Windows machine running the desktop app. |

## Install

**One click — from your browser, in two steps:**

1. Open [https://github.com/barnacker/hermes_dark_studio/tree/master](https://github.com/barnacker/hermes_dark_studio/tree/master) in any browser (logged into the Hermes app on that machine or not — either works).
2. Click the **[Install Dark Studio in the Hermes desktop app](hermes://plugin-desktop/install?repo=barnacker/hermes_dark_studio&force=true)** link below.

**[Install Dark Studio in the Hermes desktop app](hermes://plugin-desktop/install?repo=barnacker/hermes_dark_studio&force=true)**

That opens the app and its **Install plugin** modal, which probes the
repository, shows what it will install, and puts it in the app's desktop-plugins
folder. 🛡 **You're asked to confirm before anything runs — only do that if you
trust this repository** (verify the repo/author on the GitHub page first).

- **To UPDATE later:** click the same link again — it carries `force=true`, so
  the modal force-reinstalls from `master` and the plugin hot-reloads. It's the
  update button.
- Browsers may block `hermes://` auto-navigation from a click; if the app
  doesn't open, right-click/copy the link and open it in the OS address bar.
- The app must be **installed** (develop runs don't claim the protocol
  handler). No app version requirement — the deep-link/force-reinstall doors
  this link uses exist in the current desktop builds.

**The link itself** (what it is, verified against the app's deep-link parser):

```
hermes://plugin-desktop/install?repo=barnacker/hermes_dark_studio&force=true
```

- `plugin-desktop` = desktop-plugin half only (this repo ships no agent/Python
  half, so the modal's desktop-box auto-checks and the agent-box auto-disables)
- `force=true` = replace the existing install instead of refusing (the updater)
- The modal shows **"View repository"** — review before installing.

**Or the classic way — `git clone` + installer (any OS):**

```powershell
git clone https://github.com/barnacker/hermes_dark_studio
.\hermes_dark_studio\dark-studio\install.ps1
```

**Or manually, any OS** — copy the plugin folder (name must stay `dark-studio`)
into the desktop app's home. That home is `$HERMES_HOME` if set, else
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

Open `dark-studio/plugin.js`, change a value in the `V` table, save. The app
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
