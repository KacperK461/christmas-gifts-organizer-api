import { Request, Response, NextFunction } from 'express';
import { HttpError, NotFoundError } from '../utils/errors';
import StatusCodes from 'http-status-codes';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError();
};

export const catchErrors = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).send(err.message);
};
