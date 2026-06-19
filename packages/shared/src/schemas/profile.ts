import { z } from 'zod';
import { UserRoleSchema } from './enums';

const trimmedString = (label: string) => z.string().trim().min(1, `${label} is required`);

const ProfileFieldsSchema = z.object({
  firstName: trimmedString('First name'),
  lastName: trimmedString('Last name'),
  phone: trimmedString('Phone'),
});

/** Client profile updates — role is server-assigned. */
export const ProfileUpdateSchema = ProfileFieldsSchema.strict();

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

/** Full profile entity including server-controlled role. */
export const ProfileSchema = ProfileFieldsSchema.extend({
  role: UserRoleSchema,
});

export type ProfileInput = z.infer<typeof ProfileSchema>;
