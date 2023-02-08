import { z } from 'zod';
import { id } from './generics.schema';

const productSchema = z.object({
  name: z.string().min(3).max(1000),
  price: z
    .number()
    .min(0.01)
    .refine((val) => (val * 100) % 1 === 0),
});

export const createProductsSchema = z.object({ params: z.object({ eventId: id }), body: productSchema });
export type createProductInput = z.infer<typeof createProductsSchema>;

export const modifyProductsSchema = z.object({
  params: z.object({ eventId: id, productId: id }),
  body: productSchema.partial(),
});
export type modifyProductInput = z.infer<typeof modifyProductsSchema>;

const contributionSchema = z.object({
  amount: z
    .number()
    .min(0.01)
    .refine((val) => {
      const decimalDigits = val.toString().split('.')[1];
      if (!decimalDigits) return true;
      if (decimalDigits.length < 3) return true;
      return false;
    }),
});

export const createContributionSchema = z.object({
  params: z.object({ eventId: id, productId: id }),
  body: contributionSchema,
});
export type createContributionInput = z.infer<typeof createContributionSchema>;

export const modifyContributionSchema = z.object({
  params: z.object({ eventId: id, productId: id }),
  body: contributionSchema,
});
export type modifyContributionInput = z.infer<typeof modifyContributionSchema>;
