import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Event from '../models/Event';
import { GroupType } from '../models/Group';
import Wishlist, { wishlistDocumentWithIds } from '../models/Wishlist';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { formatUserWishlist, formatWishlist } from '../utils/responseFormat';
import { fixPrices } from '../utils/helpers';
import {
  createWishlistInput,
  createProductInput,
  createContributionInput,
  modifyProductInput,
  modifyContributionInput,
  getWishlistInput,
  getUserWishlistInput,
  getAllWishlistsInput,
  deleteWishlistInput,
  deleteProductInput,
  deleteContributionInput,
} from '../schemas/wishlist.schema';

const validateEvent = async (eventId: string, userId: string | undefined) => {
  const event = await Event.findById(eventId).populate<{ group: GroupType }>('group');

  if (!event) throw new BadRequestError(`No event with id: ${eventId}`);
  if (!event.group.members.some((member) => String(member.user) === userId))
    throw new UnauthorizedError('No rights to access this event.');
};

export const createWishlist = async (req: Request<createWishlistInput['params']>, res: Response) => {
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
  const { wishlistId } = req.params;
  const { name, price } = req.body;

  const updatedWishlist = await Wishlist.findOneAndUpdate(
    { _id: wishlistId, user: req.userId },
    { $push: { products: { name, price } } },
    { returnDocument: 'after' }
  );

  if (!updatedWishlist) throw new BadRequestError(`No wishlist with id: ${wishlistId} connected to the user.`);

  return res.status(StatusCodes.CREATED).send(formatUserWishlist(updatedWishlist as wishlistDocumentWithIds));
};

