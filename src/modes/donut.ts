import { html, svg, TemplateResult } from 'lit';
import { computeDonutSegments } from '../compute';
import { Gender } from '../types';
import { ResolvedMetric } from '../metrics-resolver';
import { renderSilhouette } from '../silhouette';
import { renderHintIcon } from './hint';
import { renderTrendArrow } from './trend-arrow';
import { TrendDirection, TREND_ARROWS } from '../trend';

const RADIUS = 82;
const STROKE_WIDTH = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 4; // px gap rendered between adjacent ring segments
const CENTER_X = 230;
const CENTER_Y = 115;
const TOTAL_WIDTH = CENTER_X * 2;
const RING_LABEL_RADIUS = RADIUS + STROKE_WIDTH / 2 + 10;
// Same reasoning as callouts.ts: real label/value text needs real
// horizontal room, or it clips against the SVG's own viewBox.
const TEXT_MARGIN = 85;
const LINE_MARGIN = 95;
const ROW_SPACING = 32;
const TOP_MARGIN = 40;

interface Segment {
  key: 'water' | 'muscle' | 'fat' | 'bone' | 'other';
  label: string;
  pct: number;
  color: string;
  trend?: TrendDirection;
}

const SEGMENT_COLORS = {
  water: '#5b8def',
  muscle: '#5bd18b',
  fat: '#e6b85b',
  bone: '#e05b5b',
  other: '#8892a6',
};

/** Keys that feed the ring itself — excluded from the plain list below it. */
const RING_INPUT_KEYS = new Set(['water', 'water_mass_kg', 'body_fat', 'fat_mass', 'muscle_mass', 'muscle_mass_kg', 'bone_mass']);

function findRow(rows: ResolvedMetric[], key: string): ResolvedMetric | undefined {
  return rows.find((row) => row.key === key);
}

/** Resolves bone mass as a % of body weight, if it can be determined from what's configured. */
function resolveBonePct(rows: ResolvedMetric[]): number {
  const bone = findRow(rows, 'bone_mass');
  if (!bone) {
    return 0;
  }
  if (bone.unit === '%') {
    return bone.value;
  }
  const weight = findRow(rows, 'weight');
  if (weight && weight.value > 0) {
    return (bone.value / weight.value) * 100;
  }
  return 0;
}

/** Whether enough data is configured to render a meaningful ring at all. */
export function canRenderDonut(rows: ResolvedMetric[]): boolean {
  return !!findRow(rows, 'water') && !!findRow(rows, 'body_fat') && !!findRow(rows, 'muscle_mass');
}

function ringSegments(rows: ResolvedMetric[]): Segment[] {
  const waterRow = findRow(rows, 'water')!;
  const fatRow = findRow(rows, 'body_fat')!;
  const muscleRow = findRow(rows, 'muscle_mass')!;
  const boneRow = findRow(rows, 'bone_mass');
  const bonePct = resolveBonePct(rows);
  const s = computeDonutSegments(waterRow.value, muscleRow.value, fatRow.value, bonePct);

  const segments: Segment[] = [
    { key: 'water', label: 'Water', pct: s.water, color: SEGMENT_COLORS.water, trend: waterRow.trend },
    { key: 'muscle', label: 'Muscle', pct: s.muscle, color: SEGMENT_COLORS.muscle, trend: muscleRow.trend },
    { key: 'fat', label: 'Fat', pct: s.fat, color: SEGMENT_COLORS.fat, trend: fatRow.trend },
    { key: 'bone', label: 'Bone', pct: s.bone, color: SEGMENT_COLORS.bone, trend: boneRow?.trend },
    { key: 'other', label: 'Other', pct: s.other, color: SEGMENT_COLORS.other },
  ];
  return segments.filter((segment) => segment.pct > 0.05);
}

/** Point on a circle centered at (CENTER_X, CENTER_Y); 0° is straight up, increasing clockwise. */
function pointOnRing(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER_X + radius * Math.sin(rad), y: CENTER_Y - radius * Math.cos(rad) };
}

