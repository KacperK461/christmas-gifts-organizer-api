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
import {
  createWishlistSchema,
  createProductSchema,
  createContributionSchema,
  modifyProductSchema,
  modifyContributionSchema,
  getWishlistSchema,
  getUserWishlistSchema,
  getAllWishlistsSchema,
  deleteWishlistSchema,
  deleteProductSchema,
  deleteContributionSchema,
} from '../schemas/wishlist.schema';

const router = express.Router();

router.post('/event/:eventId', authenticate, validate(createWishlistSchema), createWishlist);
router.post('/:wishlistId/product', authenticate, validate(createProductSchema), createProduct);
router.post(
  '/:wishlistId/product/:productId/contribution',
  authenticate,
  validate(createContributionSchema),
  createContribution
);

router.patch('/:wishlistId/product/:productId', authenticate, validate(modifyProductSchema), modifyProduct);
router.patch(
  '/:wishlistId/product/:productId/contribution',
  authenticate,
  validate(modifyContributionSchema),
  modifyContribution
);

router.get('/:wishlistId', authenticate, validate(getWishlistSchema), getWishlist);
router.get('/my/event/:eventId', authenticate, validate(getUserWishlistSchema), getUserWishlist);
router.get('/all/event/:eventId', authenticate, validate(getAllWishlistsSchema), getAllWishlists);

router.delete('/:wishlistId', authenticate, validate(deleteWishlistSchema), deleteWishlist);
router.delete('/:wishlistId/product/:productId', validate(deleteProductSchema), deleteProduct);
router.delete(
  '/:wishlistId/product/:productId/contribution',
  authenticate,
  validate(deleteContributionSchema),
  deleteContribution
);

export default router;
