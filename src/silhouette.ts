import { svg, SVGTemplateResult } from 'lit';
import { Gender } from './types';

/**
 * Simple, stylized body outline (not anatomically precise) shared by all
 * display modes. All coordinates live in a fixed 220x230 viewBox so callers
 * can position callouts/rings against known anchor points.
 *
 * Male and female differ in their shoulder/waist/hip proportions — the
 * classic "V-taper" (shoulders widest) vs. "hourglass" (hips widest, waist
 * narrowest) silhouette — which is the one detail that reliably reads as
 * male/female at pictogram size, the same convention used by most body-scale
 * apps and public signage.
 *
 * Each limb's edge that meets another part (leg-to-hip in particular) starts
 * exactly on that part's boundary rather than a few pixels inside it — with
 * quadratic curves, a limb outline that only approximately lines up leaves a
 * sliver of background showing through at the seam.
 */
export interface BodyShape {
  headCx: number;
  headCy: number;
  headR: number;
  torso: string;
  armLeft: string;
  armRight: string;
  legLeft: string;
  legRight: string;
}

export const SILHOUETTE_VIEWBOX = '0 0 220 230';

export function bodyShape(gender: Gender): BodyShape {
  if (gender === 'female') {
    return {
      headCx: 110,
      headCy: 27,
      headR: 15,
      // Shoulders narrower than the male shape but still proportionate, a
      // distinctly narrow waist, then hips flaring out wider than the
      // shoulders — the hourglass taper. Bottom edge (the hip line) is a
      // flat 80–140 span that the legs below attach to exactly.
      // The waist→hip curve's control point stays close to the waist's own
      // x rather than jumping straight toward the hip — matching the
      // curve's incoming direction at the waist so the two curves meet
      // smoothly there instead of visibly kinking at the narrowest point.
      torso: 'M86 52 Q90 42 110 42 Q130 42 134 52 Q126 74 124 94 Q122 108 140 122 L80 122 Q98 108 96 94 Q94 74 86 52 Z',
      armLeft: 'M86 58 Q73 76 60 98 Q65 104 70 107 Q82 89 92 72 Q89 65 86 58 Z',
      armRight: 'M134 58 Q147 76 160 98 Q155 104 150 107 Q138 89 128 72 Q131 65 134 58 Z',
      // Each leg's top edge is the straight segment "L<inner> 122", flush
      // with the torso's hip line above — the gap between the legs only
      // starts below that shared edge, not through it.
      legLeft: 'M80 122 L101 122 Q99 165 99 216 Q90 220 82 216 Q80 165 80 122 Z',
      legRight: 'M140 122 L119 122 Q121 165 121 216 Q130 220 138 216 Q140 165 140 122 Z',
    };
  }
  return {
    headCx: 110,
    headCy: 27,
    headR: 16,
    // Broad, squared shoulders narrowing steadily to hips that stay
    // narrower than the shoulders — the opposite taper from the female
    // shape. Bottom edge (the hip line) is a flat 86–134 span.
    torso: 'M79 54 Q84 42 110 42 Q136 42 141 54 Q133 76 129 94 Q133 110 134 122 L86 122 Q87 110 91 94 Q87 76 79 54 Z',
    armLeft: 'M79 60 Q65 78 50 100 Q55 106 60 109 Q75 90 88 72 Q83 66 79 60 Z',
    armRight: 'M141 60 Q155 78 170 100 Q165 106 160 109 Q145 90 132 72 Q137 66 141 60 Z',
    legLeft: 'M86 122 L103 122 Q100 165 100 216 Q90 220 80 216 Q82 165 86 122 Z',
    legRight: 'M134 122 L117 122 Q120 165 120 216 Q130 220 140 216 Q138 165 134 122 Z',
  };
}

/** Renders the silhouette as a single-color group, positioned at the origin. */
export function renderSilhouette(gender: Gender, fill = 'var(--secondary-text-color, #8892a6)'): SVGTemplateResult {
  const b = bodyShape(gender);
  return svg`
    <g fill=${fill}>
      <circle cx=${b.headCx} cy=${b.headCy} r=${b.headR}></circle>
      <path d=${b.torso}></path>
      <path d=${b.armLeft}></path>
      <path d=${b.armRight}></path>
      <path d=${b.legLeft}></path>
      <path d=${b.legRight}></path>
    </g>
  `;
}
