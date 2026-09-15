import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TrendTracker } from '../src/trend';

/** Waits past a full promise chain (e.g. a resolved `callApi` call and its `.then()`), not just one microtask tick. */
async function flushMicrotasks(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/** Minimal Storage stand-in — vitest's default node environment has no global `localStorage`. */
class FakeStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
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

  describe('persistence across page reloads', () => {
    let fakeLocalStorage: FakeStorage;

    beforeEach(() => {
      fakeLocalStorage = new FakeStorage();
      (globalThis as { localStorage?: FakeStorage }).localStorage = fakeLocalStorage;
    });

    afterEach(() => {
      delete (globalThis as { localStorage?: FakeStorage }).localStorage;
    });

    it('recognizes a real change even from a brand-new tracker instance', () => {
      // Home Assistant recreates the card element (and a fresh TrendTracker)
      // on every dashboard reload and every view navigation — which happens
      // far more often than openScale-sync publishes a new reading. Without
      // persistence, this second, independent tracker has no memory of the
      // first one's value and would report `undefined` here instead of 'up'.
      const first = new TrendTracker('sensor.openscale_weight');
      first.update('weight', 74.9);

      const second = new TrendTracker('sensor.openscale_weight');
      expect(second.update('weight', 75.2)).toBe('up');
    });

    it('keeps different cards/entities from clobbering each other', () => {
      const personA = new TrendTracker('sensor.openscale_alice_weight');
      personA.update('weight', 60);

      // A different storage id (e.g. a second person's card) must not see
      // person A's stored value as its own baseline.
      const personB = new TrendTracker('sensor.openscale_bob_weight');
      expect(personB.update('weight', 90)).toBeUndefined();
    });

    it('falls back to memory-only tracking when localStorage throws', () => {
      (globalThis as { localStorage?: FakeStorage }).localStorage = {
        getItem: () => {
          throw new Error('storage disabled');
        },
        setItem: () => {
          throw new Error('storage disabled');
        },
      } as unknown as FakeStorage;

      const tracker = new TrendTracker('sensor.openscale_weight');
      expect(() => tracker.update('weight', 74.9)).not.toThrow();
      expect(tracker.update('weight', 75.2)).toBe('up');
    });

    it('without a storage id, behaves exactly like the plain in-memory tracker', () => {
      const first = new TrendTracker();
      first.update('weight', 74.9);

      const second = new TrendTracker();
      expect(second.update('weight', 75.2)).toBeUndefined();
    });
  });

  describe('seeding a fresh card from Home Assistant history', () => {
    it('picks up an existing sensor history and reports the trend once it resolves', async () => {
      // The history endpoint's last entry is the entity's current reading;
      // the seed should come from the one before it.
      const callApi = vi.fn().mockResolvedValue([[{ state: '74.0' }, { state: '74.9' }]]);
      const onSeeded = vi.fn();
      const tracker = new TrendTracker('sensor.openscale_weight', onSeeded);

      const firstRender = tracker.update('weight', 74.9, { hass: { callApi }, entityId: 'sensor.openscale_weight' });
      expect(firstRender).toBeUndefined();
      expect(callApi).toHaveBeenCalledWith('GET', expect.stringContaining('filter_entity_id=sensor.openscale_weight'));

      await flushMicrotasks();

      expect(onSeeded).toHaveBeenCalledTimes(1);
      // The card re-renders after `onSeeded`; that next call now has a
      // history-derived baseline to compare the same live value against.
      expect(tracker.update('weight', 74.9, { hass: { callApi }, entityId: 'sensor.openscale_weight' })).toBe('up');
    });

    it('does not query history once a real reading already gave a baseline', () => {
      const callApi = vi.fn();
      const tracker = new TrendTracker('sensor.openscale_weight');
      tracker.update('weight', 74.9, { hass: { callApi }, entityId: 'sensor.openscale_weight' });

      // Second call already has an in-memory baseline — no repeat lookup.
      tracker.update('weight', 75.0, { hass: { callApi }, entityId: 'sensor.openscale_weight' });
      expect(callApi).toHaveBeenCalledTimes(1);
    });

    it('never queries history for a metric without an entity id (computed metrics)', () => {
      const callApi = vi.fn();
      const tracker = new TrendTracker('sensor.openscale_weight');
      tracker.update('bmi', 23.6, { hass: { callApi }, entityId: undefined });
      expect(callApi).not.toHaveBeenCalled();
    });

    it('ignores a stale history value once a real different reading has already arrived', async () => {
      const callApi = vi.fn().mockResolvedValue([[{ state: '70.0' }, { state: '74.9' }]]);
      const onSeeded = vi.fn();
      const tracker = new TrendTracker('sensor.openscale_weight', onSeeded);
      const source = { hass: { callApi }, entityId: 'sensor.openscale_weight' };

      tracker.update('weight', 74.9, source);
      // A real new weigh-in lands before the history request resolves.
      expect(tracker.update('weight', 75.5, source)).toBe('up');

      await flushMicrotasks();

      expect(onSeeded).not.toHaveBeenCalled();
      // Still compares against the real previous reading (74.9), not the
      // now-stale history value (70.0).
      expect(tracker.update('weight', 75.5, source)).toBe('flat');
    });

    it('falls back to no trend yet when the history request fails', async () => {
      const callApi = vi.fn().mockRejectedValue(new Error('network error'));
      const tracker = new TrendTracker('sensor.openscale_weight');
      const source = { hass: { callApi }, entityId: 'sensor.openscale_weight' };

      tracker.update('weight', 74.9, source);
      await flushMicrotasks();

      expect(tracker.update('weight', 74.9, source)).toBe('flat');
    });
  });
});
