import { z } from 'zod';

const trimmedString = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

export const ScheduleEventSchema = z
  .object({
    title: trimmedString('Title'),
    description: z
      .string()
      .trim()
      .transform((value) => (value.length === 0 ? null : value))
      .nullable()
      .optional()
      .default(null),
    startsAt: z.string().datetime({ message: 'Invalid start date' }),
    endsAt: z.string().datetime({ message: 'Invalid end date' }),
    location: trimmedString('Location'),
    isPublished: z.boolean(),
    sortOrder: z.number().int().min(0),
  })
  .superRefine((data, ctx) => {
    if (new Date(data.endsAt).getTime() < new Date(data.startsAt).getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time must be after start time',
        path: ['endsAt'],
      });
    }
  });

export type ScheduleEventInput = z.infer<typeof ScheduleEventSchema>;
