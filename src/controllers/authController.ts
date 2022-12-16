import { Request, Response } from 'express';
import { RegisterUserInput } from '../schemas/user.schema';
import User from '../models/User';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError } from '../utils/errors';
import { attachTokenCookies, createRefreshToken } from '../utils/auth';

export const register = async (req: Request<{}, {}, RegisterUserInput['body']>, res: Response) => {
  const { name, email, password } = req.body;

  const isDuplicateEmail = await User.findOne({ email });
  if (isDuplicateEmail) throw new BadRequestError('This email address is already taken.');

  const user = await User.create({ name, email, password });

  const refreshToken = await createRefreshToken(req, user.id);
  await attachTokenCookies(res, user.id, refreshToken);

  return res.status(StatusCodes.CREATED).send(user);
};

export const login = async (req: Request, res: Response) => {};

export const logout = async (req: Request, res: Response) => {};
