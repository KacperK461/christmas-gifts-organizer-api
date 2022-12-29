import { NextFunction, Response, Request } from 'express';
import Token from '../models/Token';
import {
  accessTokenPayload,
  attachTokenCookies,
  compareTokenInfo,
  refreshTokenPayload,
  verifyToken,
} from '../utils/auth';
import { UnauthenticatedError } from '../utils/errors';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken } = req.signedCookies;

    if (accessToken) {
      const { userId } = (await verifyToken(accessToken)) as accessTokenPayload;
      req.userId = userId;
      return next();
    }

    const payload = (await verifyToken(refreshToken)) as refreshTokenPayload;
    const token = await Token.findOne({ user: payload.userId, refreshToken: payload.refreshToken });

    if (!token) throw new UnauthenticatedError();
    if (!compareTokenInfo(req, token)) {
      token.isValid = false;
      await token.save();
      throw new UnauthenticatedError();
    }

    attachTokenCookies(res, payload.userId, token.refreshToken);
    req.userId = payload.userId;
    return next();
  } catch (error) {
    throw new UnauthenticatedError();
  }
};
