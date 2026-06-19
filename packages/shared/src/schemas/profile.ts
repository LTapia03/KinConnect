import { z } from 'zod';
import { UserRoleSchema } from './enums';

const trimmedString = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

export const ProfileSchema = z.object({
  firstName: trimmedString('First name'),
  lastName: trimmedString('Last name'),
  phone: trimmedString('Phone'),
  role: UserRoleSchema,
});

export type ProfileInput = z.infer<typeof ProfileSchema>;
