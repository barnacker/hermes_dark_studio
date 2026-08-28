/**
 * Dark Studio — Hermes desktop theme derived from the user's OBS theme
 * (github.com/barnacker/dark_studio, Dark_Studio.obt). Shipped in
 * github.com/barnacker/hermes_dark_studio — install per that repo's README.
 *
 * The `.obt` palette (CSS vars) maps onto the desktop DesktopTheme like this:
 *
 *   .obt var            →   DesktopTheme key          →   what it paints
 *   ─────────────────────────────────────────────────────────────────────────
 *   --bg_window #00040b →   background                →   app base
 *   --text_light        →   foreground                →   all body text,
 *       (#d6d6d6)           cardForeground            →     incl. composer text
 *   --white5 #ADADAD    →   mutedForeground           →   secondary/placeholder
 *   grey7 on bg         →   card                      →   composer/field glass
 *   --primary_lighter   →   ring / midground /        →   focus ring, selection,
 *       #ff8300               composerRing                streaming cursor
 *   --primary #13284b   →   userBubble                →   your message bubbles
 *   --blue4 #213E97     →   userBubbleBorder
 *   --grey6 #272A33     →   border / input /          →   all borders, idle
 *                               sidebarBorder           input outline
 *   --red3 #C01C37      →   destructive               →   Stop / error actions
 *
 * To tweak ANY detail: edit the VALUES table below and re-save — the plugin
 * hot-reloads and the ⌘K "Dark Studio" command re-registers the updated
 * theme (choose it again in Appearance to re-apply). Or ask the agent to
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
  // Surface ladder (dark). base → raised → floating.
  background: '#00040B',   // --bg_window
  card: '#090C13',         // grey7 mixed on bg — empty composer / fields
  muted: '#14161D',        // hover tints, disabled fills
  popover: '#12151C',      // grey8 — menus, dropdowns, popovers
  sidebar: '#04060C',      // bg lifted toward grey8 ~5%

  // Text ladder
  foreground: '#D6D6D6',   // --text_light (white3)
  secondaryText: '#ADADAD',// --white5
  disabledText: '#5B6273', // --grey1 — placeholders, tree connectors

  // Structure
  border: '#272A33',       // --grey6 — all idle borders/footer rules

  // Accent — --primary_lighter. Focus ring, active tab, selection,
  // streaming cursor, brand tools.
  accent: '#FF8300',
  accentDeep: '#221102',   // accent ~12% on bg — hover fills, active nav rows

  // Semantic
  danger: '#C01C37',       // --red3 (OBS --danger)
  success: '#25A231',      // --green3
  warning: '#B88A16',      // --warning (yellow3)

  // User message bubble — --primary / --blue4 (OBS selection)
  bubble: '#13284B',
  bubbleBorder: '#213E97',

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
  brightBlack: '#5B6273', // grey1
  brightRed: '#E85E75',    // red1
  brightGreen: '#59D966',  // green1
  brightYellow: '#EABC48', // yellow1
  brightBlue: '#718CDC',   // blue1
  brightMagenta: '#E5619A', // pink1
  brightCyan: '#3DBEF5',   // teal1
  brightWhite: '#EBEBEB',  // white2
}

// ─── The theme ────────────────────────────────────────────────────────────────
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
    input: V.border,
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
