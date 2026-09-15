import { LitElement, html, css } from 'lit';
import { ACTIVITY_FACTORS, COMPUTED_METRIC_UNITS, MetricKey, OpenscaleCardConfig } from './types';

interface HomeAssistant {
  states: Record<string, { state: string; attributes: Record<string, unknown> }>;
}

interface FormSchemaEntry {
  name: string;
  label?: string;
  selector: Record<string, unknown>;
}

interface ValueChangedEvent<T> extends CustomEvent {
  detail: { value: T };
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const DISPLAY_MODE_OPTIONS = [
  { value: 'grid', label: 'Grid' },
  { value: 'callouts', label: 'Callouts' },
  { value: 'donut', label: 'Donut (needs body fat %, water % and muscle mass %)' },
];

const ACTIVITY_LEVEL_OPTIONS = Object.keys(ACTIVITY_FACTORS).map((value) => ({
  value,
  label: value
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' '),
}));

const GENERAL_SCHEMA: FormSchemaEntry[] = [
  { name: 'title', selector: { text: {} } },
  { name: 'gender', label: 'Gender', selector: { select: { mode: 'dropdown', options: GENDER_OPTIONS } } },
  {
    name: 'display_mode',
    label: 'Display mode',
    selector: { select: { mode: 'dropdown', options: DISPLAY_MODE_OPTIONS } },
  },
  {
    name: 'height_cm',
    label: 'Height in cm (only needed for BMI)',
    selector: { number: { min: 50, max: 250, mode: 'box' } },
  },
  {
    name: 'activity_level',
    label: 'Activity level (only needed for TDEE)',
    selector: { select: { mode: 'dropdown', options: ACTIVITY_LEVEL_OPTIONS } },
  },
];

interface EntityFieldDef {
  key: MetricKey;
  field: string;
  label: string;
}

/** Raw metrics: the user points each one at a source entity. */
const ENTITY_METRIC_FIELDS: EntityFieldDef[] = [
  { key: 'weight', field: 'weight_entity', label: 'Weight' },
  { key: 'body_fat', field: 'body_fat_entity', label: 'Body fat' },
  { key: 'muscle_mass', field: 'muscle_mass_entity', label: 'Muscle mass' },
  { key: 'water', field: 'water_entity', label: 'Water' },
  { key: 'bone_mass', field: 'bone_mass_entity', label: 'Bone mass (not published by openScale-sync)' },
  { key: 'visceral_fat', field: 'visceral_fat_entity', label: 'Visceral fat (not published by openScale-sync)' },
  { key: 'waist', field: 'waist_entity', label: 'Waist (not published by openScale-sync)' },
  { key: 'hip', field: 'hip_entity', label: 'Hip (not published by openScale-sync)' },
];

const ENTITY_METRICS_SCHEMA: FormSchemaEntry[] = ENTITY_METRIC_FIELDS.map(({ field, label }) => ({
  name: field,
  label,
  selector: { entity: { domain: 'sensor' } },
}));

interface ComputedFieldDef {
  key: MetricKey;
  field: string;
  label: string;
}

/** Derived metrics: the user just enables/disables them, no entity needed. */
const COMPUTED_METRIC_FIELDS: ComputedFieldDef[] = [
  { key: 'bmi', field: 'show_bmi', label: 'BMI' },
  { key: 'lbm', field: 'show_lbm', label: 'Lean body mass' },
  { key: 'fat_mass', field: 'show_fat_mass', label: 'Fat mass (kg)' },
  { key: 'muscle_mass_kg', field: 'show_muscle_mass_kg', label: 'Muscle mass (kg)' },
  { key: 'water_mass_kg', field: 'show_water_mass_kg', label: 'Water mass (kg)' },
  { key: 'bmr', field: 'show_bmr', label: 'BMR' },
  { key: 'tdee', field: 'show_tdee', label: 'TDEE' },
];

const COMPUTED_METRICS_SCHEMA: FormSchemaEntry[] = COMPUTED_METRIC_FIELDS.map(({ field, label }) => ({
  name: field,
  label,
  selector: { boolean: {} },
}));

interface GoalFieldDef {
  key: MetricKey;
  label: string;
}

interface GoalCategory {
  title: string;
  fields: GoalFieldDef[];
}

/**
 * Groups percentage and kg-mass variants of the same thing (e.g. `body_fat`
 * and `fat_mass`) under one heading instead of listing them as two
 * unrelated-looking rows — that's what read as duplicated. "Percentage" /
 * "Mass" as field labels rely on the surrounding category heading for
 * context; standalone metrics keep a self-explanatory label instead.
 */
