import { MetricKey } from './types';

export type TrendDirection = 'up' | 'down' | 'flat';

/**
 * Whether a trend is desirable, not just which way it points.
 * - `'good'`/`'bad'` — the value moved closer to / farther from a configured goal.
 * - `'neutral'` — no real movement since the last reading (still flat), or a
 *   movement that left the distance to the goal unchanged.
 * - `'moved'` — a real change happened but there's no goal to judge it
 *   against, so direction alone can't say good or bad (rising muscle mass is
 *   desirable, rising body fat usually isn't). Still worth flagging as real
 *   movement rather than looking identical to "nothing happened".
 */
export type TrendQuality = 'good' | 'bad' | 'neutral' | 'moved';

/** Smallest change treated as real movement rather than float noise. */
const EPSILON = 1e-6;

/** How far back to look for a prior reading when seeding from history — wide enough for a weekly weigh-in habit. */
const HISTORY_LOOKBACK_MS = 30 * 24 * 60 * 60 * 1000;

/** The slice of `hass` needed to fetch entity history — kept minimal so tests don't need a full HomeAssistant stub. */
export interface HistorySource {
  callApi(method: string, path: string): Promise<unknown>;
}

/**
 * Looks up the most recent *different* value an entity held before its
 * current reading, via Home Assistant's REST history endpoint. Returns
 * undefined whenever that isn't available for any reason (no `callApi`, the
 * entity has no recorder history, only one distinct value on record, or the
 * request fails) — the caller falls back to waiting for a second live
 * reading.
 */
async function seedFromHistory(hass: HistorySource, entityId: string, currentValue: number): Promise<number | undefined> {
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
    // recent one that both parses as a number and actually differs from the
    // current value. openScale-sync entities cycle through "unknown" and
    // re-publish their last known value on every sync heartbeat, not just on
    // a genuine new weigh-in, so the entry immediately before "current" is
    // very often just another copy of that same reading rather than a real
    // prior one — skipping past those too is what finds the last actual
    // change instead of reporting a false "flat".
    for (let i = series.length - 2; i >= 0; i--) {
      const parsed = parseFloat(series[i]?.state ?? '');
      if (Number.isFinite(parsed) && Math.abs(parsed - currentValue) >= EPSILON) {
        return parsed;
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Whether moving from `previous` to `value` brought the reading closer to
 * `goal` (good), farther away (bad), or — with no goal configured — neither
 * ('moved': it's a genuine change, just not one that can be called good or
 * bad without a goal to measure it against). Deliberately ignores raw
 * direction: rising muscle mass is good, rising body fat usually isn't, and
 * which one applies depends entirely on where the goal sits relative to the
 * current reading. Only called from `update()` once a genuine change (not
 * merely a repeat of the same value) has already been established.
 */
function computeTrendQuality(previous: number, value: number, goal?: number): TrendQuality {
  if (goal === undefined) {
    return 'moved';
  }
  const distanceBefore = Math.abs(previous - goal);
  const distanceAfter = Math.abs(value - goal);
  if (distanceAfter < distanceBefore - EPSILON) {
    return 'good';
  }
  if (distanceAfter > distanceBefore + EPSILON) {
    return 'bad';
  }
  return 'neutral';
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
  private lastQuality = new Map<MetricKey, TrendQuality>();
  private readonly onSeeded?: () => void;
  private readonly seeding = new Set<MetricKey>();

  constructor(onSeeded?: () => void) {
    this.onSeeded = onSeeded;
  }

  update(
    key: MetricKey,
    value: number,
    source?: { hass: HistorySource; entityId?: string },
    goal?: number,
  ): TrendDirection | undefined {
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
    // would always recompute "flat" and immediately erase it. The cached
    // quality (see `getQuality`) rides along for exactly the same reason.
    if (Math.abs(value - last) < EPSILON) {
      return this.lastTrend.get(key) ?? 'flat';
    }
    const trend: TrendDirection = value > last ? 'up' : 'down';
    this.previous.set(key, value);
    this.lastTrend.set(key, trend);
    this.lastQuality.set(key, computeTrendQuality(last, value, goal));
    return trend;
  }

  /**
   * Whether the most recently reported trend for `key` is desirable — only
   * `'good'`/`'bad'` once a `goal` has been passed to `update()` for a
   * genuine change; `'moved'` for a genuine change with no goal configured;
   * `'neutral'` if `key` has never seen a genuine change at all. Call after
   * `update()`.
   */
  getQuality(key: MetricKey): TrendQuality {
    return this.lastQuality.get(key) ?? 'neutral';
  }

  private trySeedFromHistory(key: MetricKey, currentValue: number, source?: { hass: HistorySource; entityId?: string }): void {
    if (!source?.entityId || this.seeding.has(key)) {
      return;
    }
    this.seeding.add(key);
    seedFromHistory(source.hass, source.entityId, currentValue).then((seed) => {
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
