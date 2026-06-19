export const PRICING = {
  nightlyRateCents: 12500,
  mealRateCents: 2500,
} as const;

export type MealCounts = {
  fridayDinner: number;
  saturdayBreakfast: number;
  saturdayLunch: number;
  saturdayDinner: number;
  sundayBreakfast: number;
};

export type PricingSummaryInput = {
  nightsCount: number;
  mealCounts: MealCounts;
};

export type PricingSummary = {
  nightlyTotalCents: number;
  mealTotalCents: number;
  totalCents: number;
};

export function calculatePricingSummary(input: PricingSummaryInput): PricingSummary {
  const mealTotalCount = Object.values(input.mealCounts).reduce(
    (total, count) => total + count,
    0,
  );

  const nightlyTotalCents = PRICING.nightlyRateCents * input.nightsCount;
  const mealTotalCents = PRICING.mealRateCents * mealTotalCount;

  return {
    nightlyTotalCents,
    mealTotalCents,
    totalCents: nightlyTotalCents + mealTotalCents,
  };
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}
