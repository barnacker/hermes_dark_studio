/**
 * Dark Studio — Hermes desktop theme derived from the user's OBS theme
 * (github.com/barnacker/dark_studio, Dark_Studio.obt). Shipped in
 * github.com/barnacker/hermes_dark_studio — install per that repo's README.
 *
 * ONE plugin does everything: it registers the full DesktopTheme into
 * Appearance (THEMES_AREA) AND injects the two per-element overrides a
 * theme token can't express — the maroon composer field and its red typed
 * text (OBS --input_bg / --input_text), which no DesktopThemeColors key
 * reaches (the composer fill is mixed from the global `card` token).
 *
 * The `.obt` palette (CSS vars) maps onto the desktop DesktopTheme like this:
 *
 *   .obt var            →   DesktopTheme key          →   what it paints
 *   ─────────────────────────────────────────────────────────────────────────
 *   --bg_window #00040b →   background                →   app base
 *   --text #ff8300      →   foreground /            →   all body text,
 *                                cardForeground          incl. my output
 *   --yellow3 #B88A16
 *       (warmed)          →   mutedForeground         →   secondary/dim,
 *                                #A06222                 placeholders, tree rules
 *   near-black lifted     →   card / muted            →   raised surfaces,
 *   (warm) --primary         (navy, OBS selection) →   userBubble → your messages
 *   --blue4 #213E97     →   userBubbleBorder
 *   --widget_headers
 *       #300f00           →   border / input          →   all borders, idle
 *                               (warm brown,           input outlines
 *                                not cool grey)
 *   --primary_lighter
 *       #ff8300           →   ring / midground /      →   focus ring, selection,
 *                                composerRing             streaming cursor
 *   --danger #C01C37      →   destructive             →   Stop / error actions
 *   --input_bg #170700    →   scoped: --composer-fill →   composer field ONLY
 *   --input_text #db0000  →   scoped: composer text   →   your typed text ONLY
 *
 * To tweak ANY detail: edit the VALUES table below and re-save — the plugin
 * hot-reloads and the ⌘K "Dark Studio" command re-registers the updated
 * theme (pick it again in Appearance to re-apply). The two scoped composer
 * values live at the bottom of the table (COMPOSER). Or ask the agent to
 * change a value / add a key.
 *
 * NOTE: name must not collide with a built-in desktop theme
 * (mono/slate/cyberpunk/nous/midnight/ember).
 */

import { PALETTE_AREA, THEMES_AREA, host, requestTheme } from '@hermes/plugin-sdk'

const ID = 'dark-studio'
const NAME = 'dark-studio'
const LABEL = 'Dark Studio'

// ─── Editable values ──────────────────────────────────────────────────────────
const V = {
  // Surface ladder (dark). base → raised → floating. Kept near-black; the warm
  // identity comes from borders + the composer, not from every card.
  background: '#00040B',   // --bg_window
  card: '#0A0806',         // warm near-black, lifted from bg — raised surfaces
  muted: '#141109',        // hover tints, disabled fills (warm)
  popover: '#12100B',      // grey8, warm — menus, dropdowns, popovers
  sidebar: '#04030A',      // bg deepened ~5% — the working rail

  // Text ladder
  foreground: '#FF8300',   // --text (OBS label/output amber) — all body text
  secondaryText: '#A06222', // warm dim (--yellow3 warmed) — secondary, placeholder

  // Structure
  border: '#300F00',       // --widget_headers (warm brown), NOT cool grey6

  // Accent — --primary_lighter. Focus ring, active tab, selection,
  // streaming cursor, brand tools.
  accent: '#FF8300',
  accentDeep: '#221102',   // accent ~12% on bg — hover fills, active nav rows

  // Semantic
  danger: '#C01C37',       // --red3 (OBS --danger) — Stop / error actions

  // User message bubble — --primary / --blue4 (OBS selection)
  bubble: '#13284B',
  bubbleBorder: '#213E97',

  // Composer field — OBS input pair. These are the two values a theme token
  // CANNOT reach (composer fill is mixed from the global `card`), so they are
  // injected as scoped CSS in register() below, confined to the composer.
  composerField: '#170700', // --input_bg (maroon)
  composerText: '#DB0000',  // --input_text (red)

  // Font — OBS uses IosevkaTerm Nerd Font for everything. Missing locally it
  // falls back; install for the true look:
  //   download IosevkaTerm (nerdfonts.com) → ~/.local/share/fonts, fc-cache -r
  font: '"Iosevka Term", "Iosevka", "SF Mono", Menlo, system-ui, sans-serif',
  fontMono: '"Iosevka Term", "Iosevka", Menlo, "Courier New", monospace',
}

