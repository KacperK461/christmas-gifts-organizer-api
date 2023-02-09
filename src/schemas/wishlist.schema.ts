import { z } from 'zod';
import { id } from './generics.schema';

export const createWishlistSchema = z.object({ params: z.object({ eventId: id }) });
export type createWishlistInput = z.infer<typeof createWishlistSchema>;

export const getWishlistSchema = z.object({ params: z.object({ wishlistId: id }) });
export type getWishlistInput = z.infer<typeof getWishlistSchema>;

export const getUserWishlistSchema = z.object({ params: z.object({ eventId: id }) });
export type getUserWishlistInput = z.infer<typeof getUserWishlistSchema>;

export const getAllWishlistsSchema = z.object({ params: z.object({ eventId: id }) });
export type getAllWishlistsInput = z.infer<typeof getUserWishlistSchema>;

export const deleteWishlistSchema = z.object({ params: z.object({ wishlistId: id }) });
export type deleteWishlistInput = z.infer<typeof getWishlistSchema>;

const productSchema = z.object({
  name: z.string().min(3).max(1000),
  price: z
    .number()
    .min(0.01)
    .refine((val) => (val * 100) % 1 === 0),
});

export const createProductSchema = z.object({ params: z.object({ wishlistId: id }), body: productSchema });
export type createProductInput = z.infer<typeof createProductSchema>;

export const modifyProductSchema = z.object({
  params: z.object({ wishlistId: id, productId: id }),
  body: productSchema.partial(),
});
export type modifyProductInput = z.infer<typeof modifyProductSchema>;

export const deleteProductSchema = z.object({ params: z.object({ wishlistId: id, productId: id }) });
export type deleteProductInput = z.infer<typeof deleteProductSchema>;

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
  params: z.object({ wishlistId: id, productId: id }),
  body: contributionSchema,
});
export type createContributionInput = z.infer<typeof createContributionSchema>;

export const modifyContributionSchema = z.object({
  params: z.object({ wishlistId: id, productId: id }),
  body: contributionSchema,
});
export type modifyContributionInput = z.infer<typeof modifyContributionSchema>;

export const deleteContributionSchema = z.object({ params: z.object({ wishlistId: id, productId: id }) });
export type deleteContributionInput = z.infer<typeof deleteContributionSchema>;
