import { Response, Request } from 'express';
import { V4 as paseto } from 'paseto';
import crypto from 'crypto';
import variables from '../config/variables';
import Token, { TokenType } from '../models/Token';

export type accessTokenPayload = { userId: string };
export type refreshTokenPayload = { userId: string; refreshToken: string };

export const signToken = async (payload: accessTokenPayload | refreshTokenPayload, expireInMilliseconds: number) => {
  return await paseto.sign({ ...payload }, variables.tokenSecret, { expiresIn: `${expireInMilliseconds / 1000}s` });
};

export const verifyToken = async (token: string) => {
  return (await paseto.verify(token, variables.tokenSecret)) as accessTokenPayload | refreshTokenPayload;
};

export const attachTokenCookies = async (res: Response, userId: string, _refreshToken: string) => {
  const accessToken = await signToken({ userId }, variables.accessTokenExp);
  const refreshToken = await signToken({ userId, refreshToken: _refreshToken }, variables.refreshTokenExp);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: !variables.isDevelopment,
    signed: true,
    expires: new Date(Date.now() + variables.accessTokenExp),
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: !variables.isDevelopment,
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
