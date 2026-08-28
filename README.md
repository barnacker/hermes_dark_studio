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
| `dark-studio/plugin.js` | The whole theme — one editable `V` table at the top, every hex annotated with its OBS origin (`Dark_Studio.obt` CSS var) and the element it paints. Register the theme + two ⌘K commands (apply, copy palette JSON). |
| `dark-studio/install.ps1` | One-shot install onto a Windows machine running the desktop app. |

## Install

**Windows (the usual case):**

```powershell
git clone https://github.com/barnacker/hermes_dark_studio
.\hermes_dark_studio\dark-studio\install.ps1
```

**Or manually, any OS** — copy the folder matching the plugin id into the
desktop app's home:

```bash
mkdir -p ~/.hermes/desktop-plugins/dark-studio
cp dark-studio/plugin.js ~/.hermes/desktop-plugins/dark-studio/
# macOS/Linux: if HERMES_HOME is set, copy there instead
```

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
- Errors/Stop: `danger`; statuses: `success` / `warning`
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
