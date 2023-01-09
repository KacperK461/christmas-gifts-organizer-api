import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

export const idSchema = z.string().refine((val) => isValidObjectId(val));

export const genericIdSchema = z.object({ params: z.object({ id: idSchema }) });
export type genericIdInput = z.infer<typeof genericIdSchema>;

export const genericIdAndUserIdSchema = z.object({ params: z.object({ id: idSchema, userId: idSchema }) });
export type genericIdAndUserIdInput = z.infer<typeof genericIdAndUserIdSchema>;
