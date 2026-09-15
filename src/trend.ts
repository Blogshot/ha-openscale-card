import { MetricKey } from './types';

export type TrendDirection = 'up' | 'down' | 'flat';

/** Smallest change treated as real movement rather than float noise. */
const EPSILON = 1e-6;

/** How far back to look for a prior reading when seeding from history — wide enough for a weekly weigh-in habit. */
const HISTORY_LOOKBACK_MS = 30 * 24 * 60 * 60 * 1000;

/** The slice of `hass` needed to fetch entity history — kept minimal so tests don't need a full HomeAssistant stub. */
export interface HistorySource {
  callApi(method: string, path: string): Promise<unknown>;
}

/**
 * Looks up the most recent value an entity held *before* its current
 * reading, via Home Assistant's REST history endpoint. Returns undefined
 * whenever that isn't available for any reason (no `callApi`, the entity
 * has no recorder history, only one state on record, or the request
 * fails) — the caller falls back to waiting for a second live reading.
 */
async function seedFromHistory(hass: HistorySource, entityId: string): Promise<number | undefined> {
  try {
    const start = new Date(Date.now() - HISTORY_LOOKBACK_MS).toISOString();
    // Home Assistant's history endpoint defaults `end_time` to just one day
    // *after* `start`, not "now" — omitting it here silently windowed every
    // lookup into ancient history no sensor had data for yet, so it always
    // came back empty. Passing `end_time` explicitly is what actually makes
    // this a "last 30 days up to now" query.
    const end = new Date().toISOString();
    const path = `history/period/${start}?filter_entity_id=${encodeURIComponent(entityId)}&end_time=${encodeURIComponent(end)}&minimal_response`;
    const result = await hass.callApi('GET', path);
    const series = Array.isArray(result) ? (result[0] as Array<{ state?: string }> | undefined) : undefined;
    if (!Array.isArray(series) || series.length < 2) {
      return undefined;
    }
    // The last entry is the entity's current reading (already known from
    // `hass.states`) — walk backwards from just before it for the most
    // recent one that actually parses as a number.
    for (let i = series.length - 2; i >= 0; i--) {
      const parsed = parseFloat(series[i]?.state ?? '');
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Tracks the last-seen value per metric and reports whether a new value
 * moved up, down, or stayed flat. Returns undefined the first time a metric
 * is observed in this tracker instance, since there is nothing to compare
 * against yet.
 *
 * Home Assistant recreates the card element — and with it, a fresh
 * TrendTracker — on every dashboard reload and every Lovelace view
 * navigation, which happens far more often than openScale-sync actually
 * publishes a new reading (at most once per weigh-in). So whenever a metric
 * has an entity id (the four raw openScale-sync sensors, not a computed one
 * like BMI), a fresh tracker always asks Home Assistant's own history for
 * that entity's previous reading rather than waiting for a second live
 * value to arrive — that lookup is async, so it can't resolve within the
 * same render that triggered it; `onSeeded` is called once it does, so the
 * caller can request a re-render and pick up the now-known baseline.
 * Computed metrics have no entity of their own to ask history about, so
 * they keep showing no arrow until the card itself has seen two readings.
 *
 * Once a genuine change is found, that up/down verdict is cached and kept
 * as the answer for every following render where the value hasn't moved
 * again — see the comment in `update()` for why that's necessary at all.
 */
export class TrendTracker {
  private previous = new Map<MetricKey, number>();
  private lastTrend = new Map<MetricKey, TrendDirection>();
  private readonly onSeeded?: () => void;
  private readonly seeding = new Set<MetricKey>();

  constructor(onSeeded?: () => void) {
    this.onSeeded = onSeeded;
  }

  update(key: MetricKey, value: number, source?: { hass: HistorySource; entityId?: string }): TrendDirection | undefined {
    const last = this.previous.get(key);
    if (last === undefined) {
      this.trySeedFromHistory(key, value, source);
      this.previous.set(key, value);
      return undefined;
    }

    // Home Assistant calls `hass` (and so triggers a re-render) constantly
    // for entities that have nothing to do with this card — far more often
    // than openScale-sync actually publishes a new reading. Only advancing
    // `previous` on a genuine change, and otherwise replaying the trend we
    // already settled on, is what makes a real "up"/"down" stay visible
    // across all of those in-between renders instead of only the one
    // render where the change was first observed — comparing `value` to
    // `last` again on every following render (both still the same reading)
    // would always recompute "flat" and immediately erase it.
    if (Math.abs(value - last) < EPSILON) {
      return this.lastTrend.get(key) ?? 'flat';
    }
    const trend: TrendDirection = value > last ? 'up' : 'down';
    this.previous.set(key, value);
    this.lastTrend.set(key, trend);
    return trend;
  }

  private trySeedFromHistory(key: MetricKey, currentValue: number, source?: { hass: HistorySource; entityId?: string }): void {
    if (!source?.entityId || this.seeding.has(key)) {
      return;
    }
    this.seeding.add(key);
    seedFromHistory(source.hass, source.entityId).then((seed) => {
      // While the request was in flight, a real live reading may already
      // have changed `previous` away from the value that triggered this
      // seed — that already gave a genuine comparison, so a now-stale
      // history value must not override it.
      if (seed === undefined || this.previous.get(key) !== currentValue) {
        return;
      }
      this.previous.set(key, seed);
      this.onSeeded?.();
    });
  }
}

export const TREND_ARROWS: Record<TrendDirection, string> = {
  up: '↑',
  down: '↓',
  flat: '→',
};
