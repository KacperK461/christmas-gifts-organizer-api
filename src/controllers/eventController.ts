import { Request, Response } from 'express';
import { createEventInput, modifyEventInput } from '../schemas/event.schema';
import { groupIdInput, idInput } from '../schemas/generics.schema';

export const createEvent = (
  req: Request<createEventInput['params'], {}, createEventInput['body']>,
  res: Response
) => {};

export const deleteEvent = (req: Request<idInput['params']>, res: Response) => {};

export const modifyEvent = (
  req: Request<modifyEventInput['params'], {}, modifyEventInput['body']>,
  res: Response
) => {};

export const getAllEvents = (req: Request<groupIdInput['params']>, res: Response) => {};

export const getEvent = (req: Request<idInput['params']>, res: Response) => {};
