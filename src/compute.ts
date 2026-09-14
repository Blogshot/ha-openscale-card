import { ACTIVITY_FACTORS, ActivityLevel } from './types';

/** Fat mass in kg, from total weight and body fat percentage. */
export function computeFatMass(weightKg: number, bodyFatPct: number): number {
  return weightKg * (bodyFatPct / 100);
}

/** Muscle mass in kg, from total weight and muscle percentage. */
export function computeMuscleMassKg(weightKg: number, musclePct: number): number {
  return weightKg * (musclePct / 100);
}

/** Water mass in kg (≈ liters), from total weight and total body water percentage. */
export function computeWaterMassKg(weightKg: number, waterPct: number): number {
  return weightKg * (waterPct / 100);
}

/** Lean body mass (fat-free mass) in kg. */
export function computeLbm(weightKg: number, bodyFatPct: number): number {
  return weightKg - computeFatMass(weightKg, bodyFatPct);
}

/** Body Mass Index. Requires height, which openScale-sync does not publish. */
export function computeBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

/**
 * Basal Metabolic Rate via the Katch-McArdle formula. Chosen over
 * Mifflin-St Jeor because it only needs lean body mass — which is already
 * derivable from openScale-sync's weight + body fat % — instead of height,
 * age and gender, and is considered more accurate when body fat % is known.
 */
export function computeBmr(lbmKg: number): number {
  return 370 + 21.6 * lbmKg;
}

/** Total Daily Energy Expenditure: BMR scaled by an activity (PAL) factor. */
export function computeTdee(bmrKcal: number, activityLevel: ActivityLevel): number {
  return bmrKcal * ACTIVITY_FACTORS[activityLevel];
}

export interface DonutSegments {
  water: number;
  muscle: number;
  fat: number;
  /** 0 when bone mass isn't separately known. */
  bone: number;
  /**
   * Whatever's left once water, muscle, fat and (if known) bone are
   * accounted for. Only ever non-zero when those four don't already reach
   * 100% on their own (see the overlap note below) — otherwise 0.
   */
  other: number;
}

/**
 * Splits body weight into water/muscle/fat/bone/other percentages that sum
 * to exactly 100%, for the donut display mode.
 *
 * openScale-sync's water %, muscle % and body fat % are not mutually
 * exclusive compartments — muscle tissue's own water content is counted in
 * both the water and muscle readings — so their sum routinely exceeds 100%
 * (e.g. 54.9 + 41.5 + 17.7 = 114.1). Rather than silently drop or cap one
 * reading, this scales all of them down proportionally whenever their sum
 * (plus bone, if known) is over 100%, preserving their relative sizes; when
 * the sum is under 100% instead, the gap is shown as `other`. `bonePct` is
 * optional since openScale-sync doesn't publish it — omit it to fold bone
 * mass into the water/muscle/fat scaling instead of showing it separately.
 */
export function computeDonutSegments(waterPct: number, musclePct: number, fatPct: number, bonePct = 0): DonutSegments {
  const rawSum = waterPct + musclePct + fatPct + bonePct;
  if (rawSum <= 100) {
    return { water: waterPct, muscle: musclePct, fat: fatPct, bone: bonePct, other: 100 - rawSum };
  }
  const scale = 100 / rawSum;
  return { water: waterPct * scale, muscle: musclePct * scale, fat: fatPct * scale, bone: bonePct * scale, other: 0 };
}
