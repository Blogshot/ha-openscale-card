import { MetricKey } from './types';

export type TrendDirection = 'up' | 'down' | 'flat';

/** Smallest change treated as real movement rather than float noise. */
const EPSILON = 1e-6;

/**
 * Tracks the last-seen value per metric and reports whether a new value
 * moved up, down, or stayed flat. Returns undefined the first time a metric
 * is observed, since there is nothing to compare against yet.
 *
 * Home Assistant recreates the card element — and with it, a fresh
 * in-memory tracker — on every dashboard reload and every Lovelace view
 * navigation, which happens far more often than openScale-sync actually
 * publishes a new reading (at most once per weigh-in). An in-memory-only
 * tracker would therefore see two genuinely different values in the same
 * instance only by coincidence, and the arrow would appear stuck on "flat"
 * indefinitely. Passing a `storageId` (something stable per card
 * configuration, e.g. the underlying sensor's entity id) additionally
 * persists the last value to `localStorage`, so a freshly created tracker
 * still finds the previous reading. This is per-browser, same as the
 * in-memory version was per-tab: it resets if site data is cleared, or
 * differs across devices/browsers viewing the same dashboard.
 */
export class TrendTracker {
  private previous = new Map<MetricKey, number>();
  private readonly storagePrefix?: string;

  constructor(storageId?: string) {
    this.storagePrefix = storageId ? `openscale-card-trend:${storageId}:` : undefined;
  }

  update(key: MetricKey, value: number): TrendDirection | undefined {
    const last = this.previous.get(key) ?? this.readPersisted(key);
    this.previous.set(key, value);
    this.writePersisted(key, value);

    if (last === undefined) {
      return undefined;
    }
    const diff = value - last;
    if (Math.abs(diff) < EPSILON) {
      return 'flat';
    }
    return diff > 0 ? 'up' : 'down';
  }

  private readPersisted(key: MetricKey): number | undefined {
    if (!this.storagePrefix || typeof localStorage === 'undefined') {
      return undefined;
    }
    try {
      const raw = localStorage.getItem(this.storagePrefix + key);
      if (raw === null) {
        return undefined;
      }
      const parsed = parseFloat(raw);
      return Number.isFinite(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }

  private writePersisted(key: MetricKey, value: number): void {
    if (!this.storagePrefix || typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(this.storagePrefix + key, String(value));
    } catch {
      // Storage full, disabled, or unavailable (private browsing) — the
      // in-memory value still covers the rest of this element's lifetime.
    }
  }
}

export const TREND_ARROWS: Record<TrendDirection, string> = {
  up: '↑',
  down: '↓',
  flat: '→',
};
