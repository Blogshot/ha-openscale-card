import { html, svg, TemplateResult } from 'lit';
import { Gender } from '../types';
import { ResolvedMetric } from '../metrics-resolver';
import { renderSilhouette } from '../silhouette';
import { TREND_ARROWS } from '../trend';

/**
 * Silhouette in the center with callout lines fanning out to labeled values
 * on alternating sides. The anchor points are just evenly spaced down the
 * body for layout purposes — openScale-sync's measurements are whole-body,
 * not per-limb, so the lines intentionally don't claim any specific metric
 * "belongs" to a specific body part.
 */
export function renderCallouts(rows: ResolvedMetric[], gender: Gender): TemplateResult {
  const silhouetteOffsetX = 120;
  const rowSpacing = 34;
  const topMargin = 55;

  const left = rows.filter((_, i) => i % 2 === 0);
  const right = rows.filter((_, i) => i % 2 === 1);
  const maxCount = Math.max(left.length, right.length, 1);
  const height = Math.max(240, topMargin + maxCount * rowSpacing + 20);

  const yFor = (index: number, count: number) =>
    count <= 1 ? height / 2 : topMargin + (index * (height - topMargin - 20)) / (count - 1);

  const leftCallouts = left.map((row, i) => ({ row, y: yFor(i, left.length), anchorX: silhouetteOffsetX + 70 }));
  const rightCallouts = right.map((row, i) => ({ row, y: yFor(i, right.length), anchorX: silhouetteOffsetX + 150 }));

  return html`
    <svg class="callouts-mode" viewBox="0 0 460 ${height}">
      ${leftCallouts.map(
        ({ y, anchorX }) => svg`
          <line x1=${anchorX} y1=${y} x2="30" y2=${y} class="callout-line"></line>
        `,
      )}
      ${rightCallouts.map(
        ({ y, anchorX }) => svg`
          <line x1=${anchorX} y1=${y} x2="430" y2=${y} class="callout-line"></line>
        `,
      )}
      <g transform="translate(${silhouetteOffsetX}, 0)">${renderSilhouette(gender)}</g>
      ${leftCallouts.map(
        ({ row, y }) => svg`
          <text x="20" y=${y - 6} class="callout-label" text-anchor="end">${row.label}</text>
          <text x="20" y=${y + 12} class="callout-value" text-anchor="end">
            ${row.formatted} ${row.unit}${row.trend ? ` ${TREND_ARROWS[row.trend]}` : ''}
          </text>
        `,
      )}
      ${rightCallouts.map(
        ({ row, y }) => svg`
          <text x="440" y=${y - 6} class="callout-label" text-anchor="start">${row.label}</text>
          <text x="440" y=${y + 12} class="callout-value" text-anchor="start">
            ${row.formatted} ${row.unit}${row.trend ? ` ${TREND_ARROWS[row.trend]}` : ''}
          </text>
        `,
      )}
    </svg>
  `;
}
