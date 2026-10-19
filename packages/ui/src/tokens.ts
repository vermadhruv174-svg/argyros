/**
 * Argyros canonical design tokens.
 *
 * These are the single source of truth for all Argyros brand colours,
 * typography, spacing and motion values. Do not place Argyros business
 * logic in this package — tokens only.
 */

// ─── Colour palette ──────────────────────────────────────────────────────────

export const color = {
  /** Primary text colour — near-black graphite. */
  ink: '#171717',
  /** Primary background — warm ivory canvas. */
  paper: '#F8F6F1',
  /** Accent — antique gold. */
  gold: '#A6814C',
  /** Secondary accent — cool silver. */
  silver: '#C5C7C7',
  /** Divider / border — warm linen. */
  line: '#DEDAD2',
  /** Positive / success state — muted forest. */
  success: '#246A4F',
  /** Deep wine — used for dark sections. */
  wine: '#251C1B',
} as const;

export type ColorToken = keyof typeof color;

// ─── Typography ───────────────────────────────────────────────────────────────

export const font = {
  /** Display / editorial serif. Use for headings and brand wordmark. */
  display: 'Cormorant Garamond',
  /** Body / UI sans-serif. Use for body copy, labels, controls. */
  sans: 'Inter',
} as const;

export type FontToken = keyof typeof font;

// ─── Spacing (8px base grid) ─────────────────────────────────────────────────

export const space = {
  1: '0.5rem',   // 8px
  2: '1rem',     // 16px
  3: '1.5rem',   // 24px
  4: '2rem',     // 32px
  5: '2.5rem',   // 40px
  6: '3rem',     // 48px
  8: '4rem',     // 64px
  10: '5rem',    // 80px
  12: '6rem',    // 96px
  16: '8rem',    // 128px
} as const;

// ─── Layout ───────────────────────────────────────────────────────────────────

export const layout = {
  /** Maximum content width. */
  maxWidth: '1440px',
  /** Minimum touch target size (WCAG 2.2 AA). */
  touchTarget: '44px',
} as const;

// ─── Motion ───────────────────────────────────────────────────────────────────

export const motion = {
  /** Standard UI transition duration. */
  fast: '160ms',
  /** Standard product image / hero transition. */
  standard: '240ms',
  /** Easing for opacity and transform transitions. */
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ─── CSS custom property map ─────────────────────────────────────────────────

/**
 * Returns a CSS :root block containing all colour tokens as custom properties.
 * Import this string into a global stylesheet if not using Tailwind.
 */
export function cssVariables(): string {
  return `:root {
  --ink: ${color.ink};
  --paper: ${color.paper};
  --gold: ${color.gold};
  --silver: ${color.silver};
  --line: ${color.line};
  --success: ${color.success};
  --wine: ${color.wine};
}`;
}
