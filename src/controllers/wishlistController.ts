import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Event from '../models/Event';
import { GroupType } from '../models/Group';
import Wishlist, { wishlistDocumentWithIds } from '../models/Wishlist';
import { eventIdInput } from '../schemas/generics.schema';
import { createContributionInput, createProductInput } from '../schemas/product.schema';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { formatUserWishlist, formatWishlist } from '../utils/responseFormat';
import { fixPrices } from '../utils/helpers';

const validateEvent = async (eventId: string, userId: string | undefined) => {
  const event = await Event.findById(eventId).populate<{ group: GroupType }>('group');

  if (!event) throw new BadRequestError(`No event with id: ${eventId}`);
  if (!event.group.members.some((member) => String(member.user) === userId))
    throw new UnauthorizedError('No rights to access this event.');
};

export const createWishlist = async (req: Request<eventIdInput['params']>, res: Response) => {
  const { eventId } = req.params;
  await validateEvent(eventId, req.userId);

  const isWishlist = await Wishlist.findOne({ event: eventId, user: req.userId });
  if (isWishlist) throw new BadRequestError('Wishlist already exists.');

  const wishlist = await Wishlist.create({ event: eventId, user: req.userId });
  return res.status(StatusCodes.CREATED).send(formatUserWishlist(wishlist));
};

export const createProduct = async (
  req: Request<createProductInput['params'], {}, createProductInput['body']>,
  res: Response
) => {
  const { eventId } = req.params;
  const { name, price } = req.body;

  const wishlist = await Wishlist.findOne({ event: eventId, user: req.userId });
  if (!wishlist) throw new BadRequestError(`No wishlist connected to event: ${eventId}`);

  const updatedWishlist = await Wishlist.findByIdAndUpdate(
    wishlist.id,
    { $push: { products: { name, price } } },
    { returnDocument: 'after' }
  );

  return res.status(StatusCodes.CREATED).send(formatUserWishlist(updatedWishlist as wishlistDocumentWithIds));
};

export const createContribution = async (
  req: Request<createContributionInput['params'], {}, createContributionInput['body']>,
  res: Response
) => {
  const { eventId, productId } = req.params;
  const { amount } = req.body;
  await validateEvent(eventId, req.userId);

  const wishlist = (await Wishlist.findOne({
    event: eventId,
    user: { $ne: req.userId },
    'products._id': productId,
  })) as wishlistDocumentWithIds;

  if (!wishlist) throw new BadRequestError(`No product with id: ${productId}`);
  const product = wishlist.products.find((product) => product.id === productId)!;

  if (product.contributions.some((contribution) => String(contribution.user) === req.userId))
    throw new BadRequestError('Contribution already exists.');
  if (product.isClosed) throw new BadRequestError('Contribution already fulfilled.');

  const currentContributionAmount = product.contributions.reduce(
    (sum, contribution) => (sum += contribution.amount),
    0
  );

  if (fixPrices(currentContributionAmount + amount) > product.price)
    throw new BadRequestError(
      `Contribution amount is too high. Max: ${fixPrices(product.price - currentContributionAmount)}.`
    );

  const isClosed = fixPrices(currentContributionAmount + amount) === product.price;
  const updatedWishlist = await Wishlist.findOneAndUpdate(
    { _id: wishlist.id, 'products._id': productId },
    { $push: { 'products.$.contributions': { user: req.userId, amount: amount } }, 'products.$.isClosed': isClosed },
    { returnDocument: 'after' }
  );

  return res.status(StatusCodes.CREATED).send(formatWishlist(updatedWishlist as wishlistDocumentWithIds));
};

export const modifyProduct = async (req: Request, res: Response) => {};

export const modifyContribution = async (req: Request, res: Response) => {};

export const getWishlist = async (req: Request, res: Response) => {};

export const getUserWishlist = async (req: Request, res: Response) => {};

export const getAllWishlists = async (req: Request, res: Response) => {};

export const deleteWishlist = async (req: Request, res: Response) => {};

export const deleteProduct = async (req: Request, res: Response) => {};

export const deleteContribution = async (req: Request, res: Response) => {};
