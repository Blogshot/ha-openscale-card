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
