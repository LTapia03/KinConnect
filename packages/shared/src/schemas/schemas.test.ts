import { describe, expect, it } from 'vitest';
import { ProfileSchema, ProfileUpdateSchema } from './profile';
import { RegistrationInsertSchema, RegistrationSchema } from './registration';
import { ScheduleEventSchema } from './schedule-event';
import { AnnouncementSchema } from './announcement';
import { EmailCampaignInsertSchema, EmailCampaignSchema } from './email-campaign';

const validRegistration = {
  contactFirstName: 'Anna',
  contactLastName: 'von Rosenberg',
  contactEmail: 'anna@example.com',
  contactPhone: '512-555-0100',
  streetAddress: '123 Main St',
  city: 'Austin',
  state: 'TX',
  postalCode: '78701',
  adultsCount: 2,
  childrenCount: 1,
  dayOnlyVisitorsCount: 0,
  nightsStaying: ['friday', 'saturday'],
  nightsOther: null,
  roomPreference: 'King bed, ground floor if possible',
  arrivalNotes: 'Arriving Friday afternoon',
  memberName1: 'Anna von Rosenberg',
  memberName2: 'Karl von Rosenberg',
  memberName3: null,
  memberName4: null,
  memberName5: null,
  memberName6: null,
  dietaryNotes: 'One vegetarian',
  fridayDinnerCount: 2,
  saturdayBreakfastCount: 2,
  saturdayLunchCount: 2,
  saturdayDinnerCount: 2,
  sundayBreakfastCount: 1,
  branch: 'branch_1',
  lookingForward: 'Seeing everyone!',
  volunteerInterests: ['setup', 'registration_desk'],
  volunteerOther: null,
  suggestions: null,
  status: 'submitted',
};

describe('ProfileSchema', () => {
  it('accepts a valid profile payload', () => {
    const result = ProfileSchema.parse({
      firstName: 'Anna',
      lastName: 'von Rosenberg',
      phone: '512-555-0100',
      role: 'registrant',
    });

    expect(result.firstName).toBe('Anna');
  });

  it('rejects missing required fields', () => {
    expect(() => ProfileSchema.parse({ firstName: 'Anna' })).toThrow();
  });

  it('rejects invalid role', () => {
    expect(() =>
      ProfileSchema.parse({
        firstName: 'Anna',
        lastName: 'von Rosenberg',
        phone: '512-555-0100',
        role: 'owner',
      }),
    ).toThrow();
  });
});

describe('ProfileUpdateSchema', () => {
  it('accepts profile fields without role', () => {
    const result = ProfileUpdateSchema.parse({
      firstName: 'Anna',
      lastName: 'von Rosenberg',
      phone: '512-555-0100',
    });

    expect(result.firstName).toBe('Anna');
  });

  it('rejects payloads that include role', () => {
    expect(() =>
      ProfileUpdateSchema.parse({
        firstName: 'Anna',
        lastName: 'von Rosenberg',
        phone: '512-555-0100',
        role: 'admin',
      }),
    ).toThrow();
  });
});

describe('RegistrationSchema', () => {
  it('accepts a valid registration payload', () => {
    const result = RegistrationSchema.parse(validRegistration);
    expect(result.status).toBe('submitted');
  });

  it('accepts draft status', () => {
    const result = RegistrationSchema.parse({ ...validRegistration, status: 'draft' });
    expect(result.status).toBe('draft');
  });

  it('requires at least one night or nightsOther', () => {
    expect(() =>
      RegistrationSchema.parse({
        ...validRegistration,
        nightsStaying: [],
        nightsOther: null,
      }),
    ).toThrow(/night/i);
  });

  it('accepts nightsOther when nightsStaying is empty', () => {
    const result = RegistrationSchema.parse({
      ...validRegistration,
      nightsStaying: [],
      nightsOther: 'Monday through Wednesday',
    });
    expect(result.nightsOther).toBe('Monday through Wednesday');
  });

  it('rejects negative party counts', () => {
    expect(() => RegistrationSchema.parse({ ...validRegistration, adultsCount: -1 })).toThrow();
  });

  it('rejects invalid meal counts', () => {
    expect(() =>
      RegistrationSchema.parse({ ...validRegistration, fridayDinnerCount: 7 }),
    ).toThrow();
  });

  it('rejects invalid branch', () => {
    expect(() => RegistrationSchema.parse({ ...validRegistration, branch: 'branch_6' })).toThrow();
  });

  it('rejects invalid email', () => {
    expect(() =>
      RegistrationSchema.parse({ ...validRegistration, contactEmail: 'not-an-email' }),
    ).toThrow();
  });

  it('normalizes blank optional strings to null', () => {
    const result = RegistrationSchema.parse({
      ...validRegistration,
      arrivalNotes: '   ',
      memberName2: '',
      lookingForward: '',
      volunteerOther: '',
      suggestions: '',
    });

    expect(result.arrivalNotes).toBeNull();
    expect(result.memberName2).toBeNull();
    expect(result.lookingForward).toBeNull();
    expect(result.volunteerOther).toBeNull();
    expect(result.suggestions).toBeNull();
  });

  it('rejects empty required text fields', () => {
    expect(() =>
      RegistrationSchema.parse({ ...validRegistration, contactFirstName: '   ' }),
    ).toThrow();
  });
});

