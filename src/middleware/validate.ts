import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '../utils/errors';

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body, query, params } = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    req.body = body;
    req.query = query;
    req.params = params;
    return next();
  } catch (error) {
    if (error instanceof ZodError) throw new BadRequestError(JSON.stringify(error.format()));
    throw error;
  }
};
