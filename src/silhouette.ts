import { svg, SVGTemplateResult } from 'lit';
import { Gender } from './types';

/**
 * Faceted (low-poly) body silhouette shared by all display modes. All
 * coordinates live in a fixed 220x230 viewBox so callers can position
 * callouts/rings against known anchor points.
 *
 * The torso is a hexagon fan-triangulated from a central point into six
 * wedges with alternating fill-opacity, giving the flat-shaded "cut gem"
 * look; arms and legs are each two-triangle quads built the same way. The
 * head stays a plain circle as a calm counterpoint to the faceted torso.
 *
 * Male and female differ in their shoulder/waist/hip proportions — the
 * classic "V-taper" (shoulders widest) vs. "hourglass" (hips widest, waist
 * narrowest) — the same convention used by most body-scale apps and public
 * signage. Every facet quad starts exactly on the neighboring part's
 * boundary (e.g. a leg's top edge reuses the torso hip line's own
 * endpoints) so there is no background sliver showing through at the seam.
 */
interface Facet {
  points: string;
  opacity: number;
}

export interface BodyShape {
  headCx: number;
  headCy: number;
  headR: number;
  facets: Facet[];
}

export const SILHOUETTE_VIEWBOX = '0 0 220 230';

export function bodyShape(gender: Gender): BodyShape {
  if (gender === 'female') {
    return {
      headCx: 110,
      headCy: 27,
      headR: 15,
      facets: [
        // Torso: six wedges fanned from a chest-height center point.
        { points: '110,85 86,52 134,52', opacity: 1 },
        { points: '110,85 134,52 124,94', opacity: 0.85 },
        { points: '110,85 124,94 140,122', opacity: 1 },
        { points: '110,85 140,122 80,122', opacity: 0.7 },
        { points: '110,85 80,122 96,94', opacity: 0.85 },
        { points: '110,85 96,94 86,52', opacity: 0.7 },
        // Arms: two triangles each, shoulder-to-hand.
        { points: '86,58 60,98 92,72', opacity: 0.85 },
        { points: '60,98 70,107 92,72', opacity: 1 },
        { points: '134,58 160,98 128,72', opacity: 0.85 },
        { points: '160,98 150,107 128,72', opacity: 1 },
        // Legs: four triangles each, hip-to-foot via a knee split.
        { points: '80,122 101,122 99,166', opacity: 1 },
        { points: '80,122 99,166 82,216', opacity: 0.7 },
        { points: '101,122 99,166 100,216', opacity: 0.85 },
        { points: '99,166 100,216 82,216', opacity: 0.7 },
        { points: '140,122 119,122 121,166', opacity: 1 },
        { points: '140,122 121,166 138,216', opacity: 0.7 },
        { points: '119,122 121,166 120,216', opacity: 0.85 },
        { points: '121,166 120,216 138,216', opacity: 0.7 },
      ],
    };
  }
  return {
    headCx: 110,
    headCy: 27,
    headR: 16,
    facets: [
      // Torso: six wedges fanned from a chest-height center point.
      { points: '110,90 79,54 141,54', opacity: 1 },
      { points: '110,90 141,54 129,94', opacity: 0.85 },
      { points: '110,90 129,94 134,122', opacity: 1 },
      { points: '110,90 134,122 86,122', opacity: 0.7 },
      { points: '110,90 86,122 91,94', opacity: 0.85 },
      { points: '110,90 91,94 79,54', opacity: 0.7 },
      // Arms: two triangles each, shoulder-to-hand.
      { points: '79,60 50,100 88,72', opacity: 0.85 },
      { points: '50,100 60,109 88,72', opacity: 1 },
      { points: '141,60 170,100 132,72', opacity: 0.85 },
      { points: '170,100 160,109 132,72', opacity: 1 },
      // Legs: four triangles each, hip-to-foot via a knee split.
      { points: '86,122 103,122 100,168', opacity: 1 },
      { points: '86,122 100,168 80,216', opacity: 0.7 },
      { points: '103,122 100,168 100,216', opacity: 0.85 },
      { points: '100,168 100,216 80,216', opacity: 0.7 },
      { points: '134,122 117,122 120,168', opacity: 1 },
      { points: '134,122 120,168 140,216', opacity: 0.7 },
      { points: '117,122 120,168 120,216', opacity: 0.85 },
      { points: '120,168 120,216 140,216', opacity: 0.7 },
    ],
  };
}

/** Renders the silhouette as a single-color group, positioned at the origin. */
export function renderSilhouette(gender: Gender, fill = 'var(--secondary-text-color, #8892a6)'): SVGTemplateResult {
  const b = bodyShape(gender);
  return svg`
    <g fill=${fill}>
      <circle cx=${b.headCx} cy=${b.headCy} r=${b.headR}></circle>
      ${b.facets.map((facet) => svg`<polygon points=${facet.points} fill-opacity=${facet.opacity}></polygon>`)}
    </g>
  `;
}
