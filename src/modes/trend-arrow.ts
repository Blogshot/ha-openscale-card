import { html, nothing, TemplateResult } from 'lit';
import { TrendDirection, TREND_ARROWS } from '../trend';

/**
 * Renders a small trend arrow, or nothing when there's no prior value to
 * compare against yet (first render after adding the card / restarting HA).
 */
export function renderTrendArrow(trend: TrendDirection | undefined): TemplateResult | typeof nothing {
  if (!trend) {
    return nothing;
  }
  return html`<span class="trend trend-${trend}">${TREND_ARROWS[trend]}</span>`;
}
