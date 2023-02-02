import { Request, Response } from 'express';
import Group from '../models/Group';
import Event from '../models/Event';
import { createEventInput, modifyEventInput } from '../schemas/event.schema';
import { groupIdInput, idInput } from '../schemas/generics.schema';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { StatusCodes } from 'http-status-codes';
import { formatEvent } from '../utils/responseFormat';

export const createEvent = async (req: Request<{}, {}, createEventInput['body']>, res: Response) => {
  const { name, group, date } = req.body;

  const isGroup = await Group.findById(group);
  if (!isGroup) throw new BadRequestError(`No group with id: ${group}.`);
  if (!isGroup.members.some((member) => String(member.user) === req.userId))
    throw new UnauthorizedError('No rights to access this group.');

  const event = await Event.create({ name, group, date });
  return res.status(StatusCodes.CREATED).send(formatEvent(event));
};

export const deleteEvent = async (req: Request<idInput['params']>, res: Response) => {
  const { id } = req.params;

  const event = await Event.findById(id);
  if (!event) throw new BadRequestError(`No event with id: ${id}.`);

  const isGroup = await Group.findOne({ id: event.group, 'members.user': req.userId });
  if (!isGroup) throw new UnauthorizedError('No rights to access this event.');

  await event.delete();
  return res.status(StatusCodes.OK).send('Event deleted.');
};

export const modifyEvent = async (
  req: Request<modifyEventInput['params'], {}, modifyEventInput['body']>,
  res: Response
) => {
  const { id } = req.params;
  const { name, date } = req.body;

  const event = await Event.findById(id);
  if (!event) throw new BadRequestError(`No event with id: ${id}.`);

  const isGroup = await Group.findOne({ id: event.group, 'members.user': req.userId });
  if (!isGroup) throw new UnauthorizedError('No rights to access this event.');

  if (name) event.name = name;
  if (date) event.date = date;
  await event.save();

  return res.status(StatusCodes.OK).send(formatEvent(event));
};

export const getAllEvents = async (req: Request<groupIdInput['params']>, res: Response) => {
  const { groupId } = req.params;

  const isGroup = await Group.findOne({ id: groupId, 'members.user': req.userId });
  if (!isGroup) throw new UnauthorizedError('No rights to access events from this group.');

  const events = await Event.find({ group: groupId });
  const formattedEvents = events.map((event) => formatEvent(event));

  return res.status(StatusCodes.OK).send(formattedEvents);
};

export const getEvent = async (req: Request<idInput['params']>, res: Response) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  if (!event) throw new BadRequestError(`No event with id: ${id}.`);

  const isGroup = await Group.findOne({ id: event.group, 'members.user': req.userId });
  if (!isGroup) throw new UnauthorizedError('No rights to access this event.');

  return res.status(StatusCodes.OK).send(formatEvent(event));
};
