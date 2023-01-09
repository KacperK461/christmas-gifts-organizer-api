import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

export const id = z.string().refine((val) => isValidObjectId(val));

export const idSchema = z.object({ params: z.object({ id: id }) });
export type idInput = z.infer<typeof idSchema>;

export const idAndUserIdSchema = z.object({ params: z.object({ id: id, userId: id }) });
export type idAndUserIdInput = z.infer<typeof idAndUserIdSchema>;

export const groupIdSchema = z.object({ params: z.object({ groupId: id }) });
export type groupIdInput = z.infer<typeof groupIdSchema>;