describe('RegistrationInsertSchema', () => {
  it('omits status so clients cannot submit directly', () => {
    const insertPayload = { ...validRegistration };
    delete (insertPayload as Partial<typeof insertPayload>).status;
    const result = RegistrationInsertSchema.parse(insertPayload);
    expect(result.contactEmail).toBe('anna@example.com');
  });

  it('rejects payloads that include status', () => {
    expect(() => RegistrationInsertSchema.parse(validRegistration)).toThrow();
  });
});

describe('ScheduleEventSchema', () => {
  it('accepts a valid schedule event', () => {
    const result = ScheduleEventSchema.parse({
      title: 'Welcome Reception',
      description: 'Meet and greet in the lobby',
      startsAt: '2026-07-10T17:00:00.000Z',
      endsAt: '2026-07-10T19:00:00.000Z',
      location: 'Hotel Lobby',
      isPublished: true,
      sortOrder: 1,
    });

    expect(result.title).toBe('Welcome Reception');
  });

  it('normalizes blank description to null', () => {
    const result = ScheduleEventSchema.parse({
      title: 'Breakfast',
      description: '   ',
      startsAt: '2026-07-11T08:00:00.000Z',
      endsAt: '2026-07-11T09:00:00.000Z',
      location: 'Dining Room',
      isPublished: true,
      sortOrder: 1,
    });

    expect(result.description).toBeNull();
  });

  it('rejects end before start', () => {
    expect(() =>
      ScheduleEventSchema.parse({
        title: 'Breakfast',
        description: null,
        startsAt: '2026-07-11T09:00:00.000Z',
        endsAt: '2026-07-11T08:00:00.000Z',
        location: 'Dining Room',
        isPublished: true,
        sortOrder: 1,
      }),
    ).toThrow(/end/i);
  });
});

describe('AnnouncementSchema', () => {
  it('accepts a valid announcement', () => {
    const result = AnnouncementSchema.parse({
      title: 'Parking Info',
      body: 'Use the south lot.',
      isPublished: true,
    });

    expect(result.title).toBe('Parking Info');
  });

  it('rejects empty title', () => {
    expect(() =>
      AnnouncementSchema.parse({
        title: '',
        body: 'Body',
        isPublished: false,
      }),
    ).toThrow();
  });
});

describe('EmailCampaignSchema', () => {
  it('accepts a valid email campaign', () => {
    const result = EmailCampaignSchema.parse({
      subject: 'Reunion Reminder',
      body: 'See you soon!',
      status: 'draft',
    });

    expect(result.status).toBe('draft');
  });

  it('accepts sent metadata fields', () => {
    const result = EmailCampaignSchema.parse({
      subject: 'Reunion Reminder',
      body: 'See you soon!',
      status: 'sent',
      sentAt: '2026-07-01T12:00:00.000Z',
      sentBy: '11111111-1111-1111-1111-111111111111',
      recipientCount: 42,
    });

    expect(result.recipientCount).toBe(42);
    expect(result.sentBy).toBe('11111111-1111-1111-1111-111111111111');
  });

  it('rejects invalid status', () => {
    expect(() =>
      EmailCampaignSchema.parse({
        subject: 'Hello',
        body: 'Body',
        status: 'queued',
      }),
    ).toThrow();
  });

  it('rejects negative recipient counts', () => {
    expect(() =>
      EmailCampaignSchema.parse({
        subject: 'Hello',
        body: 'Body',
        status: 'draft',
        recipientCount: -1,
      }),
    ).toThrow();
  });
});

describe('EmailCampaignInsertSchema', () => {
  it('accepts subject and body without server fields', () => {
    const result = EmailCampaignInsertSchema.parse({
      subject: 'Reunion Reminder',
      body: 'See you soon!',
    });

    expect(result.subject).toBe('Reunion Reminder');
  });

  it('rejects payloads that include status', () => {
    expect(() =>
      EmailCampaignInsertSchema.parse({
        subject: 'Hello',
        body: 'Body',
        status: 'sent',
      }),
    ).toThrow();
  });
});
