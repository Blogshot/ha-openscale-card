import { html, svg, TemplateResult } from 'lit';
import { computeDonutSegments } from '../compute';
import { Gender } from '../types';
import { ResolvedMetric } from '../metrics-resolver';
import { renderSilhouette } from '../silhouette';
import { renderHintIcon } from './hint';
import { renderTrendArrow } from './trend-arrow';

const RADIUS = 82;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 4; // px gap rendered between adjacent ring segments

interface Segment {
  label: string;
  pct: number;
  color: string;
}

const SEGMENT_COLORS = {
  water: '#5b8def',
  other: '#5bd18b',
  fat: '#e6b85b',
  bone: '#e05b5b',
};

/** Keys that feed the ring itself or its "other" remainder — excluded from the extra list below it. */
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

/** Whether enough data is configured to render a meaningful donut at all. */
export function canRenderDonut(rows: ResolvedMetric[]): boolean {
  return !!findRow(rows, 'water') && !!findRow(rows, 'body_fat');
}

function ringSegments(rows: ResolvedMetric[]): Segment[] {
  const water = findRow(rows, 'water')!.value;
  const fat = findRow(rows, 'body_fat')!.value;
  const bone = resolveBonePct(rows);
  const s = computeDonutSegments(water, fat, bone);

  const segments: Segment[] = [
    { label: 'Water', pct: s.water, color: SEGMENT_COLORS.water },
    { label: 'Other lean mass', pct: s.other, color: SEGMENT_COLORS.other },
    { label: 'Fat', pct: s.fat, color: SEGMENT_COLORS.fat },
  ];
  if (s.bone > 0) {
    segments.push({ label: 'Bone', pct: s.bone, color: SEGMENT_COLORS.bone });
  }
  return segments.filter((segment) => segment.pct > 0);
}

/** 100% ring (water / fat / bone-if-known / remaining lean mass) around the silhouette. */
export function renderDonut(rows: ResolvedMetric[], gender: Gender): TemplateResult {
  const segments = ringSegments(rows);
  let offset = 0;
  const arcs = segments.map((segment) => {
    const length = Math.max(0, (segment.pct / 100) * CIRCUMFERENCE - GAP);
    const dashoffset = -offset;
    offset += (segment.pct / 100) * CIRCUMFERENCE;
    return svg`
      <circle
        r=${RADIUS}
        fill="none"
        stroke=${segment.color}
        stroke-width="16"
        stroke-dasharray="${length} ${CIRCUMFERENCE}"
        stroke-dashoffset=${dashoffset}
      ></circle>
    `;
  });

  const extraRows = rows.filter((row) => !RING_INPUT_KEYS.has(row.key));

  return html`
    <div class="donut-mode">
      <svg class="donut-ring" viewBox="0 0 200 200">
        <g transform="translate(100, 100) rotate(-90)">${arcs}</g>
        <g transform="translate(100, 100) scale(0.55) translate(-110, -115)">${renderSilhouette(gender)}</g>
      </svg>
      <div class="donut-legend">
        ${segments.map(
          (segment) => html`
            <div class="legend-row">
              <span class="dot" style="background:${segment.color}"></span>
              <span class="label">${segment.label}</span>
              <span class="value">${segment.pct.toFixed(1)}%</span>
            </div>
          `,
        )}
      </div>
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
