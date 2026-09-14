import { LitElement, html, css } from 'lit';
import { METRIC_LABELS, MetricKey, OpenscaleCardConfig } from './types';

interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
}

interface HomeAssistant {
  states: Record<string, HassEntity>;
}

/**
 * OpenscaleCard
 *
 * Minimal fallback implementation: reads the entities configured under
 * `metrics` and renders them as a plain list. The schematic body-silhouette
 * visualizations (callouts / grid / donut display modes) are not implemented
 * yet and will replace this fallback view.
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

  protected render() {
    if (!this.config || !this.hassObj) {
      return html``;
    }

    const entries = Object.entries(this.config.metrics) as [
      MetricKey,
      { entity: string } | undefined,
    ][];

    const rows = entries
      .filter((entry): entry is [MetricKey, { entity: string }] => !!entry[1]?.entity)
      .map(([key, metric]) => {
        const entity = this.hassObj!.states[metric.entity];
        const value = entity ? entity.state : 'unavailable';
        const unit = (entity?.attributes?.unit_of_measurement as string | undefined) ?? '';
        return html`
          <div class="row">
            <span class="label">${METRIC_LABELS[key]}</span>
            <span class="value">${value} ${unit}</span>
          </div>
        `;
      });

    return html`
      <ha-card .header=${this.config.title ?? 'OpenScale'}>
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
