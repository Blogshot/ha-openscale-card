import { html, TemplateResult } from 'lit';
import { Gender } from '../types';
import { ResolvedMetric } from '../metrics-resolver';
import { renderSilhouette, SILHOUETTE_VIEWBOX } from '../silhouette';
import { renderHintIcon } from './hint';
import { renderTrendArrow } from './trend-arrow';

/** Silhouette + a plain metric list next to it. */
export function renderGrid(rows: ResolvedMetric[], gender: Gender): TemplateResult {
  return html`
    <div class="grid-mode">
      <svg class="grid-silhouette" viewBox=${SILHOUETTE_VIEWBOX}>${renderSilhouette(gender)}</svg>
      <div class="grid-rows">
        ${rows.map(
          (row) => html`
            <div class="row">
              <span class="label">${row.label}${renderHintIcon(row.hint)}</span>
              <span class="value">
                ${row.formatted} ${row.unit}
                ${renderTrendArrow(row.trend, row.trendQuality)}
              </span>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}
