import express from 'express';
import {
  createContribution,
  createProduct,
  createWishlist,
  deleteContribution,
  deleteProduct,
  deleteWishlist,
  getAllWishlists,
  getUserWishlist,
  getWishlist,
  modifyContribution,
  modifyProduct,
} from '../controllers/wishlistController';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { eventAndProductIdSchema, eventIdSchema, idSchema, userIdSchema } from '../schemas/generics.schema';
import {
  createContributionSchema,
  createProductsSchema,
  modifyContributionSchema,
  modifyProductsSchema,
} from '../schemas/product.schema';
import { createWishlistSchema } from '../schemas/wishlist.schema';

const router = express.Router();

router.post('/', authenticate, validate(createWishlistSchema)), createWishlist;
router.post('/product/:eventId', authenticate, validate(createProductsSchema), createProduct);
router.post('/contribution/:productId/:eventId', authenticate, validate(createContributionSchema), createContribution);

router.patch('/product/:productId/:eventId', authenticate, validate(modifyProductsSchema), modifyProduct);
router.patch('/contribution/:productId/:eventId', authenticate, validate(modifyContributionSchema), modifyContribution);

router.get('/:id', authenticate, validate(idSchema), getWishlist);
router.get('/my/:eventId', authenticate, validate(eventIdSchema), getUserWishlist);
router.get('/all/:eventId', authenticate, validate(eventIdSchema), getAllWishlists);

router.delete('/:id', authenticate, validate(idSchema), deleteWishlist);
router.delete('/product/:productId/:eventId', validate(eventAndProductIdSchema), deleteProduct);
router.delete('/contribution/:productId/:eventId', authenticate, validate(eventAndProductIdSchema), deleteContribution);

export default router;
