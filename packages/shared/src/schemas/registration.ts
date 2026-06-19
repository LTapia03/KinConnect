import { z } from 'zod';
import {
  BranchSchema,
  MealCountSchema,
  NightSchema,
  RegistrationStatusSchema,
  VolunteerInterestSchema,
} from './enums';

const trimmedString = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

const optionalTrimmedString = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value))
  .nullable()
  .optional()
  .default(null);

const partyCount = z.number().int().min(0, 'Count cannot be negative');

export const RegistrationSchema = z
  .object({
    contactFirstName: trimmedString('First name'),
    contactLastName: trimmedString('Last name'),
    contactEmail: z.string().trim().email('Invalid email address'),
    contactPhone: trimmedString('Phone'),
    streetAddress: trimmedString('Street address'),
    city: trimmedString('City'),
    state: trimmedString('State'),
    postalCode: trimmedString('Postal code'),
    adultsCount: partyCount,
    childrenCount: partyCount,
    dayOnlyVisitorsCount: partyCount,
    nightsStaying: z.array(NightSchema),
    nightsOther: optionalTrimmedString,
    roomPreference: trimmedString('Room preference'),
    arrivalNotes: optionalTrimmedString,
    memberName1: trimmedString('Member name 1'),
    memberName2: optionalTrimmedString,
    memberName3: optionalTrimmedString,
    memberName4: optionalTrimmedString,
    memberName5: optionalTrimmedString,
    memberName6: optionalTrimmedString,
    dietaryNotes: optionalTrimmedString,
    fridayDinnerCount: MealCountSchema,
    saturdayBreakfastCount: MealCountSchema,
    saturdayLunchCount: MealCountSchema,
    saturdayDinnerCount: MealCountSchema,
    sundayBreakfastCount: MealCountSchema,
    branch: BranchSchema,
    lookingForward: optionalTrimmedString,
    volunteerInterests: z.array(VolunteerInterestSchema).default([]),
    volunteerOther: optionalTrimmedString,
    suggestions: optionalTrimmedString,
    status: RegistrationStatusSchema,
  })
  .superRefine((data, ctx) => {
    if (data.nightsStaying.length === 0 && !data.nightsOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Select at least one night or provide other nights',
        path: ['nightsStaying'],
      });
    }
  });

export type RegistrationInput = z.infer<typeof RegistrationSchema>;

export const RegistrationInsertSchema = RegistrationSchema;

export type RegistrationInsertInput = RegistrationInput;
