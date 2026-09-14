import { describe, expect, it } from 'vitest';
import {
  computeBmi,
  computeBmr,
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