const GOAL_CATEGORIES: GoalCategory[] = [
  { title: 'Weight', fields: [{ key: 'weight', label: 'Weight' }] },
  {
    title: 'Fat',
    fields: [
      { key: 'body_fat', label: 'Percentage' },
      { key: 'fat_mass', label: 'Mass' },
    ],
  },
  {
    title: 'Muscle',
    fields: [
      { key: 'muscle_mass', label: 'Percentage' },
      { key: 'muscle_mass_kg', label: 'Mass' },
    ],
  },
  {
    title: 'Water',
    fields: [
      { key: 'water', label: 'Percentage' },
      { key: 'water_mass_kg', label: 'Mass' },
    ],
  },
  { title: 'Bone', fields: [{ key: 'bone_mass', label: 'Bone Mass' }] },
  {
    title: 'Other',
    fields: [
      { key: 'visceral_fat', label: 'Visceral Fat' },
      { key: 'waist', label: 'Waist' },
      { key: 'hip', label: 'Hip' },
      { key: 'bmi', label: 'BMI' },
      { key: 'lbm', label: 'LBM' },
      { key: 'bmr', label: 'BMR' },
      { key: 'tdee', label: 'TDEE' },
    ],
  },
];

/**
 * Visual editor for OpenscaleCard, shown in the Lovelace card-config dialog.
 * Uses three separate <ha-form> instances (general settings, raw sensor
 * entities, computed-metric toggles) rather than one schema for the whole
 * config, since `metrics` needs its own flatten/unflatten step that doesn't
 * fit a single flat ha-form data object.
 */
export class OpenscaleCardEditor extends LitElement {
  private hassObj?: HomeAssistant;
  private config?: OpenscaleCardConfig;

  static styles = css`
    .section-title {
      font-weight: 600;
      margin: 20px 0 8px;
    }
    .section-title:first-child {
      margin-top: 0;
    }
    .section-hint {
      margin: 0 0 8px;
      font-size: 12.5px;
      color: var(--secondary-text-color, #888);
    }
    .section-subtitle {
      font-weight: 500;
      font-size: 13px;
      color: var(--secondary-text-color, #888);
      margin: 12px 0 2px;
    }
    .section-subtitle:first-of-type {
      margin-top: 4px;
    }
    ha-form {
      display: block;
      margin-bottom: 8px;
    }
  `;

  setConfig(config: OpenscaleCardConfig): void {
    this.config = config;
  }

  set hass(hass: HomeAssistant) {
    this.hassObj = hass;
    this.requestUpdate();
  }

  private get _generalData() {
    const c = this.config!;
    return {
      title: c.title ?? '',
      gender: c.gender ?? 'male',
      display_mode: c.display_mode ?? 'grid',
      height_cm: c.height_cm,
      activity_level: c.activity_level,
    };
  }

  private get _entityMetricsData(): Record<string, string | undefined> {
    const metrics = this.config!.metrics;
    const data: Record<string, string | undefined> = {};
    for (const { key, field } of ENTITY_METRIC_FIELDS) {
      data[field] = metrics[key]?.entity;
    }
    return data;
  }

  private get _computedMetricsData(): Record<string, boolean> {
    const metrics = this.config!.metrics;
    const data: Record<string, boolean> = {};
    for (const { key, field } of COMPUTED_METRIC_FIELDS) {
      data[field] = !!metrics[key];
    }
    return data;
  }

  /** The unit shown inside a goal field — the real unit_of_measurement for entity-backed metrics, the fixed one for computed metrics. */
  private _unitFor(key: MetricKey): string {
    const entityId = this.config!.metrics[key]?.entity;
    if (entityId) {
      return (this.hassObj?.states[entityId]?.attributes?.unit_of_measurement as string | undefined) ?? '';
    }
    return COMPUTED_METRIC_UNITS[key] ?? '';
  }

  /** Only the categories that have at least one currently-configured metric, each narrowed to just those fields. */
  private get _goalCategoriesInUse(): GoalCategory[] {
    const metrics = this.config!.metrics;
    return GOAL_CATEGORIES.map((category) => ({
      ...category,
      fields: category.fields.filter((f) => !!metrics[f.key]),
    })).filter((category) => category.fields.length > 0);
  }

  private _goalsSchemaFor(fields: GoalFieldDef[]): FormSchemaEntry[] {
    return fields.map(({ key, label }) => ({
      name: `goal_${key}`,
      label,
      selector: { number: { mode: 'box', unit_of_measurement: this._unitFor(key) } },
    }));
  }

