export type Gender = 'male' | 'female';

export type DisplayMode = 'callouts' | 'grid' | 'donut';

export interface MetricRange {
  min?: number;
  max?: number;
}

export interface MetricConfig {
  entity: string;
  range?: MetricRange;
}

export const METRIC_KEYS = [
  'weight',
  'bmi',
  'body_fat',
  'water',
  'muscle_mass',
  'bone_mass',
  'visceral_fat',
  'bmr',
  'lbm',
  'waist',
  'hip',
] as const;

export type MetricKey = (typeof METRIC_KEYS)[number];

export const METRIC_LABELS: Record<MetricKey, string> = {
  weight: 'Weight',
  bmi: 'BMI',
  body_fat: 'Body Fat',
  water: 'Water',
  muscle_mass: 'Muscle Mass',
  bone_mass: 'Bone Mass',
  visceral_fat: 'Visceral Fat',
  bmr: 'BMR',
  lbm: 'Lean Body Mass',
  waist: 'Waist',
  hip: 'Hip',
};

export interface OpenscaleCardConfig {
  type: string;
  title?: string;
  gender?: Gender;
  display_mode?: DisplayMode;
  metrics: Partial<Record<MetricKey, MetricConfig>>;
}
