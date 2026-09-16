import { LitElement, html, css } from 'lit';
import './openscale-card-editor';
import { HomeAssistant, resolveMetricRows } from './metrics-resolver';
import { canRenderDonut, renderDonut } from './modes/donut';
import { renderCallouts } from './modes/callouts';
import { renderGrid } from './modes/grid';
import { TrendTracker } from './trend';
import { OpenscaleCardConfig } from './types';

/**
 * OpenscaleCard
 *
 * Reads the entities configured under `metrics` (or derives them, see
 * compute.ts / metrics-resolver.ts) and renders them as a schematic body
 * silhouette in one of three display modes: `grid` (silhouette + value
 * list), `callouts` (silhouette with pointer lines to values) or `donut`
 * (a 100% body-composition ring around the silhouette).
 */
export class OpenscaleCard extends LitElement {
  private hassObj?: HomeAssistant;
  private config?: OpenscaleCardConfig;
  private trendTracker = new TrendTracker();

  static styles = css`
    .content {
      padding: 16px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;
      border-bottom: 1px solid var(--divider-color, #eee);
    }
    .row:last-child {
      border-bottom: none;
    }
    .label {
      color: var(--secondary-text-color, #888);
    }
    .hint-icon {
      margin-left: 3px;
      cursor: help;
      opacity: 0.65;
      font-size: 0.85em;
    }
    .value {
      font-weight: 600;
    }
    .trend {
      margin-left: 6px;
      font-weight: 700;
      line-height: 1;
      vertical-align: middle;
    }
    /*
     * Only the HTML <span> version (grid rows, donut-extra rows) — an SVG
     * <tspan> sets its own font-size and width, see trend-arrow.ts. A fixed
     * width keeps the glyph centered in the same box regardless of
     * ↑/↓/→'s own (different) natural width, e.g. so a row's trailing
     * arrow doesn't nudge the value text beside it left or right depending
     * on which direction happens to be showing.
     */
    .trend-lg {
      display: inline-block;
      width: 1.2em;
      font-size: 32px;
      text-align: center;
    }
    /*
     * Colored by quality (good/bad relative to a configured goal), not by
     * raw up/down direction — rising muscle mass is desirable, rising body
     * fat usually isn't, and only a goal can tell those apart. Both "color"
     * (the .trend <span> in grid/donut-extra) and "fill" (the .trend
     * <tspan> inside callouts/donut-ring SVG text) are set on the same
     * rule since either property is simply ignored where it doesn't apply.
     */
    .trend-good {
      color: var(--success-color, #43a047);
      fill: var(--success-color, #43a047);
    }
    .trend-bad {
      color: var(--error-color, #db4437);
      fill: var(--error-color, #db4437);
    }
    /* A real change with no goal configured to judge it — still worth flagging as movement, just not as good/bad. */
    .trend-moved {
      color: var(--info-color, #039be5);
      fill: var(--info-color, #039be5);
    }
    /* No real change since the last reading — nothing to flag at all. */
    .trend-neutral {
      color: var(--secondary-text-color, #888);
      fill: var(--secondary-text-color, #888);
    }

    /* Grid mode */
    .grid-mode {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .grid-silhouette {
      width: 90px;
      height: auto;
      flex-shrink: 0;
    }
    .grid-rows {
      flex: 1;
      min-width: 0;
    }

    /* Callouts mode */
    .callouts-mode {
      width: 100%;
      height: auto;
    }
    .callout-line {
      stroke: var(--divider-color, #bbb);
      stroke-width: 1;
    }
    .callout-label {
      font-size: 11px;
      fill: var(--secondary-text-color, #888);
    }
    .callout-label.has-hint {
      text-decoration: underline dotted;
      cursor: help;
    }
    .callout-value {
      font-size: 13px;
      font-weight: 600;
      fill: var(--primary-text-color, #222);
    }
    /* Callouts mode has much more room around the silhouette than the donut ring, so its label/value text scales up to match the grid mode's real (HTML) text size. */
    .callouts-mode .callout-label {
      font-size: 44px;
    }
    .callouts-mode .callout-value {
      font-size: 48px;
    }

    /* Donut mode */
    .donut-mode {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .donut-ring {
      width: 100%;
      height: auto;
    }
    .donut-extra {
      width: 100%;
      margin-top: 8px;
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
    this.trendTracker = new TrendTracker(() => this.requestUpdate());
  }

  set hass(hass: HomeAssistant) {
    this.hassObj = hass;
    this.requestUpdate();
  }

  getCardSize(): number {
    switch (this.config?.display_mode) {
      case 'callouts':
        return 6;
      case 'donut':
        return 6;
      default:
        return 4;
    }
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
    const gender = config.gender ?? 'male';
    const rows = resolveMetricRows(this.hassObj, config, this.trendTracker);

    const mode = config.display_mode ?? 'grid';
    const body =
      mode === 'donut' && canRenderDonut(rows)
        ? renderDonut(rows, gender)
        : mode === 'callouts'
          ? renderCallouts(rows, gender)
          : renderGrid(rows, gender);

    return html`
      <ha-card .header=${config.title ?? 'OpenScale'}>
        <div class="content">${body}</div>
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
