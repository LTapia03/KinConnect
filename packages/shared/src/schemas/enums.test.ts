import { describe, expect, it } from 'vitest';
import {
  BRANCH_VALUES,
  BranchSchema,
  MEAL_COUNT_MAX,
  MealCountSchema,
  NIGHT_VALUES,
  NightSchema,
  REGISTRATION_STATUS_VALUES,
  RegistrationStatusSchema,
  USER_ROLE_VALUES,
  UserRoleSchema,
  VOLUNTEER_INTEREST_VALUES,
  VolunteerInterestSchema,
} from './enums';

describe('enums', () => {
  it('accepts all user roles', () => {
    for (const role of USER_ROLE_VALUES) {
      expect(UserRoleSchema.parse(role)).toBe(role);
    }
  });

  it('rejects invalid user role', () => {
    expect(() => UserRoleSchema.parse('superadmin')).toThrow();
  });

  it('accepts all branch values', () => {
    for (const branch of BRANCH_VALUES) {
      expect(BranchSchema.parse(branch)).toBe(branch);
    }
  });

  it('rejects invalid branch', () => {
    expect(() => BranchSchema.parse('branch_6')).toThrow();
  });

  it('accepts all registration statuses', () => {
    for (const status of REGISTRATION_STATUS_VALUES) {
      expect(RegistrationStatusSchema.parse(status)).toBe(status);
    }
  });

  it('accepts night values and rejects invalid night', () => {
    for (const night of NIGHT_VALUES) {
      expect(NightSchema.parse(night)).toBe(night);
    }
    expect(() => NightSchema.parse('monday')).toThrow();
  });

  it('accepts meal counts from 0 through max', () => {
    expect(MealCountSchema.parse(0)).toBe(0);
    expect(MealCountSchema.parse(MEAL_COUNT_MAX)).toBe(MEAL_COUNT_MAX);
  });

  it('rejects meal counts outside range', () => {
    expect(() => MealCountSchema.parse(-1)).toThrow();
    expect(() => MealCountSchema.parse(MEAL_COUNT_MAX + 1)).toThrow();
    expect(() => MealCountSchema.parse(1.5)).toThrow();
  });

  it('accepts volunteer interests and rejects invalid values', () => {
    for (const interest of VOLUNTEER_INTEREST_VALUES) {
      expect(VolunteerInterestSchema.parse(interest)).toBe(interest);
    }
    expect(() => VolunteerInterestSchema.parse('invalid')).toThrow();
  });
});