/** A 100% ring (water / muscle / fat / bone-if-known / remainder) with callout lines to each segment's value, around a centered silhouette. */
export function renderDonut(rows: ResolvedMetric[], gender: Gender): TemplateResult {
  const segments = ringSegments(rows);

  let offset = 0;
  const withAngles = segments.map((segment) => {
    const fraction = segment.pct / 100;
    const length = Math.max(0, fraction * CIRCUMFERENCE - GAP);
    const dashoffset = -offset;
    const midAngle = ((offset / CIRCUMFERENCE) * 360 + fraction * 180) % 360;
    offset += fraction * CIRCUMFERENCE;
    return { segment, length, dashoffset, angle: midAngle, point: pointOnRing(midAngle, RING_LABEL_RADIUS) };
  });

  // Which column a label goes in — and where within it — follows the
  // segment's actual position on the ring, not array order: otherwise a
  // segment on the ring's right side could get routed to a left-hand label,
  // producing a connector line that crosses awkwardly behind the ring.
  const left = withAngles.filter((item) => item.point.x < CENTER_X).sort((a, b) => a.point.y - b.point.y);
  const right = withAngles.filter((item) => item.point.x >= CENTER_X).sort((a, b) => a.point.y - b.point.y);
  const maxCount = Math.max(left.length, right.length, 1);
  const height = Math.max(CENTER_Y + RADIUS + STROKE_WIDTH + 30, TOP_MARGIN + maxCount * ROW_SPACING + 20);

  const yFor = (index: number, count: number) =>
    count <= 1 ? height / 2 : TOP_MARGIN + (index * (height - TOP_MARGIN - 20)) / (count - 1);

  const leftItems = left.map((item, i) => ({ ...item, labelY: yFor(i, left.length) }));
  const rightItems = right.map((item, i) => ({ ...item, labelY: yFor(i, right.length) }));

  const leftTextX = TEXT_MARGIN;
  const leftLineX = LINE_MARGIN;
  const rightTextX = TOTAL_WIDTH - TEXT_MARGIN;
  const rightLineX = TOTAL_WIDTH - LINE_MARGIN;

  const extraRows = rows.filter((row) => !RING_INPUT_KEYS.has(row.key));

  return html`
    <div class="donut-mode">
      <svg class="donut-ring" viewBox="0 0 ${TOTAL_WIDTH} ${height}">
        <g transform="translate(${CENTER_X}, ${CENTER_Y}) rotate(-90)">
          ${withAngles.map(
            ({ segment, length, dashoffset }) => svg`
              <circle
                r=${RADIUS}
                fill="none"
                stroke=${segment.color}
                stroke-width=${STROKE_WIDTH}
                stroke-dasharray="${length} ${CIRCUMFERENCE}"
                stroke-dashoffset=${dashoffset}
              ></circle>
            `,
          )}
        </g>
        <g transform="translate(${CENTER_X}, ${CENTER_Y}) scale(0.55) translate(-110, -115)">
          ${renderSilhouette(gender)}
        </g>
        ${leftItems.map(({ segment, point, labelY }) => {
          return svg`
            <line x1=${point.x} y1=${point.y} x2=${leftLineX} y2=${labelY} class="callout-line"></line>
            <circle cx=${point.x} cy=${point.y} r="3" fill=${segment.color}></circle>
            <text x=${leftTextX} y=${labelY - 4} class="callout-label" text-anchor="end">${segment.label}</text>
            <text x=${leftTextX} y=${labelY + 13} class="callout-value" text-anchor="end">
              ${segment.pct.toFixed(1)}%${segment.trend ? ` ${TREND_ARROWS[segment.trend]}` : ''}
            </text>
          `;
        })}
        ${rightItems.map(({ segment, point, labelY }) => {
          return svg`
            <line x1=${point.x} y1=${point.y} x2=${rightLineX} y2=${labelY} class="callout-line"></line>
            <circle cx=${point.x} cy=${point.y} r="3" fill=${segment.color}></circle>
            <text x=${rightTextX} y=${labelY - 4} class="callout-label" text-anchor="start">${segment.label}</text>
            <text x=${rightTextX} y=${labelY + 13} class="callout-value" text-anchor="start">
              ${segment.pct.toFixed(1)}%${segment.trend ? ` ${TREND_ARROWS[segment.trend]}` : ''}
            </text>
          `;
        })}
      </svg>
      ${extraRows.length
        ? html`
            <div class="donut-extra">
              ${extraRows.map(
                (row) => html`
                  <div class="row">
                    <span class="label">${row.label}${renderHintIcon(row.hint)}</span>
                    <span class="value">${row.formatted} ${row.unit} ${renderTrendArrow(row.trend)}</span>
                  </div>
                `,
              )}
            </div>
          `
        : ''}
    </div>
  `;
}
