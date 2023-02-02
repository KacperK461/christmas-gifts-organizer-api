import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Event from '../models/Event';
import { GroupType } from '../models/Group';
import Wishlist, { wishlistDocument } from '../models/Wishlist';
import { eventIdInput } from '../schemas/generics.schema';
import { createProductInput } from '../schemas/product.schema';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { formatUserWishlist } from '../utils/responseFormat';

const validateEvent = async (eventId: string, userId: string | undefined) => {
  const event = await Event.findById(eventId).populate<{ group: GroupType }>('group');

  if (!event) throw new BadRequestError(`No event with id: ${event}`);
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

  const updatedWishlist = (await Wishlist.findByIdAndUpdate(
    wishlist.id,
    { $push: { products: { name, price } } },
    { returnDocument: 'after' }
  )) as wishlistDocument;

  return res.status(StatusCodes.CREATED).send(formatUserWishlist(updatedWishlist));
};

export const createContribution = async (req: Request, res: Response) => {};

export const modifyProduct = async (req: Request, res: Response) => {};

export const modifyContribution = async (req: Request, res: Response) => {};

export const getWishlist = async (req: Request, res: Response) => {};

export const getUserWishlist = async (req: Request, res: Response) => {};

export const getAllWishlists = async (req: Request, res: Response) => {};

export const deleteWishlist = async (req: Request, res: Response) => {};

export const deleteProduct = async (req: Request, res: Response) => {};

export const deleteContribution = async (req: Request, res: Response) => {};