export const createContribution = async (
  req: Request<createContributionInput['params'], {}, createContributionInput['body']>,
  res: Response
) => {
  const { wishlistId, productId } = req.params;
  const { amount } = req.body;

  const wishlist = (await Wishlist.findOne({
    _id: wishlistId,
    user: { $ne: req.userId },
  })) as wishlistDocumentWithIds;

  if (!wishlist) throw new BadRequestError(`No wishlist with id: ${wishlistId}.`);

  const event = (await Event.findById(wishlist.event).populate<{ group: GroupType }>('group'))!;
  if (!event.group.members.some((member) => String(member.user) === req.userId))
    throw new UnauthorizedError('No rights to access this wishlist.');

  const product = wishlist.products.find((product) => product.id === productId);
  if (!product) throw new BadRequestError(`No product with id: ${productId}`);

  if (product.contributions.some((contribution) => String(contribution.user) === req.userId))
    throw new BadRequestError('Contribution already exists.');
  if (product.isClosed) throw new BadRequestError('Contribution already fulfilled.');

  const currentContributionAmount = product.contributions.reduce(
    (sum, contribution) => (sum += contribution.outdated ? 0 : contribution.amount),
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

export const modifyProduct = async (
  req: Request<modifyProductInput['params'], {}, modifyProductInput['body']>,
  res: Response
) => {
  const { wishlistId, productId } = req.params;
  const { name, price } = req.body;

  const wishlist = (await Wishlist.findOne({ _id: wishlistId, user: req.userId })) as wishlistDocumentWithIds;
  if (!wishlist) throw new BadRequestError(`No wishlist with id: ${wishlistId} connected to the user.`);

  const productIndex = wishlist.products.findIndex((product) => product.id === productId);
  if (productIndex === -1) throw new BadRequestError(`No product with id: ${productId}.`);

  if (name) wishlist.products[productIndex].name = name;
  if (price) {
    wishlist.products[productIndex].price = price;
    wishlist.products[productIndex].isClosed = false;
    wishlist.products[productIndex].contributions.forEach((contribution) => (contribution.outdated = true));
  }
  await wishlist.save();

  return res.status(StatusCodes.OK).send(formatUserWishlist(wishlist));
};

export const modifyContribution = async (
  req: Request<modifyContributionInput['params'], {}, modifyContributionInput['body']>,
  res: Response
) => {
  const { wishlistId, productId } = req.params;
  const { amount } = req.body;

  const wishlist = (await Wishlist.findOne({ _id: wishlistId, user: { $ne: req.userId } })) as wishlistDocumentWithIds;
  if (!wishlist) throw new BadRequestError(`No wishlist with id: ${wishlistId}.`);

  const event = (await Event.findById(wishlist.event).populate<{ group: GroupType }>('group'))!;
  if (!event.group.members.some((member) => String(member.user) === req.userId))
    throw new UnauthorizedError('No rights to access this wishlist.');

  const product = wishlist.products.find((product) => product.id === productId);
  if (!product) throw new BadRequestError(`No product with id: ${productId}`);

  if (!product.contributions.some((contribution) => String(contribution.user) === req.userId))
    throw new BadRequestError(`No contribution exists for product wit id: ${productId}.`);

  const currentContributionAmount = product.contributions.reduce(
    (sum, contribution) =>
      (sum += contribution.outdated || String(contribution.user) === req.userId ? 0 : contribution.amount),
    0
  );

  if (fixPrices(currentContributionAmount + amount) > product.price)
    throw new BadRequestError(
      `Contribution amount is too high. Max: ${fixPrices(product.price - currentContributionAmount)}.`
    );

  const isClosed = fixPrices(currentContributionAmount + amount) === product.price;

  const updatedWishlist = await Wishlist.findOneAndUpdate(
    { _id: wishlist.id, products: { $elemMatch: { 'contributions.user': req.userId } } },
    {
      'products.$.contributions.$[innerArrayElement].amount': amount,
      'products.$.contributions.$[innerArrayElement].outdated': false,
      'products.$.isClosed': isClosed,
    },
    {
      arrayFilters: [{ 'innerArrayElement.user': req.userId }],
      returnDocument: 'after',
    }
  );

  return res.status(StatusCodes.CREATED).send(formatWishlist(updatedWishlist as wishlistDocumentWithIds));
};
//TODO: test
export const getWishlist = async (req: Request<getWishlistInput['params']>, res: Response) => {
  const { wishlistId } = req.params;
  const wishlist = await Wishlist.findOne({ _id: wishlistId, user: { $ne: req.userId } });

  if (!wishlist) throw new BadRequestError(`No wishlist with id: ${wishlistId}.`);

  const event = (await Event.findById(wishlist.event).populate<{ group: GroupType }>('group'))!;
  if (!event.group.members.some((member) => String(member.user) === req.userId))
    throw new UnauthorizedError('No rights to access this wishlist.');

  return res.status(StatusCodes.OK).send(formatWishlist(wishlist as wishlistDocumentWithIds));
};

export const getUserWishlist = async (req: Request<getUserWishlistInput['params']>, res: Response) => {
  const { eventId } = req.params;

  const wishlist = await Wishlist.findOne({ event: eventId, user: req.userId });
  if (!wishlist) throw new BadRequestError(`No wishlist connected to event: ${eventId}.`);

  return res.status(StatusCodes.CREATED).send(formatUserWishlist(wishlist as wishlistDocumentWithIds));
};

export const getAllWishlists = async (req: Request<getAllWishlistsInput['params']>, res: Response) => {
  const { eventId } = req.params;
  validateEvent(eventId, req.userId);

  const wishlists = await Wishlist.find({ event: eventId });
  const formattedWishlists = wishlists.map((wishlist) => formatWishlist(wishlist as wishlistDocumentWithIds));

  return res.status(StatusCodes.CREATED).send(formattedWishlists);
};

export const deleteWishlist = async (req: Request<deleteWishlistInput['params']>, res: Response) => {
  const { wishlistId } = req.params;
  const deletedWishlist = await Wishlist.findOneAndDelete({ _id: wishlistId, user: req.userId });

  if (!deletedWishlist) throw new BadRequestError(`No wishlist with id: ${wishlistId} connected to the user.`);
  return res.status(StatusCodes.OK).send('Wishlist deleted.');
};

export const deleteProduct = async (req: Request<deleteProductInput['params']>, res: Response) => {
  const { wishlistId, productId } = req.params;
};

export const deleteContribution = async (req: Request<deleteContributionInput['params']>, res: Response) => {};
