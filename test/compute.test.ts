import { describe, expect, it } from 'vitest';
import {
  computeBmi,
  computeBmr,
  computeDonutSegments,
  computeFatMass,
  computeLbm,
  computeMuscleMassKg,
  computeTdee,
  computeWaterMassKg,
} from '../src/compute';

describe('computeFatMass', () => {
  it('converts a body fat percentage to kg', () => {
    expect(computeFatMass(74.95, 17.7)).toBeCloseTo(13.27, 2);
  });
});

describe('computeMuscleMassKg', () => {
  it('converts a muscle percentage to kg', () => {
    expect(computeMuscleMassKg(74.95, 41.5)).toBeCloseTo(31.1, 1);
  });
});

describe('computeWaterMassKg', () => {
  it('converts a water percentage to kg', () => {
    expect(computeWaterMassKg(74.95, 54.9)).toBeCloseTo(41.15, 2);
  });
});

describe('computeLbm', () => {
  it('subtracts fat mass from total weight', () => {
    expect(computeLbm(74.95, 17.7)).toBeCloseTo(61.68, 2);
  });
});

describe('computeBmi', () => {
  it('divides weight by height in meters squared', () => {
    expect(computeBmi(74.95, 180)).toBeCloseTo(23.13, 2);
  });
});

describe('computeBmr', () => {
  it('applies the Katch-McArdle formula', () => {
    expect(computeBmr(61.68)).toBeCloseTo(1702.29, 2);
  });
});

describe('computeTdee', () => {
  it('scales BMR by the activity factor', () => {
    expect(computeTdee(1700, 'sedentary')).toBeCloseTo(2040, 5);
    expect(computeTdee(1700, 'moderate')).toBeCloseTo(2635, 5);
  });
});

describe('computeDonutSegments', () => {
  it('shows the raw percentages plus a leftover "other" when they sum under 100%', () => {
    const segments = computeDonutSegments(40, 20, 15);
    expect(segments.water).toBe(40);
    expect(segments.muscle).toBe(20);
    expect(segments.fat).toBe(15);
    expect(segments.bone).toBe(0);
    expect(segments.other).toBeCloseTo(25, 5);
  });

  it('accounts for bone % when it is known', () => {
    const segments = computeDonutSegments(40, 20, 15, 3);
    expect(segments.bone).toBe(3);
    expect(segments.other).toBeCloseTo(22, 5);
  });

  it('scales water/muscle/fat/bone down proportionally when they overlap past 100%', () => {
    // openScale's water % and muscle % both include muscle tissue's own
    // water content, so real readings commonly sum past 100% on their own.
    const segments = computeDonutSegments(54.9, 41.5, 17.7);
    const rawSum = 54.9 + 41.5 + 17.7;
    expect(segments.water).toBeCloseTo((54.9 / rawSum) * 100, 5);
    expect(segments.muscle).toBeCloseTo((41.5 / rawSum) * 100, 5);
    expect(segments.fat).toBeCloseTo((17.7 / rawSum) * 100, 5);
    expect(segments.other).toBe(0);
    expect(segments.water + segments.muscle + segments.fat).toBeCloseTo(100, 5);
  });
});
