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
  return html`<span class="trend trend-${quality}">${TREND_ARROWS[trend]}</span>`;
}

/**
 * Same as `renderTrendArrow`, but as an SVG `<tspan>` for use inside a
 * `<text>` element (the donut ring and callout labels are SVG, not HTML —
 * a plain `<span>` there would just render as literal text, and coloring it
 * needs `fill`, not `color`; the CSS for `.trend-good`/`.trend-bad`/
 * `.trend-neutral` sets both).
 */
export function renderTrendTspan(trend: TrendDirection | undefined, quality: TrendQuality = 'neutral'): SVGTemplateResult | typeof nothing {
  if (!trend) {
    return nothing;
  }
  return svg` <tspan class="trend trend-${quality}">${TREND_ARROWS[trend]}</tspan>`;
}
