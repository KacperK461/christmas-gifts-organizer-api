import { z } from 'zod';
import { id } from './generics.schema';

const wishlistSchema = z.object({
  user: id,
  event: id,
});

export const createWishlistSchema = z.object({ body: wishlistSchema });
export type createWishlistInput = z.infer<typeof createWishlistSchema>;
