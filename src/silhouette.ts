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
      // shoulders — the hourglass taper.
      torso: 'M86 50 Q110 42 134 50 L124 94 L140 122 L80 122 L96 94 Z',
      armLeft: 'M86 56 L60 98 L70 107 L92 72 Z',
      armRight: 'M134 56 L158 98 L148 107 L128 72 Z',
      // Legs meet close together under the wider hips, tapering to the feet.
      legLeft: 'M80 122 L85 216 L100 216 L104 130 Z',
      legRight: 'M140 122 L135 216 L118 216 L116 130 Z',
    };
  }
  return {
    headCx: 110,
    headCy: 27,
    headR: 16,
    // Broad, squared shoulders narrowing steadily to hips that stay
    // narrower than the shoulders — the opposite taper from the female
    // shape.
    torso: 'M79 52 Q110 41 141 52 L129 94 L134 122 L86 122 L91 94 Z',
    armLeft: 'M79 58 L50 100 L60 109 L88 72 Z',
    armRight: 'M141 58 L170 100 L160 109 L132 72 Z',
    // Legs set further apart under the narrower hips.
    legLeft: 'M86 122 L80 216 L100 216 L107 128 Z',
    legRight: 'M134 122 L140 216 L120 216 L113 128 Z',
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
