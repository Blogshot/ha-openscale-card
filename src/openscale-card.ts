import { LitElement, html, css } from 'lit';
import './openscale-card-editor';
import {
  computeBmi,
  computeBmr,
  computeFatMass,
  computeLbm,
  computeMuscleMassKg,
  computeTdee,
  computeWaterMassKg,
} from './compute';
import {
  COMPUTED_METRIC_DECIMALS,
  COMPUTED_METRIC_UNITS,
  METRIC_LABELS,
  MetricKey,
  OpenscaleCardConfig,
} from './types';

interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
}

interface HomeAssistant {
  states: Record<string, HassEntity>;
}

type Metrics = OpenscaleCardConfig['metrics'];

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
 * OpenscaleCard
 *
 * Minimal fallback implementation: reads the entities configured under
 * `metrics` (or derives them, see compute.ts) and renders them as a plain
 * list. The schematic body-silhouette visualizations (callouts / grid /
 * donut display modes) are not implemented yet and will replace this
 * fallback view.
 */
export class OpenscaleCard extends LitElement {
  private hassObj?: HomeAssistant;
  private config?: OpenscaleCardConfig;

  static styles = css`
    .content {
      padding: 16px;
    }
    .notice {
      margin: 0 0 12px;
      font-size: 0.85em;
      opacity: 0.7;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px solid var(--divider-color, #eee);
    }
    .row:last-child {
      border-bottom: none;
    }
    .label {
      color: var(--secondary-text-color, #888);
    }
    .value {
      font-weight: 600;
    }
  `;

  setConfig(config: OpenscaleCardConfig): void {
    if (!config || !config.metrics) {
      throw new Error('Invalid configuration: "metrics" is required.');
    }
    this.config = {
      ...config,
      display_mode: config.display_mode ?? 'grid',
      gender: config.gender ?? 'male',
    };
  }

  set hass(hass: HomeAssistant) {
    this.hassObj = hass;
    this.requestUpdate();
  }

  getCardSize(): number {
    return 4;
  }

  static getConfigElement(): HTMLElement {
    return document.createElement('openscale-card-editor');
  }

  static getStubConfig(): OpenscaleCardConfig {
    return {
      type: 'custom:openscale-card',
      gender: 'male',
      display_mode: 'grid',
      metrics: {
        weight: {},
        body_fat: {},
        muscle_mass: {},
        water: {},
      },
    };
  }

  protected render() {
    if (!this.config || !this.hassObj) {
      return html``;
    }
    const config = this.config;
    const hassObj = this.hassObj;

    const entries = Object.entries(config.metrics) as [MetricKey, { entity?: string } | undefined][];

    const rows = entries
      .map(([key, metric]) => {
        if (!metric) {
          return null;
        }

        let displayValue: string;
        let unit: string;

        if (metric.entity) {
          const entity = hassObj.states[metric.entity];
          displayValue = entity ? entity.state : 'unavailable';
          unit = (entity?.attributes?.unit_of_measurement as string | undefined) ?? '';
        } else {
          const computed = resolveComputedValue(key, hassObj, config.metrics, config);
          if (computed === undefined) {
            return null;
          }
          const decimals = COMPUTED_METRIC_DECIMALS[key] ?? 1;
          displayValue = computed.toFixed(decimals);
          unit = COMPUTED_METRIC_UNITS[key] ?? '';
        }

        return html`
          <div class="row">
            <span class="label">${METRIC_LABELS[key]}</span>
            <span class="value">${displayValue} ${unit}</span>
          </div>
        `;
      })
      .filter((row) => row !== null);

    return html`
      <ha-card .header=${config.title ?? 'OpenScale'}>
        <div class="content">
          <p class="notice">
            Body silhouette visualization is not implemented yet in this early
            version — showing raw metric values instead.
          </p>
          ${rows}
        </div>
      </ha-card>
    `;
  }
}

customElements.define('openscale-card', OpenscaleCard);

interface CustomCardWindow extends Window {
  customCards?: Array<{ type: string; name: string; description: string }>;
}

const customCardWindow = window as CustomCardWindow;
customCardWindow.customCards = customCardWindow.customCards || [];
customCardWindow.customCards.push({
  type: 'openscale-card',
  name: 'OpenScale Card',
  description:
    'Displays openScale-sync body composition data as a schematic body silhouette.',
});
