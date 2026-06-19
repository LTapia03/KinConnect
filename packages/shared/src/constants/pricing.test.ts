import { describe, expect, it } from 'vitest';
import { calculatePricingSummary, formatCents, PRICING } from './pricing';

describe('pricing constants', () => {
  it('exposes nightly and meal rates', () => {
    expect(PRICING.nightlyRateCents).toBeGreaterThan(0);
    expect(PRICING.mealRateCents).toBeGreaterThan(0);
  });

  it('calculates pricing summary from counts', () => {
    const summary = calculatePricingSummary({
      nightsCount: 2,
      mealCounts: {
        fridayDinner: 2,
        saturdayBreakfast: 2,
        saturdayLunch: 2,
        saturdayDinner: 2,
        sundayBreakfast: 1,
      },
    });

    expect(summary.nightlyTotalCents).toBe(PRICING.nightlyRateCents * 2);
    expect(summary.mealTotalCents).toBe(PRICING.mealRateCents * 9);
    expect(summary.totalCents).toBe(summary.nightlyTotalCents + summary.mealTotalCents);
  });

  it('formats cents as USD currency', () => {
    expect(formatCents(12500)).toBe('$125.00');
  });

  it('handles zero counts', () => {
    const summary = calculatePricingSummary({
      nightsCount: 0,
      mealCounts: {
        fridayDinner: 0,
        saturdayBreakfast: 0,
        saturdayLunch: 0,
        saturdayDinner: 0,
        sundayBreakfast: 0,
      },
    });

    expect(summary.totalCents).toBe(0);
  });
});
