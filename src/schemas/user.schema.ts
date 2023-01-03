import { z } from 'zod';

const userSchema = z.object({
  name: z.string().trim().min(3).max(20),
  email: z.string().trim().email(),
  password: z
    .string()
    .trim()
    .min(8)
    .refine((val) => val.split(' ').length === 1),
});

export const registerUserSchema = z.object({ body: userSchema });
export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export const loginUserSchema = z.object({ body: userSchema.omit({ name: true }) });
export type LoginUserInput = z.infer<typeof loginUserSchema>;
