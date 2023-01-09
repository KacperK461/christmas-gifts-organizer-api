import { z } from 'zod';
import { id } from './generics.schema';

const groupSchema = z.object({
  name: z.string().trim().min(3).max(200),
});

export const createGroupSchema = z.object({ body: groupSchema });
export type createGroupInput = z.infer<typeof createGroupSchema>;

export const joinGroupSchema = z.object({ params: z.object({ link: z.string().uuid() }) });
export type joinGroupInput = z.infer<typeof joinGroupSchema>;

export const modifyGroupSchema = z.object({ params: z.object({ id: id }), body: groupSchema.partial() });
export type modifyGroupInput = z.infer<typeof modifyGroupSchema>;
