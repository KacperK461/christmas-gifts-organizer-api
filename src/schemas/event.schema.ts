import { z } from 'zod';
import { id } from './generics.schema';

const eventSchema = z.object({
  name: z.string().trim().min(3).max(200),
  group: id,
  date: z.preprocess((arg) => {
    if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
  }, z.date()),
});

export const createEventSchema = z.object({ params: z.object({ groupId: id }), body: eventSchema });
export type createEventInput = z.infer<typeof createEventSchema>;

export const modifyEventSchema = z.object({
  params: z.object({ id: id }),
  body: eventSchema.omit({ group: true }).partial(),
});
export type modifyEventInput = z.infer<typeof modifyEventSchema>;
