import { Request, Response } from 'express';
import { LoginUserInput, RegisterUserInput } from '../schemas/user.schema';
import User from '../models/User';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError, UnauthenticatedError } from '../utils/errors';
import { attachTokenCookies, compareTokenInfo, createRefreshToken, generateTokenHash } from '../utils/auth';
import Token from '../models/Token';

export const register = async (req: Request<{}, {}, RegisterUserInput['body']>, res: Response) => {
  const { name, email, password } = req.body;

  const isDuplicateEmail = await User.findOne({ email });
  if (isDuplicateEmail) throw new BadRequestError('This email address is already taken.');

  const user = await User.create({ name, email, password });

  const refreshToken = await createRefreshToken(req, user.id);
  await attachTokenCookies(res, user.id, refreshToken);

  return res.status(StatusCodes.CREATED).send({ id: user.id, name: user.name, email: user.email });
};

export const login = async (req: Request<{}, {}, LoginUserInput['body']>, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError('Invalid email or password.');

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) throw new UnauthenticatedError('Invalid email or password.');

  const existingTokens = await Token.find({ user: user.id });
  let currentToken = existingTokens.find((token) => compareTokenInfo(req, token));

  if (currentToken) {
    currentToken.refreshToken = generateTokenHash();
    await currentToken.save();
    await attachTokenCookies(res, user.id, currentToken.refreshToken);
  } else {
    const refreshToken = await createRefreshToken(req, user.id);
    await attachTokenCookies(res, user.id, refreshToken);
  }

  return res.status(StatusCodes.OK).send({ id: user.id, name: user.name, email: user.email });
};

export const logout = async (req: Request, res: Response) => {
  await Token.findOneAndDelete({ user: req.userId });

  res.cookie('accessToken', false, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now()),
  });

  res.cookie('refreshToken', false, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).send('Logged out');
};
