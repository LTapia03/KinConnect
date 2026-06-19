import { z } from 'zod';
import { EmailCampaignStatusSchema } from './enums';

const trimmedString = (label: string) => z.string().trim().min(1, `${label} is required`);

const EmailCampaignFieldsSchema = z.object({
  subject: trimmedString('Subject'),
  body: trimmedString('Body'),
});

/** Client campaign creation — status and send metadata are server-assigned. */
export const EmailCampaignInsertSchema = EmailCampaignFieldsSchema.strict();

export type EmailCampaignInsertInput = z.infer<typeof EmailCampaignInsertSchema>;

/** Full email campaign entity including server-controlled fields. */
export const EmailCampaignSchema = EmailCampaignFieldsSchema.extend({
  status: EmailCampaignStatusSchema,
  sentAt: z.coerce.date().nullable().optional().default(null),
  sentBy: z.string().uuid().nullable().optional().default(null),
  recipientCount: z.number().int().min(0).nullable().optional().default(null),
});

export type EmailCampaignInput = z.infer<typeof EmailCampaignSchema>;
