import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TrendTracker } from '../src/trend';

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
});
