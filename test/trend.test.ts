import { describe, expect, it, vi } from 'vitest';
import { TrendTracker } from '../src/trend';

/** Waits past a full promise chain (e.g. a resolved `callApi` call and its `.then()`), not just one microtask tick. */
async function flushMicrotasks(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('TrendTracker', () => {
  it('returns undefined on the first observation of a metric', () => {
    const tracker = new TrendTracker();
    expect(tracker.update('weight', 74.9)).toBeUndefined();
  });

  it('reports up when the value increased', () => {
    const tracker = new TrendTracker();
    tracker.update('weight', 74.9);
    expect(tracker.update('weight', 75.2)).toBe('up');
  });

  it('reports down when the value decreased', () => {
    const tracker = new TrendTracker();
    tracker.update('weight', 74.9);
    expect(tracker.update('weight', 74.5)).toBe('down');
  });

  it('reports flat when the value is unchanged', () => {
    const tracker = new TrendTracker();
    tracker.update('weight', 74.9);
    expect(tracker.update('weight', 74.9)).toBe('flat');
  });

  it('tracks each metric independently', () => {
    const tracker = new TrendTracker();
    tracker.update('weight', 74.9);
    expect(tracker.update('bmi', 21.0)).toBeUndefined();
  });

  it('keeps reporting the trend across many renders with an unchanged value', () => {
    // Home Assistant calls `hass` (triggering a re-render) constantly for
    // entities that have nothing to do with this card — far more often
    // than openScale-sync publishes a new reading. On a real instance,
    // dozens of these unrelated re-renders can happen in the same second
    // right after a genuine change is first observed.
    const tracker = new TrendTracker();
    tracker.update('weight', 74.9);
    expect(tracker.update('weight', 75.2)).toBe('up');

    for (let i = 0; i < 20; i++) {
      expect(tracker.update('weight', 75.2)).toBe('up');
    }
  });

  describe('seeding a fresh card from Home Assistant history', () => {
    it('recognizes a real change even from a brand-new tracker instance', async () => {
      // Home Assistant recreates the card element (and a fresh TrendTracker)
      // on every dashboard reload and every view navigation — which happens
      // far more often than openScale-sync publishes a new reading. A fresh
      // tracker has no memory of any prior instance's value, so it always
      // asks history instead of only ever reporting `undefined` here.
      const callApi = vi.fn().mockResolvedValue([[{ state: '74.0' }, { state: '74.9' }]]);
      const onSeeded = vi.fn();
      const tracker = new TrendTracker(onSeeded);
      const source = { hass: { callApi }, entityId: 'sensor.openscale_weight' };

      const firstRender = tracker.update('weight', 74.9, source);
      expect(firstRender).toBeUndefined();
      expect(callApi).toHaveBeenCalledWith('GET', expect.stringContaining('filter_entity_id=sensor.openscale_weight'));
      // Home Assistant's history endpoint defaults `end_time` to just one
      // day *after* the start timestamp, not "now" — a request missing
      // `end_time` silently returns an empty result for any lookback
      // longer than a day, which is exactly what happened in production.
      expect(callApi).toHaveBeenCalledWith('GET', expect.stringContaining('end_time='));

      await flushMicrotasks();

      expect(onSeeded).toHaveBeenCalledTimes(1);
      // The card re-renders after `onSeeded`; that next call now has a
      // history-derived baseline to compare the same live value against.
      expect(tracker.update('weight', 74.9, source)).toBe('up');
    });

    it('does not query history once a real reading already gave a baseline', () => {
      const callApi = vi.fn();
      const tracker = new TrendTracker();
      const source = { hass: { callApi }, entityId: 'sensor.openscale_weight' };
      tracker.update('weight', 74.9, source);

      // Second call already has an in-memory baseline — no repeat lookup.
      tracker.update('weight', 75.0, source);
      expect(callApi).toHaveBeenCalledTimes(1);
    });

    it('never queries history for a metric without an entity id (computed metrics)', () => {
      const callApi = vi.fn();
      const tracker = new TrendTracker();
      tracker.update('bmi', 23.6, { hass: { callApi }, entityId: undefined });
      expect(callApi).not.toHaveBeenCalled();
    });

    it('ignores a stale history value once a real different reading has already arrived', async () => {
      const callApi = vi.fn().mockResolvedValue([[{ state: '70.0' }, { state: '74.9' }]]);
      const onSeeded = vi.fn();
      const tracker = new TrendTracker(onSeeded);
      const source = { hass: { callApi }, entityId: 'sensor.openscale_weight' };

      tracker.update('weight', 74.9, source);
      // A real new weigh-in lands before the history request resolves.
      expect(tracker.update('weight', 75.5, source)).toBe('up');

      await flushMicrotasks();

      expect(onSeeded).not.toHaveBeenCalled();
      // Still reports the real "up" from the genuine reading (74.9 -> 75.5),
      // not overwritten by the now-stale history value (70.0) and not
      // decayed back to "flat" just because the value hasn't moved since.
      expect(tracker.update('weight', 75.5, source)).toBe('up');
    });

    it('falls back to no trend yet when the history request fails', async () => {
      const callApi = vi.fn().mockRejectedValue(new Error('network error'));
      const tracker = new TrendTracker();
      const source = { hass: { callApi }, entityId: 'sensor.openscale_weight' };

      tracker.update('weight', 74.9, source);
      await flushMicrotasks();

      expect(tracker.update('weight', 74.9, source)).toBe('flat');
    });
  });
});
