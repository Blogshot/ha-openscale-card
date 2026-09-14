import { html, TemplateResult } from 'lit';

/**
 * Small "ⓘ" indicator with a native tooltip, shown next to acronym labels
 * (BMI, BMR, TDEE, LBM) so it's clear what they stand for. Renders nothing
 * when the metric has no hint.
 */
export function renderHintIcon(hint: string | undefined): TemplateResult | '' {
  if (!hint) {
    return '';
  }
  return html`<span class="hint-icon" title=${hint}>ⓘ</span>`;
}
