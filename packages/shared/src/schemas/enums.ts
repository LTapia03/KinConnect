import { z } from 'zod';

export const USER_ROLE_VALUES = ['registrant', 'admin'] as const;
export type UserRole = (typeof USER_ROLE_VALUES)[number];
export const UserRoleSchema = z.enum(USER_ROLE_VALUES);

export const BRANCH_VALUES = [
  'branch_1',
  'branch_2',
  'branch_3',
  'branch_4',
  'branch_5',
  'branch_7',
  'branch_8',
  'unknown',
] as const;
export type Branch = (typeof BRANCH_VALUES)[number];
export const BranchSchema = z.enum(BRANCH_VALUES);

export const REGISTRATION_STATUS_VALUES = ['draft', 'submitted'] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUS_VALUES)[number];
export const RegistrationStatusSchema = z.enum(REGISTRATION_STATUS_VALUES);

export const NIGHT_VALUES = ['thursday', 'friday', 'saturday', 'sunday'] as const;
export type Night = (typeof NIGHT_VALUES)[number];
export const NightSchema = z.enum(NIGHT_VALUES);

export const MEAL_COUNT_MAX = 6;
export const MealCountSchema = z.number().int().min(0).max(MEAL_COUNT_MAX);

export const VOLUNTEER_INTEREST_VALUES = [
  'setup',
  'cleanup',
  'registration_desk',
  'meals',
  'activities',
  'photography',
  'other',
] as const;
export type VolunteerInterest = (typeof VOLUNTEER_INTEREST_VALUES)[number];
export const VolunteerInterestSchema = z.enum(VOLUNTEER_INTEREST_VALUES);

export const EMAIL_CAMPAIGN_STATUS_VALUES = ['draft', 'sent'] as const;
export type EmailCampaignStatus = (typeof EMAIL_CAMPAIGN_STATUS_VALUES)[number];
export const EmailCampaignStatusSchema = z.enum(EMAIL_CAMPAIGN_STATUS_VALUES);
