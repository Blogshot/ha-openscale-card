import { html, svg, TemplateResult } from 'lit';
import { Gender } from '../types';
import { ResolvedMetric } from '../metrics-resolver';
import { renderSilhouette } from '../silhouette';
import { renderTrendTspan } from './trend-arrow';

// Real label/value text ("Muscle Mass", "2618 kcal ↑") needs real
// horizontal room — an SVG clips anything outside its own viewBox, so the
// text and line columns get a generous, fixed-width margin on each side
// rather than a few pixels borrowed from the silhouette's own span. Sized
// for the 36/40-unit label/value text set in openscale-card.ts's
// `.callouts-mode .callout-label/.callout-value` — enlarged to match the
// grid mode's real text size, so the margin grew to match.
const TEXT_MARGIN = 276;
const LINE_MARGIN = 300;
const SILHOUETTE_WIDTH = 220;
const SILHOUETTE_HEIGHT = 230; // matches SILHOUETTE_VIEWBOX in silhouette.ts
const SIDE_MARGIN = 576;
const TOTAL_WIDTH = SILHOUETTE_WIDTH + 2 * SIDE_MARGIN;
// A wider viewBox packed into the same rendered card width shrinks
// *everything* drawn in it, silhouette included — this scales the
// silhouette (and the points its callout lines start from) back up so it
// keeps roughly its original on-screen size instead of shrinking to make
// room for the bigger text around it.
const SILHOUETTE_SCALE = TOTAL_WIDTH / (SILHOUETTE_WIDTH + 2 * 200);
const SILHOUETTE_RENDER_WIDTH = SILHOUETTE_WIDTH * SILHOUETTE_SCALE;
const SILHOUETTE_RENDER_HEIGHT = SILHOUETTE_HEIGHT * SILHOUETTE_SCALE;
const SILHOUETTE_OFFSET_X = (TOTAL_WIDTH - SILHOUETTE_RENDER_WIDTH) / 2;
const ARROW_FONT_SIZE = 72;
const ARROW_TEXT_LENGTH = 50;

/**
 * Silhouette in the center with callout lines fanning out to labeled values
 * on alternating sides. The anchor points are just evenly spaced down the
 * body for layout purposes — openScale-sync's measurements are whole-body,
 * not per-limb, so the lines intentionally don't claim any specific metric
 * "belongs" to a specific body part.
 */
export function renderCallouts(rows: ResolvedMetric[], gender: Gender): TemplateResult {
  const rowSpacing = 110;
  const topMargin = 108;
  // The value line sits 36 units below its row's own y — the last row
  // needs that much room left before the viewBox's bottom edge, or its
  // value text renders partly outside it and gets clipped.
  const bottomMargin = 48;

  const left = rows.filter((_, i) => i % 2 === 0);
  const right = rows.filter((_, i) => i % 2 === 1);
  const maxCount = Math.max(left.length, right.length, 1);
  const height = Math.max(SILHOUETTE_RENDER_HEIGHT + bottomMargin, topMargin + maxCount * rowSpacing + bottomMargin);
  const silhouetteOffsetY = (height - SILHOUETTE_RENDER_HEIGHT) / 2;

  const yFor = (index: number, count: number) =>
    count <= 1 ? height / 2 : topMargin + (index * (height - topMargin - bottomMargin)) / (count - 1);

  const leftCallouts = left.map((row, i) => ({
    row,
    y: yFor(i, left.length),
    anchorX: SILHOUETTE_OFFSET_X + 70 * SILHOUETTE_SCALE,
  }));
  const rightCallouts = right.map((row, i) => ({
    row,
    y: yFor(i, right.length),
    anchorX: SILHOUETTE_OFFSET_X + 150 * SILHOUETTE_SCALE,
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
      <g transform="translate(${SILHOUETTE_OFFSET_X}, ${silhouetteOffsetY}) scale(${SILHOUETTE_SCALE})">${renderSilhouette(gender)}</g>
      ${leftCallouts.map(
        ({ row, y }) => svg`
          <text
            x=${leftTextX} y=${y - 18}
            class="callout-label ${row.hint ? 'has-hint' : ''}"
            text-anchor="end"
          >
            ${row.label}${row.hint ? svg`<title>${row.hint}</title>` : ''}
          </text>
          <text x=${leftTextX} y=${y + 36} class="callout-value" text-anchor="end">
            ${row.formatted} ${row.unit} ${renderTrendTspan(row.trend, row.trendQuality, ARROW_FONT_SIZE, ARROW_TEXT_LENGTH)}
          </text>
        `,
      )}
      ${rightCallouts.map(
        ({ row, y }) => svg`
          <text
            x=${rightTextX} y=${y - 18}
            class="callout-label ${row.hint ? 'has-hint' : ''}"
            text-anchor="start"
          >
            ${row.label}${row.hint ? svg`<title>${row.hint}</title>` : ''}
          </text>
          <text x=${rightTextX} y=${y + 36} class="callout-value" text-anchor="start">
            ${renderTrendTspan(row.trend, row.trendQuality, ARROW_FONT_SIZE, ARROW_TEXT_LENGTH)} ${row.formatted} ${row.unit}
          </text>
        `,
      )}
    </svg>
  `;
}