  private _goalsDataFor(fields: GoalFieldDef[]): Record<string, number | undefined> {
    const metrics = this.config!.metrics;
    const data: Record<string, number | undefined> = {};
    for (const { key } of fields) {
      data[`goal_${key}`] = metrics[key]?.goal;
    }
    return data;
  }

  private _goalsChangedFor(fields: GoalFieldDef[]) {
    return (ev: ValueChangedEvent<Record<string, number | undefined>>) => {
      if (!this.config) {
        return;
      }
      const value = ev.detail.value;
      const metrics = { ...this.config.metrics };
      for (const { key } of fields) {
        const goal = value[`goal_${key}`];
        if (goal === undefined || goal === null) {
          const rest = { ...metrics[key] };
          delete rest.goal;
          metrics[key] = rest;
        } else {
          metrics[key] = { ...metrics[key], goal };
        }
      }
      this._fireConfigChanged({ ...this.config, metrics });
    };
  }

  private _computeLabel = (schema: FormSchemaEntry) => schema.label ?? schema.name;

  private _fireConfigChanged(config: OpenscaleCardConfig) {
    this.config = config;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _generalChanged = (ev: ValueChangedEvent<Record<string, unknown>>) => {
    if (!this.config) {
      return;
    }
    const value = ev.detail.value;
    this._fireConfigChanged({
      ...this.config,
      title: (value.title as string) || undefined,
      gender: value.gender as OpenscaleCardConfig['gender'],
      display_mode: value.display_mode as OpenscaleCardConfig['display_mode'],
      height_cm: value.height_cm as number | undefined,
      activity_level: value.activity_level as OpenscaleCardConfig['activity_level'],
    });
  };

  private _entityMetricsChanged = (ev: ValueChangedEvent<Record<string, string | undefined>>) => {
    if (!this.config) {
      return;
    }
    const value = ev.detail.value;
    const metrics = { ...this.config.metrics };
    for (const { key, field } of ENTITY_METRIC_FIELDS) {
      const entity = value[field];
      if (entity) {
        metrics[key] = { ...metrics[key], entity };
      } else {
        delete metrics[key];
      }
    }
    this._fireConfigChanged({ ...this.config, metrics });
  };

  private _computedMetricsChanged = (ev: ValueChangedEvent<Record<string, boolean>>) => {
    if (!this.config) {
      return;
    }
    const value = ev.detail.value;
    const metrics = { ...this.config.metrics };
    for (const { key, field } of COMPUTED_METRIC_FIELDS) {
      if (value[field]) {
        metrics[key] = metrics[key] ?? {};
      } else {
        delete metrics[key];
      }
    }
    this._fireConfigChanged({ ...this.config, metrics });
  };

  protected render() {
    if (!this.config || !this.hassObj) {
      return html``;
    }

    return html`
      <div class="section-title">General</div>
      <ha-form
        .hass=${this.hassObj}
        .data=${this._generalData}
        .schema=${GENERAL_SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._generalChanged}
      ></ha-form>

      <div class="section-title">Raw openScale-sync sensors</div>
      <ha-form
        .hass=${this.hassObj}
        .data=${this._entityMetricsData}
        .schema=${ENTITY_METRICS_SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._entityMetricsChanged}
      ></ha-form>

      <div class="section-title">Computed metrics</div>
      <ha-form
        .hass=${this.hassObj}
        .data=${this._computedMetricsData}
        .schema=${COMPUTED_METRICS_SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._computedMetricsChanged}
      ></ha-form>

      ${this._goalCategoriesInUse.length
        ? html`
            <div class="section-title">Goals (optional)</div>
            <p class="section-hint">
              Colors a metric's trend arrow by whether it moved closer to (green) or farther from (red) its goal — not by raw
              direction, since e.g. rising muscle mass is desirable while rising body fat usually isn't. Leave a field blank for
              a plain, uncolored arrow.
            </p>
            ${this._goalCategoriesInUse.map(
              (category) => html`
                <div class="section-subtitle">${category.title}</div>
                <ha-form
                  .hass=${this.hassObj}
                  .data=${this._goalsDataFor(category.fields)}
                  .schema=${this._goalsSchemaFor(category.fields)}
                  .computeLabel=${this._computeLabel}
                  @value-changed=${this._goalsChangedFor(category.fields)}
                ></ha-form>
              `,
            )}
          `
        : ''}
    `;
  }
}

customElements.define('openscale-card-editor', OpenscaleCardEditor);
