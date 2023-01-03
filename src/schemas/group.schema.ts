import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

const groupSchema = z.object({
  name: z.string().trim().min(3).max(200),
});

const idSchema = z.string().refine((val) => isValidObjectId(val));

export const createGroupSchema = z.object({ body: groupSchema });
export type createGroupInput = z.infer<typeof createGroupSchema>;

export const genericGroupIdSchema = z.object({ params: z.object({ id: idSchema }) });
export type genericGroupIdInput = z.infer<typeof genericGroupIdSchema>;

export const genericGroupAndUserIdSchema = z.object({ params: z.object({ id: idSchema, userId: idSchema }) });
export type genericGroupAndUserIdInput = z.infer<typeof genericGroupAndUserIdSchema>;

export const joinGroupSchema = z.object({ params: z.object({ link: z.string().uuid() }) });
export type joinGroupInput = z.infer<typeof joinGroupSchema>;
