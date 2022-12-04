import { Request, Response, NextFunction } from 'express';

export const register = async (
  req: Request<{}, {}, { name: string; email: string; password: string }>,
  res: Response
) => {
  const { email, name, password } = req.body;

  console.log(email, name, password);
};

export const login = async (req: Request, res: Response) => {};

export const logout = async (req: Request, res: Response) => {};
