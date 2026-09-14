import { svg, SVGTemplateResult } from 'lit';
import { Gender } from './types';

/**
 * Simple, stylized body outline (not anatomically precise) shared by all
 * display modes. All coordinates live in a fixed 220x230 viewBox so callers
 * can position callouts/rings against known anchor points.
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
      headCy: 30,
      headR: 16,
      torso: 'M92 50 Q110 43 128 50 L134 112 Q110 126 86 112 Z',
      armLeft: 'M86 60 L60 100 L68 108 L92 70 Z',
      armRight: 'M134 60 L160 100 L152 108 L128 70 Z',
      legLeft: 'M92 112 L86 212 L102 212 L108 122 Q99 118 92 112 Z',
      legRight: 'M128 112 L134 212 L118 212 L112 122 Q121 118 128 112 Z',
    };
  }
  return {
    headCx: 110,
    headCy: 30,
    headR: 16,
    torso: 'M90 50 Q110 42 130 50 L136 112 Q110 124 84 112 Z',
    armLeft: 'M84 60 L58 100 L66 108 L90 70 Z',
    armRight: 'M136 60 L162 100 L154 108 L130 70 Z',
    legLeft: 'M88 112 L82 212 L100 212 L108 124 Z',
    legRight: 'M132 112 L138 212 L120 212 L112 124 Z',
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
