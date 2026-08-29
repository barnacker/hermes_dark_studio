/**
 * Dark Studio — Hermes desktop theme from the Dark Studio palette
 * (github.com/barnacker/dark_studio). Shipped in
 * github.com/barnacker/hermes_dark_studio — install per that repo's README.
 *
 * ONE plugin does everything: it registers the full DesktopTheme into
 * Appearance (THEMES_AREA) AND injects the per-element overrides no
 * DesktopThemeColors token reaches — the maroon composer field and its red
 * typed text (--input_bg / --input_text; the composer fill is mixed from
 * the global `card` token), the navy fill + hover on every filled button
 * (--button_bg / --button_bg_hover; button paints are 5% accent-mixes, not
 * tokens; labels use the foreground — --palette_buttonText), and the navy
 * selected-row fill (--list_item_bg_selected; rows paint a token-mix var).
 *
 * The palette (CSS vars) maps onto the desktop DesktopTheme like this:
 *
 *   palette var         →   DesktopTheme key          →   what it paints
 *   ─────────────────────────────────────────────────────────────────────────
 *   --bg_window           →   background                →   app base  (swapped
 *       #04030a (sidebar)                              →   with sidebar)
 *   (was #00040b)        →   sidebar                   →   working rail
 *   --text #ff8300      →   foreground /            →   all body text,
 *                                cardForeground          incl. my output
 *   --yellow3 #B88A16
 *       (warmed)          →   mutedForeground         →   secondary/dim,
 *                                #A06222                 placeholders, tree rules
 *   near-black lifted     →   card / muted            →   raised surfaces,
 *   (warm) --primary         (navy, selection)     →   userBubble → your messages
 *   --blue4 #213E97     →   userBubbleBorder
 *   --widget_headers
 *       #300f00           →   border / input          →   all borders, idle
 *                               (warm brown,           input outlines
 *                                not cool grey)
 *   --input_text
 *       #db0000           →   ring / midground /      →   focus ring, selection,
 *                                composerRing             streaming cursor
 *   --input_text #db0000  →   destructive             →   Stop / error actions
 *   --input_bg #170700    →   scoped: --composer-fill →   composer field ONLY
 *   --input_text #db0000  →   scoped: composer text   →   your typed text ONLY
 *   (none — white #fff)   →   scoped: --shimmer-color →   Thinking label's
 *                                   moving streak (SHIMMER_CSS)
 *   --button_bg #0d1a32   →   scoped: button bg       →   filled buttons (default
 *                          + secondary)
 *   --button_bg_hover
 *       #152e55           →   scoped: button hover
 *   --text #ff8300        →   scoped: button label    →   on the navy fill
 *   --button_bg
 *       #0d1a32           →   scoped: row-active var  →   selected nav rows
 *   --button_bg_hover     →   scoped: row hover vars  →   nav/row hover (+ settings
 *       #152e55               rows): --ui-row-hover-  →   the same light blue as
 *                              background + --chrome-      the button hover
 *                              action-hover
 *   --button_bg
 *       #0d1a32           →   scoped: settings active →   Settings section rows
 *                              row fill + border-off   (overlay nav); the
 *                              (NAV_PANEL_CSS)           boxed border is removed
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
  background: '#00040B',   // the chat field (darkest surface)
  card: '#0A0806',         // warm near-black, lifted from bg — raised surfaces
  muted: '#141109',        // hover tints, disabled fills (warm)
  popover: '#12100B',      // grey8, warm — menus, dropdowns, popovers
  sidebar: '#0A0806',      // = card (warm lift) — rail reads lighter than chat

  // Text ladder
  foreground: '#FF8300',   // --text (label/output amber) — all body text
  secondaryText: '#A06222', // warm dim (--yellow3 warmed) — secondary, placeholder

  // Structure
  border: '#300F00',       // --widget_headers (warm brown), NOT cool grey6

  // Accent — red (value of --input_text). Focus ring, active tab,
  // selection, streaming cursor, brand tools.
  accent: '#DB0000',
  accentDeep: '#221102',   // accent ~12% on bg — hover fills, active nav rows

  // Semantic
  danger: '#DB0000',       // --input_text red, same as accent — Stop / error actions

  // User message bubble — warm brown, raised surface
  bubble: '#300F00',
  bubbleBorder: '#213E97',

  // Composer field — the input pair. These are the two values a theme token
  // CANNOT reach (composer fill is mixed from the global `card`), so they are
  // injected as scoped CSS in register() below, confined to the composer.
  composerField: '#170700', // --input_bg (maroon)
  composerText: '#DB0000',  // --input_text (red)

  // Filled buttons (variant="default" + "secondary") — the button pair. Their
  // backgrounds are NOT gated by theme tokens (default = bg-primary, secondary
  // = a 5% accent-mix), so scoped CSS, same as the composer. default/secondary
  // labels are the theme foreground (--palette_buttonText = --text). The
  // destructive variant (Stop/error) is left to the red token.
  buttonBg: '#0D1A32',      // --button_bg
  buttonBgHover: '#152E55', // --button_bg_hover

  // Selected nav rows (sidebar sessions, file trees, messaging, MCP tab)
  // and the Settings section rows — --button_bg, the darker of the blue
  // pair (hover stays --button_bg_hover #152E55). Rows paint the
  // token-mixed --ui-row-active-background var, so a scoped :root
  // override (NAV_CSS) repoints it; row classes and animations stay
  // untouched. The softer "open pane" band derives from the same var
  // (28% of it).
  navSelected: '#0D1A32',   // --button_bg (darker blue of the button pair)

  // Font — Dark Studio uses IosevkaTerm Nerd Font for everything. Missing
  // locally it falls back; install for the true look (nerdfonts.com →
  // IosevkaTerm: run the installer):
  font: '"IosevkaTerm Nerd Font", "SF Mono", Menlo, system-ui, sans-serif',
  fontMono: '"IosevkaTerm Nerd Font Mono", Menlo, "Courier New", monospace',
}

// ─── Terminal ANSI — the Dark Studio ramps used verbatim (middle ramp
//     normal, bright ramp bright) so the terminal matches the theme. ────────
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
// token in the desktop model, so those ramp values live only in ANSI.
const theme = {
  name: NAME,
  label: LABEL,
  description: 'Dark room look — from the Dark Studio palette',
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

// The two input values no theme token can express. Scoped to the composer
// subtree so they affect ONLY the field you type in, never other themes'
// inputs or the app's other cards. `--composer-fill` drives the field surface
// (styles.css mixes it from `card` for the global case); overriding it on the
// composer root repoints that fill to the maroon. The editor text slot gets
// the red; `!important` beats the global text-foreground stamp.
const COMPOSER_CSS = `
  [data-slot='composer-root'] {
    --composer-fill: ${V.composerField} !important;
  }
  [data-slot='composer-rich-input'] {
    color: ${V.composerText} !important;
  }
`

// Filled buttons — the button pair. `[data-slot='button']` covers every
// Button; the variant selector keeps outline/ghost/text/link (no solid
// paint) out of scope while default + secondary get the navy fill. Labels
// on the navy fill use the theme foreground (--palette_buttonText = --text)
// — default/secondary classes set primary-foreground, which is near-black
// and unreadable on navy. Attribute selectors (0-2-0) outscore the utility
// classes (0-1-0), so no !important is needed.
const BUTTON_CSS = `
  [data-slot='button'][data-variant='default'],
  [data-slot='button'][data-variant='secondary'] {
    background-color: ${V.buttonBg};
    color: ${V.foreground};
  }
  [data-slot='button'][data-variant='default']:hover:not(:disabled),
  [data-slot='button'][data-variant='secondary']:hover:not(:disabled) {
    background-color: ${V.buttonBgHover};
  }
`

// Selected rows — sidebar session rows, file trees, messaging, and the MCP
// tab all paint the selected row from --ui-row-active-background, a var the
// theme mixes from tokens (no theme key can set a solid hex in it). Every
// selected row in the app reads that one var, so this :root override is the
// single choke point; row classes and their transitions stay untouched. The
// softer "open pane" band (--ui-row-open-background, derived at 28%) follows
// it automatically.
const NAV_CSS = `
  :root {
    --ui-row-active-background: ${V.navSelected} !important;
  }
`

// Row hover, everywhere rows ride — the sidebar row class reads
// --ui-row-hover-background, every other row/control hover reads
// --chrome-action-hover (which aliases --ui-control-hover-background).
// Both are token-mixed 4-8% accent washes by default, which reads as a dark
// warm dip — repointing them at the light button-hover blue makes every
// hover-in one coherent color, and hovering a NAVY SELECTED row now
// LIGHTENS instead of dipping to dark (active #0D1A32 → hover #152E55,
// the same blue pair as the filled buttons).
const ROW_HOVER_CSS = `
  :root {
    --ui-row-hover-background: ${V.buttonBgHover} !important;
    --chrome-action-hover: ${V.buttonBgHover} !important;
  }
`

// Settings (and every other overlay side nav) — OverlayNavItem marks the
// active non-nested row with a box: border-(--ui-stroke-tertiary) +
// bg-(--ui-bg-tertiary). The border var is shared by ~20 unrelated frames
// (artifact cards, table rules, dividers) so it can't be recolored at
// :root; the row itself is the target. Every overlay nav is wrapped in
// [data-tour='overlay-nav'] (the app's own addressing hook) and its active
// row is the only one whose class carries the tertiary-fill utility — that
// pair scopes to the active row alone: solid navy fill, box removed, and a
// light hover state — the ACTIVE row's own class list carries no hover
// utility (app design: only inactive rows get one), so without this rule the
// selected row never responds to the mouse.
// --ui-bg-tertiary is deliberately left GLOBAL (21 consumers).
const NAV_PANEL_CSS = `
  [data-tour='overlay-nav'] button[class*='bg-(--ui-bg-tertiary)'] {
    background-color: ${V.navSelected};
    border-color: transparent;
  }
  [data-tour='overlay-nav'] button[class*='bg-(--ui-bg-tertiary)']:hover {
    background-color: ${V.buttonBgHover};
  }
`

// Code foreground, everywhere monospace output rides in chat — inline `code`
// and fenced blocks alike. Verified render chain (markdown-text.tsx:454-462,
// styles.css:1869/1482): messages wrap in [data-slot='aui_assistant-message-content'],
// markdown is .aui-md; the app's styles.css paints inline code with a
// white-ish foreground var at (0-3-2) specificity — only !important on the
// identical selector beats it. Fenced blocks: Shiki emits inline-styled
// token spans (github-dark-dimmed via light-dark()), likewise !important-only;
// the un-highlighted fallback text inherits from the pre.
const CODE_CSS = `
  [data-slot='aui_assistant-message-content'] .aui-md :not(pre) > code {
    color: ${V.accent} !important;
  }
  [data-slot='aui_assistant-message-content'] .aui-md pre,
  [data-slot='aui_assistant-message-content'] .aui-md pre * {
    color: ${V.accent} !important;
  }
`

// Thinking indicator: the amber "shimmer" streak the user reads as yellow is
// the tw-shimmer lib lightening currentColor (~40%) into a gold streak. Its
// own knob --shimmer-color drives the moving streak; setting it white leaves
// motion params and every other shimmer consumer untouched. Verified:
// message-parts.tsx:233 (label span gets .shimmer only while pending, inside
// the data-slot='aui_thinking-disclosure' container).
const SHIMMER_CSS = `
  [data-slot='aui_thinking-disclosure'] {
    --shimmer-color: #FFFFFF;
  }
`

function injectComposerCss() {
  if (typeof document === 'undefined') return
  // A stale <style> from an earlier build — drop it so only the new one remains
  const legacy = document.getElementById('dark-studio-composer')
  if (legacy) legacy.remove()
  let style = document.getElementById('dark-studio-scoped')
  if (!style) {
    style = document.createElement('style')
    style.id = 'dark-studio-scoped'
    document.head.appendChild(style)
  }
  // Idempotent — hot reload re-runs register; rewrite the rules in place.
  style.textContent =
    COMPOSER_CSS + BUTTON_CSS + NAV_CSS + ROW_HOVER_CSS + NAV_PANEL_CSS + CODE_CSS + SHIMMER_CSS
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
  description: 'Desktop theme from the Dark Studio palette (barnacker/dark_studio)',
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
        keywords: ['theme', 'dark', 'studio', 'apply', 'switch'],
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
