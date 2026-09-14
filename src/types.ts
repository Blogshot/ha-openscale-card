export type Gender = 'male' | 'female';

export type DisplayMode = 'callouts' | 'grid' | 'donut';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

/** PAL (Physical Activity Level) factors used to derive TDEE from BMR. */
export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export interface MetricRange {
  min?: number;
  max?: number;
}

export interface MetricConfig {
  /**
   * Source entity for this metric. Omit (use `{}`) for metrics the card can
   * derive itself from other configured metrics — see `computeMetric` in
   * compute.ts for which ones support this and what they require.
   */
  entity?: string;
  range?: MetricRange;
}

export const METRIC_KEYS = [
  // Metrics actually published by openScale-sync via MQTT.
  'weight',
  'body_fat',
  'water',
  'muscle_mass',
  // Not published by openScale-sync; only usable if sourced elsewhere.
  'bone_mass',
  'visceral_fat',
  'waist',
  'hip',
  // Derived metrics: computed by the card when no entity is configured.
  'bmi',
  'lbm',
  'fat_mass',
  'muscle_mass_kg',
  'water_mass_kg',
  'bmr',
  'tdee',
] as const;

export type MetricKey = (typeof METRIC_KEYS)[number];

export const METRIC_LABELS: Record<MetricKey, string> = {
  weight: 'Weight',
  body_fat: 'Body Fat',
  water: 'Water',
  muscle_mass: 'Muscle Mass',
  bone_mass: 'Bone Mass',
  visceral_fat: 'Visceral Fat',
  waist: 'Waist',
  hip: 'Hip',
  bmi: 'BMI',
  lbm: 'LBM',
  fat_mass: 'Fat Mass',
  muscle_mass_kg: 'Muscle Mass',
  water_mass_kg: 'Water Mass',
  bmr: 'BMR',
  tdee: 'TDEE',
};

/**
 * Explains what an acronym metric actually stands for — shown as a hover
 * hint next to the label, since "BMR" or "TDEE" alone isn't self-evident.
 */
export const METRIC_HINTS: Partial<Record<MetricKey, string>> = {
  bmi: 'Body Mass Index — weight relative to height (weight ÷ height²).',
  lbm: 'Lean Body Mass — total weight minus fat mass.',
  bmr: 'Basal Metabolic Rate — calories your body burns at complete rest.',
  tdee: 'Total Daily Energy Expenditure — BMR scaled by your activity level.',
};

/** Units for metrics the card computes itself (raw entities use their own unit_of_measurement). */
export const COMPUTED_METRIC_UNITS: Partial<Record<MetricKey, string>> = {
  bmi: '',
  lbm: 'kg',
  fat_mass: 'kg',
  muscle_mass_kg: 'kg',
  water_mass_kg: 'kg',
  bmr: 'kcal',
  tdee: 'kcal',
};

/** Decimal places used when formatting a computed metric's value. */
export const COMPUTED_METRIC_DECIMALS: Partial<Record<MetricKey, number>> = {
  bmi: 1,
  lbm: 1,
  fat_mass: 1,
  muscle_mass_kg: 1,
  water_mass_kg: 1,
  bmr: 0,
  tdee: 0,
};

export interface OpenscaleCardConfig {
  type: string;
  title?: string;
  gender?: Gender;
  display_mode?: DisplayMode;
  /** Body height in cm. Only needed to derive BMI. */
  height_cm?: number;
  /** Only needed to derive TDEE from BMR. */
  activity_level?: ActivityLevel;
  metrics: Partial<Record<MetricKey, MetricConfig>>;
}
