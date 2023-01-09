import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Group from '../models/Group';
import { modifyGroupInput } from '../schemas/group.schema';
import { idAndUserIdInput, idInput } from '../schemas/generics.schema';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import crypto from 'crypto';
import { formatGroup } from '../utils/responseFormat';

const getAdminGroup = async (req: Request<idInput['params']>) => {
  const { id } = req.params;
  const group = await Group.findOne({ id });
  if (!group) throw new BadRequestError(`No group with id: ${id}.`);

  if (!group.members.some((member) => String(member.user) === req.userId && member.isAdmin))
    throw new UnauthorizedError();

  return group;
};

export const modifyGroup = async (
  req: Request<modifyGroupInput['params'], {}, modifyGroupInput['body']>,
  res: Response
) => {
  const group = await getAdminGroup(req);
  const { name } = req.body;

  if (name) group.name = name;
  await group.save();

  return res.status(StatusCodes.OK).send(await formatGroup(group));
};

export const getLink = async (req: Request<idInput['params']>, res: Response) => {
  const group = await getAdminGroup(req);
  return res.status(StatusCodes.OK).send(group.accessLink);
};

export const changeLink = async (req: Request<idInput['params']>, res: Response) => {
  const group = await getAdminGroup(req);
  group.accessLink = crypto.randomUUID();

  await group.save();
  return res.status(StatusCodes.OK).send(group.accessLink);
};

export const kickMember = async (req: Request<idAndUserIdInput['params']>, res: Response) => {
  const group = await getAdminGroup(req);
  const { userId } = req.params;

  const index = group.members.findIndex((member) => String(member.user) === userId);
  if (index === -1) throw new BadRequestError(`No user with id: ${userId}`);

  group.members.splice(index, 1);
  await group.save();
  return res.status(StatusCodes.OK).send('User deleted from the group');
};

export const grantAdmin = async (req: Request<idAndUserIdInput['params']>, res: Response) => {
  const group = await getAdminGroup(req);
  const { userId } = req.params;

  const index = group.members.findIndex((member) => String(member.user) === userId);
  if (index === -1) throw new BadRequestError(`No user with id: ${userId}`);

  group.members[index].isAdmin = true;
  await group.save();
  return res.status(StatusCodes.OK).send(`Admin rights granted to user: ${userId}`);
};

export const revokeAdmin = async (req: Request<idAndUserIdInput['params']>, res: Response) => {
  const group = await getAdminGroup(req);
  const { userId } = req.params;

  const index = group.members.findIndex((member) => String(member.user) === userId);
  if (index === -1) throw new BadRequestError(`No user with id: ${userId}`);

  group.members[index].isAdmin = false;
  await group.save();
  return res.status(StatusCodes.OK).send(`Admin rights revoked from user: ${userId}`);
};

export const deleteGroup = async (req: Request<idAndUserIdInput['params']>, res: Response) => {
  const group = await getAdminGroup(req);
  await group.delete();
  return res.status(StatusCodes.OK).send('Group deleted');
};
