import { z } from 'zod';

const trimmedString = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

export const AnnouncementSchema = z.object({
  title: trimmedString('Title'),
  body: trimmedString('Body'),
  isPublished: z.boolean(),
});

export type AnnouncementInput = z.infer<typeof AnnouncementSchema>;
