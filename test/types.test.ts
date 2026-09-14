import { describe, expect, it } from 'vitest';
import { METRIC_KEYS, METRIC_LABELS } from '../src/types';

describe('METRIC_LABELS', () => {
  it('has a label for every metric key', () => {
    for (const key of METRIC_KEYS) {
      expect(METRIC_LABELS[key]).toBeTruthy();
    }
  });
});
