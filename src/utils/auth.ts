import { Response, Request } from 'express';
import { V4 as paseto } from 'paseto';
import crypto from 'crypto';
import variables from '../config/variables';
import Token, { TokenType } from '../models/Token';

export const createToken = async (payload: object, expireInMilliseconds: number) => {
  return await paseto.sign({ ...payload }, variables.tokenSecret, { expiresIn: `${expireInMilliseconds / 1000}s` });
};

export const verifyToken = async (token: string) => {
  return await paseto.verify(token, variables.tokenSecret);
};

export const attachTokenCookies = async (res: Response, userId: string, _refreshToken: string) => {
  const accessToken = await createToken({ userId }, variables.accessTokenExp);
  const refreshToken = await createToken({ userId, refreshToken: _refreshToken }, variables.refreshTokenExp);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now() + variables.accessTokenExp),
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now() + variables.refreshTokenExp),
  });
};

export const generateTokenHash = () => {
  return crypto.randomBytes(64).toString('hex');
};

export const createRefreshToken = async (req: Request, userId: string) => {
  const refreshToken = generateTokenHash();
  const ip = req.ip;
  const userAgent = req.headers['user-agent'];

  await Token.create({ refreshToken, ip, userAgent, user: userId });

  return refreshToken;
};

export const compareTokenInfo = (req: Request, token: TokenType) => {
  if (!token.isValid) return false;
  if (req.ip !== token.ip) return false;
  if (req.headers['user-agent'] !== token.userAgent) return false;
  return true;
};
