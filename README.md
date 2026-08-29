# Hermes Dark Studio

Hermes desktop theme derived from the [Dark Studio]
(https://github.com/barnacker/dark_studio) palette, tuned for the
Hermes desktop app.

The app paints its UI from CSS variables fed by a single `DesktopTheme`
object: a ~22-key `colors` block (surfaces, text ladder, borders, accent,
user message bubbles, destructive), optional `typography`, and an optional
terminal ANSI set for the app's integrated terminal pane. This theme is one
desktop plugin that registers that object; the app then lists **Dark Studio**
in Appearance and ⌘K exactly like a built-in.

## What's where

| File | Role |
|---|---|
| `plugin.js` | The whole theme. One editable `V` table at the top; every hex is annotated with the Dark Studio palette variable it traces to (`Dark_Studio.obt`) and the element it paints. Registers the theme plus two ⌘K commands (apply, copy palette JSON) plus the maroon composer field and red typed text (scoped CSS — no theme token reaches that element). |
| `install.ps1` | One-shot installer for Windows. |

## Install

One file to copy. Several ways to do it.

### Option A — clone and run the installer (Windows)

```powershell
git clone https://github.com/barnacker/hermes_dark_studio
cd hermes_dark_studio
.\install.ps1
```

That's it. The script copies `plugin.js` to the right place.

### Option B — copy the file by hand (any OS)

Copy the repo's `plugin.js` into a folder called
`hermes_dark_studio` inside your desktop app's plugins directory:

```
<hermes-home>/desktop-plugins/hermes_dark_studio/plugin.js
```

`<hermes-home>` is `$HERMES_HOME` if set, otherwise:

- Windows: `%LOCALAPPDATA%\hermes`
- macOS / Linux: `~/.hermes`

The app tells you the exact folder: **Settings → Plugins** shows the plugins
directory it loads from. That's the one to trust if it differs.

### Option C — in-app install (no terminal)

Copy this line:

```
hermes://plugin-desktop/install?repo=barnacker/hermes_dark_studio&force=true
```

Paste it into a browser's address bar and press Enter. If the desktop app is
running, it catches the link and opens its install dialog — you confirm, it
installs from `master`. (GitHub does not render `hermes://` links as
clickable, which is why it's shown as text to copy.)

### Finish, whichever option you used

1. **⌘K** (Windows: **Ctrl+K**) → **Reload desktop plugins** — only needed
   on the first install or when a plugin file changes
2. **⌘K** → **Theme: apply Dark Studio** — or pick it in **Appearance**

Done. The theme is stored per app (the desktop app's own setting), not on
the gateway — so a gateway on a remote box still controls model and tools,
but the look you applied lives on the machine running the app.

### Updating later

Same steps. Option A's installer overwrites; Option B is a fresh copy of the
file; Option C carries `force` so the dialog reinstalls over the current one.
Re-apply the theme in Appearance if the app doesn't refresh by itself.

## Editing

Open `plugin.js`, change a value in the `V` table, save. The plugin
hot-reloads; run the ⌘K apply command again to re-apply.

Map a detail you want to change:

- Composer / inputs: `card` (fill), `foreground` (text),
  `mutedForeground` (placeholder / disabled), `border` / `input`
  (idle outline), `composerRing` (focus ring)
- User message bubbles: `bubble`, `bubbleBorder`
- Sidebars: `sidebar`, `sidebarBackground`, `sidebarBorder`
- Menus, dropdowns, popovers: `popover`, `popoverForeground`
- Errors, Stop button: `danger` (there is no standalone status token in the
  theme model — status colors elsewhere live in the `ANSI` block)
- Composer field you type into: `composerField` (maroon, `--input_bg`) and
  `composerText` (red, `--input_text`) — applied by scoped CSS to the
  composer only, so other themes and other input fields are untouched
- Terminal pane: the `ANSI` block (the Dark Studio ramps, verbatim)

Keep every new value in `#RRGGBB` form. The app derives tinted surfaces,
the title bar, and contrast-safe foregrounds from these seeds, so one value
moves several related elements predictably — the comments name which.

## Notes

- `name: dark-studio` must not collide with a built-in desktop theme id
  (`nous`, `mono`, `slate`, `cyberpunk`, `midnight`, `ember`).
- Iosevka Term is first in the font stack for the Dark Studio look; where
  it isn't installed the stack falls through to system monospace.
- This repo is desktop-app theming only. The source palette lives in
  `barnacker/dark_studio`.
