import { Request, Response, NextFunction } from 'express';
import { RegisterUserInput } from '../schemas/user.schema';

export const register = async (req: Request<{}, {}, RegisterUserInput['body']>, res: Response) => {
  const { email, name, password } = req.body;

  res.send({ email, name, password });
};

export const login = async (req: Request, res: Response) => {};

export const logout = async (req: Request, res: Response) => {};
