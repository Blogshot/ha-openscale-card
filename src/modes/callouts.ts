import { html, svg, TemplateResult } from 'lit';
import { Gender } from '../types';
import { ResolvedMetric } from '../metrics-resolver';
import { renderSilhouette } from '../silhouette';
import { TREND_ARROWS } from '../trend';

// Real label/value text ("Muscle Mass", "2618 kcal ↑") needs real
// horizontal room — an SVG clips anything outside its own viewBox, so the
// text and line columns get a generous, fixed-width margin on each side
// rather than a few pixels borrowed from the silhouette's own span.
const TEXT_MARGIN = 85;
const LINE_MARGIN = 95;
const SILHOUETTE_WIDTH = 220;
const TOTAL_WIDTH = SILHOUETTE_WIDTH + 2 * 200;
const SILHOUETTE_OFFSET_X = (TOTAL_WIDTH - SILHOUETTE_WIDTH) / 2;

/**
 * Silhouette in the center with callout lines fanning out to labeled values
 * on alternating sides. The anchor points are just evenly spaced down the
 * body for layout purposes — openScale-sync's measurements are whole-body,
 * not per-limb, so the lines intentionally don't claim any specific metric
 * "belongs" to a specific body part.
 */
export function renderCallouts(rows: ResolvedMetric[], gender: Gender): TemplateResult {
  const rowSpacing = 34;
  const topMargin = 55;

  const left = rows.filter((_, i) => i % 2 === 0);
  const right = rows.filter((_, i) => i % 2 === 1);
  const maxCount = Math.max(left.length, right.length, 1);
  const height = Math.max(240, topMargin + maxCount * rowSpacing + 20);

  const yFor = (index: number, count: number) =>
    count <= 1 ? height / 2 : topMargin + (index * (height - topMargin - 20)) / (count - 1);

  const leftCallouts = left.map((row, i) => ({
    row,
    y: yFor(i, left.length),
    anchorX: SILHOUETTE_OFFSET_X + 70,
  }));
  const rightCallouts = right.map((row, i) => ({
    row,
    y: yFor(i, right.length),
    anchorX: SILHOUETTE_OFFSET_X + 150,
  }));

  const leftTextX = TEXT_MARGIN;
  const leftLineX = LINE_MARGIN;
  const rightTextX = TOTAL_WIDTH - TEXT_MARGIN;
  const rightLineX = TOTAL_WIDTH - LINE_MARGIN;

  return html`
    <svg class="callouts-mode" viewBox="0 0 ${TOTAL_WIDTH} ${height}">
      ${leftCallouts.map(
        ({ y, anchorX }) => svg`
          <line x1=${anchorX} y1=${y} x2=${leftLineX} y2=${y} class="callout-line"></line>
        `,
      )}
      ${rightCallouts.map(
        ({ y, anchorX }) => svg`
          <line x1=${anchorX} y1=${y} x2=${rightLineX} y2=${y} class="callout-line"></line>
        `,
      )}
      <g transform="translate(${SILHOUETTE_OFFSET_X}, 0)">${renderSilhouette(gender)}</g>
      ${leftCallouts.map(
        ({ row, y }) => svg`
          <text
            x=${leftTextX} y=${y - 6}
            class="callout-label ${row.hint ? 'has-hint' : ''}"
            text-anchor="end"
          >
            ${row.label}${row.hint ? svg`<title>${row.hint}</title>` : ''}
          </text>
          <text x=${leftTextX} y=${y + 12} class="callout-value" text-anchor="end">
            ${row.formatted} ${row.unit}${row.trend ? ` ${TREND_ARROWS[row.trend]}` : ''}
          </text>
        `,
      )}
      ${rightCallouts.map(
        ({ row, y }) => svg`
          <text
            x=${rightTextX} y=${y - 6}
            class="callout-label ${row.hint ? 'has-hint' : ''}"
            text-anchor="start"
          >
            ${row.label}${row.hint ? svg`<title>${row.hint}</title>` : ''}
          </text>
          <text x=${rightTextX} y=${y + 12} class="callout-value" text-anchor="start">
            ${row.formatted} ${row.unit}${row.trend ? ` ${TREND_ARROWS[row.trend]}` : ''}
          </text>
        `,
      )}
    </svg>
  `;
}
