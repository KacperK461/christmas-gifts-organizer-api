import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

export const id = z.string().refine((val) => isValidObjectId(val));

export const idSchema = z.object({ params: z.object({ id: id }) });
export type idInput = z.infer<typeof idSchema>;

export const idAndUserIdSchema = z.object({ params: z.object({ id: id, userId: id }) });
export type idAndUserIdInput = z.infer<typeof idAndUserIdSchema>;

export const userIdSchema = z.object({ params: z.object({ userId: id }) });
export type userIdInput = z.infer<typeof userIdSchema>;

export const groupIdSchema = z.object({ params: z.object({ groupId: id }) });
export type groupIdInput = z.infer<typeof groupIdSchema>;

export const eventIdSchema = z.object({ params: z.object({ eventId: id }) });
export type eventIdInput = z.infer<typeof eventIdSchema>;

export const eventAndProductIdSchema = z.object({ params: z.object({ eventId: id, productId: id }) });
export type eventAndProductIdInput = z.infer<typeof eventAndProductIdSchema>;
