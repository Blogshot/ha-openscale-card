import {
  computeBmi,
  computeBmr,
  computeFatMass,
  computeLbm,
  computeMuscleMassKg,
  computeTdee,
  computeWaterMassKg,
} from './compute';
import { COMPUTED_METRIC_DECIMALS, COMPUTED_METRIC_UNITS, METRIC_HINTS, METRIC_LABELS, MetricKey, OpenscaleCardConfig } from './types';
import { TrendDirection, TrendTracker } from './trend';

export interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  /** Present on the real `hass` object; used to seed a trend baseline from history, see trend.ts. */
  callApi?: (method: string, path: string) => Promise<unknown>;
}

type Metrics = OpenscaleCardConfig['metrics'];

export interface ResolvedMetric {
  key: MetricKey;
  label: string;
  /** Numeric value, used for trend comparisons and mode-specific math. */
  value: number;
  /** Display string — preserves the source entity's own formatting when there is one. */
  formatted: string;
  unit: string;
  trend?: TrendDirection;
  /** Shown as a hover hint — explains acronyms like BMR/TDEE/BMI/LBM. */
  hint?: string;
}

function readNumber(hassObj: HomeAssistant, metrics: Metrics, key: MetricKey): number | undefined {
  const entityId = metrics[key]?.entity;
  if (!entityId) {
    return undefined;
  }
  const entity = hassObj.states[entityId];
  if (!entity) {
    return undefined;
  }
  const value = parseFloat(entity.state);
  return Number.isFinite(value) ? value : undefined;
}

/**
 * Resolves a metric that has no configured entity by deriving it from other
 * configured metrics. Returns undefined when the inputs it needs aren't
 * available, in which case the row is simply omitted.
 */
function resolveComputedValue(
  key: MetricKey,
  hassObj: HomeAssistant,
  metrics: Metrics,
  config: OpenscaleCardConfig,
): number | undefined {
  const weight = readNumber(hassObj, metrics, 'weight');
  const bodyFat = readNumber(hassObj, metrics, 'body_fat');
  const lbm = weight !== undefined && bodyFat !== undefined ? computeLbm(weight, bodyFat) : undefined;

  switch (key) {
    case 'fat_mass':
      return weight !== undefined && bodyFat !== undefined
        ? computeFatMass(weight, bodyFat)
        : undefined;
    case 'muscle_mass_kg': {
      const muscle = readNumber(hassObj, metrics, 'muscle_mass');
      return weight !== undefined && muscle !== undefined
        ? computeMuscleMassKg(weight, muscle)
        : undefined;
    }
    case 'water_mass_kg': {
      const water = readNumber(hassObj, metrics, 'water');
      return weight !== undefined && water !== undefined
        ? computeWaterMassKg(weight, water)
        : undefined;
    }
    case 'lbm':
      return lbm;
    case 'bmi':
      return weight !== undefined && config.height_cm
        ? computeBmi(weight, config.height_cm)
        : undefined;
    case 'bmr':
      return lbm !== undefined ? computeBmr(lbm) : undefined;
    case 'tdee': {
      const bmr = lbm !== undefined ? computeBmr(lbm) : undefined;
      return bmr !== undefined && config.activity_level
        ? computeTdee(bmr, config.activity_level)
        : undefined;
    }
    default:
      return undefined;
  }
}

/**
 * Resolves every metric listed in `config.metrics` into a display-ready
 * value (entity-backed, or computed — see resolveComputedValue), skipping
 * ones whose value isn't available yet. Also updates `tracker` and attaches
 * a trend direction when a prior value exists for that metric.
 */
export function resolveMetricRows(
  hassObj: HomeAssistant,
  config: OpenscaleCardConfig,
  tracker: TrendTracker,
): ResolvedMetric[] {
  const entries = Object.entries(config.metrics) as [MetricKey, { entity?: string } | undefined][];
  const rows: ResolvedMetric[] = [];

  for (const [key, metric] of entries) {
    if (!metric) {
      continue;
    }

    let value: number;
    let formatted: string;
    let unit: string;

    if (metric.entity) {
      const entity = hassObj.states[metric.entity];
      const parsed = entity ? parseFloat(entity.state) : NaN;
      if (!entity || !Number.isFinite(parsed)) {
        continue;
      }
      value = parsed;
      formatted = entity.state;
      unit = (entity.attributes?.unit_of_measurement as string | undefined) ?? '';
    } else {
      const computed = resolveComputedValue(key, hassObj, config.metrics, config);
      if (computed === undefined) {
        continue;
      }
      value = computed;
      formatted = computed.toFixed(COMPUTED_METRIC_DECIMALS[key] ?? 1);
      unit = COMPUTED_METRIC_UNITS[key] ?? '';
    }

    rows.push({
      key,
      label: METRIC_LABELS[key],
      value,
      formatted,
      unit,
      trend:
        metric.entity && typeof hassObj.callApi === 'function'
          ? tracker.update(key, value, { hass: { callApi: hassObj.callApi.bind(hassObj) }, entityId: metric.entity })
          : tracker.update(key, value),
      hint: METRIC_HINTS[key],
    });
  }

  return rows;
}
