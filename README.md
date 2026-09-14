# OpenScale Card

A [Home Assistant](https://www.home-assistant.io/) Lovelace card that visualizes body composition data published by [openScale](https://github.com/oliexdev/openScale) via openScale-sync (MQTT) as a schematic body silhouette — weight, BMI, body fat, water, muscle mass, bone mass and more, at a glance.

## Status

🚧 Early work in progress. This first release ships a minimal fallback view (a plain metric list); the schematic body-silhouette visualizations shown in the previews below are still in development.

## Preview

| Callouts mode | Grid mode | Donut mode |
| :---: | :---: | :---: |
| ![Callouts mode preview](docs/screenshots/preview-callouts.svg) | ![Grid mode preview](docs/screenshots/preview-grid.svg) | ![Donut mode preview](docs/screenshots/preview-donut.svg) |

> The images above are placeholders — replace them with real screenshots once the corresponding display mode is implemented.

## Requirements

- Home Assistant sensor entities created via openScale-sync's MQTT discovery (weight, BMI, body fat, water, muscle mass, bone mass, ...).

## Installation

### HACS (custom repository)

1. In Home Assistant, open **HACS → Frontend**.
2. Open the three-dot menu → **Custom repositories**.
3. Add this repository's URL with category **Lovelace**.
4. Install **OpenScale Card**, then add it as a dashboard resource if HACS doesn't do so automatically.

### Manual

Download `openscale-card.js` from this repository and register it as a Lovelace resource (Settings → Dashboards → Resources).

## Configuration

```yaml
type: custom:openscale-card
title: My Body Data
gender: female
display_mode: grid
metrics:
  weight:
    entity: sensor.openscale_weight
  bmi:
    entity: sensor.openscale_bmi
  body_fat:
    entity: sensor.openscale_body_fat
  water:
    entity: sensor.openscale_water
  muscle_mass:
    entity: sensor.openscale_muscle_mass
  bone_mass:
    entity: sensor.openscale_bone_mass
```

Every entry under `metrics` is optional — metrics without an assigned entity are simply left out. `display_mode` will support `callouts`, `grid` and `donut` (see previews above); only a plain fallback list is rendered in this release.

## Development

```bash
npm install
npm run build   # bundles src/ into openscale-card.js
npm test        # runs the unit tests
```

## License

MIT — see [LICENSE](LICENSE).
