import { html, nothing, svg, SVGTemplateResult, TemplateResult } from 'lit';
import { TrendDirection, TrendQuality, TREND_ARROWS } from '../trend';

/**
 * Renders a small trend arrow, or nothing when there's no prior value to
 * compare against yet (first render after adding the card / restarting HA).
 * The glyph (↑/↓/→) always reflects raw direction; the color reflects
 * `quality` instead — good/bad relative to a configured goal, or neutral
 * when no goal is set. Direction and color are deliberately independent:
 * rising muscle mass is a desirable "up", rising body fat usually isn't.
 */
export function renderTrendArrow(trend: TrendDirection | undefined, quality: TrendQuality = 'neutral'): TemplateResult | typeof nothing {
  if (!trend) {
    return nothing;
  }
  return html`<span class="trend trend-lg trend-${quality}">${TREND_ARROWS[trend]}</span>`;
}

/**
 * Same as `renderTrendArrow`, but as an SVG `<tspan>` for use inside a
 * `<text>` element (the donut ring and callout labels are SVG, not HTML —
 * a plain `<span>` there would just render as literal text, and coloring it
 * needs `fill`, not `color`; the CSS for `.trend-good`/`.trend-bad`/
 * `.trend-neutral` sets both).
 *
 * `font-size` is set as a presentation attribute rather than through the
 * shared `.trend-lg` class: an SVG element with a `viewBox` scales every
 * coordinate — including text in user units — by however much the viewBox
 * is stretched to fit the card's actual rendered width, so a CSS pixel
 * value that looks right on the HTML arrow renders far smaller here. This
 * value is tuned by eye against the surrounding 13-unit label text, not
 * meant to visually match the HTML version's exact pixel size.
 *
 * `textLength`/`lengthAdjust` pin the glyph to a fixed rendered width —
 * ↑/↓/→ aren't the same width in any real font, so without this, a
 * `text-anchor="end"` row's value shifts left or right by however much
 * narrower or wider that render's specific arrow happens to be, and the
 * numbers across rows stop lining up in a column.
 */
export function renderTrendTspan(trend: TrendDirection | undefined, quality: TrendQuality = 'neutral'): SVGTemplateResult | typeof nothing {
  if (!trend) {
    return nothing;
  }
  return svg` <tspan class="trend trend-${quality}" font-size="22" textLength="16" lengthAdjust="spacingAndGlyphs">${TREND_ARROWS[trend]}</tspan>`;
}
