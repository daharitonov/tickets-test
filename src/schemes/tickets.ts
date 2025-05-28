import { z } from 'zod';

export const CreateTicketSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

export const CompleteTicketSchema = z.object({
  resolution: z.string().min(1, 'Resolution is required'),
});

export const CancelTicketSchema = z.object({
  reason: z.string().min(1, 'Reason is required'),
});

export const TicketIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number'),
});

const dateOnly = z.coerce.date();

  export const ListTicketQuerySchema = z
  .object({
    date: dateOnly.optional(),
    startDate: dateOnly.optional(),
    endDate: dateOnly.optional(),
  })
  .refine(
    (data) =>
      // Либо вообще ничего
      (!data.date && !data.startDate && !data.endDate) ||
      // Либо только date
      (!!data.date && !data.startDate && !data.endDate) ||
      // Либо startDate и endDate
      (!data.date && !!data.startDate && !!data.endDate),
    {
      message: 'In the parameter pass "date", or "startDate" and "endDate", or nothing',
      path: ['date'],
    }
  );