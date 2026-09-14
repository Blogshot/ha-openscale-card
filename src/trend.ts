import { MetricKey } from './types';

export type TrendDirection = 'up' | 'down' | 'flat';

/** Smallest change treated as real movement rather than float noise. */
const EPSILON = 1e-6;

/**
 * Tracks the last-seen value per metric across renders (in memory only, for
 * the lifetime of the card element) and reports whether a new value moved
 * up, down, or stayed flat. Returns undefined the first time a metric is
 * observed, since there is nothing to compare against yet.
 */
export class TrendTracker {
  private previous = new Map<MetricKey, number>();

  update(key: MetricKey, value: number): TrendDirection | undefined {
    const last = this.previous.get(key);
    this.previous.set(key, value);
    if (last === undefined) {
      return undefined;
    }
    const diff = value - last;
    if (Math.abs(diff) < EPSILON) {
      return 'flat';
    }
    return diff > 0 ? 'up' : 'down';
  }
}

export const TREND_ARROWS: Record<TrendDirection, string> = {
  up: '↑',
  down: '↓',
  flat: '→',
};
