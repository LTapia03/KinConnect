import { z } from 'zod';
import { EmailCampaignStatusSchema } from './enums';

const trimmedString = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

export const EmailCampaignSchema = z.object({
  subject: trimmedString('Subject'),
  body: trimmedString('Body'),
  status: EmailCampaignStatusSchema,
});

export type EmailCampaignInput = z.infer<typeof EmailCampaignSchema>;