// ─── Terminal ANSI — the OBS ramps used verbatim (middle ramp normal,
//     bright ramp bright) so the integrated terminal matches OBS. ─────────────
const ANSI = {
  foreground: V.foreground,
  cursor: V.accent,
  selectionBackground: '#1A3278', // --blue5
  black: '#464B59',     // grey3
  red: '#E33B57',       // red2
  green: '#25A231',     // green3
  yellow: '#B88A16',    // yellow3
  blue: '#476BD7',      // blue2
  magenta: '#9E1A53',   // pink4
  cyan: '#0981B4',      // teal3
  white: '#C2C2C2',     // white4
  brightBlack: '#A06222', // warm dim
  brightRed: '#E85E75',    // red1
  brightGreen: '#59D966',  // green1
  brightYellow: '#EABC48', // yellow1
  brightBlue: '#718CDC',   // blue1
  brightMagenta: '#E5619A', // pink1
  brightCyan: '#3DBEF5',   // teal1
  brightWhite: '#EBEBEB',  // white2
}

// ─── The theme ────────────────────────────────────────────────────────────────
// Every key below is a real DesktopThemeColors token (apps/desktop/src/themes/
// types.ts). No dead keys: there is no `success` / `warning` / `disabledText`
// token in the desktop model, so those OBS ramp values live only in ANSI.
const theme = {
  name: NAME,
  label: LABEL,
  description: 'Dark room look — from the Dark Studio OBS theme',
  colors: {
    background: V.background,
    foreground: V.foreground,
    card: V.card,
    cardForeground: V.foreground,
    muted: V.muted,
    mutedForeground: V.secondaryText,
    popover: V.popover,
    popoverForeground: V.foreground,
    primary: V.accent,
    primaryForeground: '#0A0A0A',
    secondary: V.accentDeep,
    secondaryForeground: V.foreground,
    accent: V.accentDeep,
    accentForeground: V.foreground,
    border: V.border,
    input: V.border,           // idle input outline — warm brown, matches chrome
    ring: V.accent,
    midground: V.accent,
    midgroundForeground: '#0A0A0A',
    composerRing: V.accent,
    destructive: V.danger,
    destructiveForeground: '#FFFFFF',
    sidebarBackground: V.sidebar,
    sidebarBorder: V.border,
    userBubble: V.bubble,
    userBubbleBorder: V.bubbleBorder,
  },
  typography: {
    fontSans: V.font,
    fontMono: V.fontMono,
  },
  terminal: ANSI,
}

// The two OBS input values no theme token can express. Scoped to the composer
// subtree so they affect ONLY the field you type in, never other themes'
// inputs or the app's other cards. `--composer-fill` drives the field surface
// (styles.css mixes it from `card` for the global case); overriding it on the
// composer root repoints that fill to the OBS maroon. The editor text slot gets
// the OBS red; `!important` beats the global text-foreground stamp.
const COMPOSER_CSS = `
  [data-slot='composer-root'] {
    --composer-fill: ${V.composerField} !important;
  }
  [data-slot='composer-rich-input'] {
    color: ${V.composerText} !important;
  }
`
const COMPOSER_STYLE_ID = 'dark-studio-composer'

function injectComposerCss() {
  if (typeof document === 'undefined') return
  let style = document.getElementById(COMPOSER_STYLE_ID)
  if (!style) {
    style = document.createElement('style')
    style.id = COMPOSER_STYLE_ID
    document.head.appendChild(style)
  }
  // Idempotent — hot reload re-runs register; rewrite the rule in place.
  style.textContent = COMPOSER_CSS
}

// Minimal shape check (mirrors the app's validator) so a bad edit can't
// shadow the real theme with junk.
const REQUIRED = ['background', 'foreground', 'primary']
if (typeof theme.name !== 'string' || typeof theme.label !== 'string' ||
    !REQUIRED.every(k => typeof theme.colors[k] === 'string')) {
  console.error(`[dark-studio] theme failed shape check — not registered`)
}

export default {
  id: ID,
  name: LABEL,
  description: 'Desktop theme derived from the Dark Studio OBS theme (barnacker/dark_studio)',
  register(ctx) {
    injectComposerCss()

    ctx.register({
      id: 'theme',
      area: THEMES_AREA,
      data: theme,
    })

    ctx.register({
      id: 'apply',
      area: PALETTE_AREA,
      data: {
        id: 'dark-studio.apply',
        label: 'Theme: apply Dark Studio',
        keywords: ['theme', 'dark', 'studio', 'obs', 'apply', 'switch'],
        run: () => {
          const ok = requestTheme(NAME)
          if (!ok) {
            host.notify({ kind: 'error', message: 'Dark Studio theme not registered yet' })
            return
          }
          host.notify({ kind: 'info', message: 'Dark Studio applied' })
        },
      },
    })

    ctx.register({
      id: 'copy',
      area: PALETTE_AREA,
      data: {
        id: 'dark-studio.copy',
        label: 'Theme: copy Dark Studio palette JSON',
        keywords: ['theme', 'dark', 'studio', 'copy', 'json', 'palette'],
        run: () => {
          void navigator.clipboard
            ?.writeText(JSON.stringify(theme, null, 2))
            .then(() => host.notify({ kind: 'info', message: 'Dark Studio palette JSON copied' }))
        },
      },
    })
  },
}
