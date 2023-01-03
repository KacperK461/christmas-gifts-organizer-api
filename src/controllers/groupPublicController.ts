import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Group from '../models/Group';
import { createGroupInput, genericGroupIdInput, joinGroupInput } from '../schemas/group.schema';
import crypto from 'crypto';
import { BadRequestError } from '../utils/errors';

export const createGroup = async (req: Request<{}, {}, createGroupInput['body']>, res: Response) => {
  const { name } = req.body;
  const accessLink = crypto.randomUUID();
  const member = {
    user: req.userId,
    isAdmin: true,
  };

  await Group.create({ name, accessLink, members: [member] });
  return res.status(StatusCodes.CREATED).send('Group created');
};

export const joinGroup = async (req: Request<joinGroupInput['params']>, res: Response) => {
  const { link } = req.params;
  const group = await Group.findOne({ accessLink: link });

  if (!group) throw new BadRequestError('Link is invalid.');
  if (group.members.find((member) => member.user == req.userId) !== undefined)
    throw new BadRequestError('User has already joined the group.');

  await group.update({ $push: { members: { user: req.userId } } });
  return res.status(StatusCodes.OK).send('Joined successfully.');
};

export const leaveGroup = async (req: Request<genericGroupIdInput['params']>, res: Response) => {
  const { id } = req.params;
  const group = await Group.findByIdAndUpdate(id, { $pull: { members: { user: req.userId } } });

  if (!group) throw new BadRequestError('Group ID is invalid.');
  return res.status(StatusCodes.OK).send('Left successfully.');
};

export const getAllGroups = async (req: Request, res: Response) => {
  const groups = await Group.find({ 'members.user': req.userId })
    .select('id name members.user')
    .populate({ path: 'members.user', select: 'id name email' });

  groups.forEach((group) => group.members.map((member) => member.user));
  return res.status(StatusCodes.OK).send(groups);
};

export const getGroup = async (req: Request<genericGroupIdInput['params']>, res: Response) => {
  const { id } = req.params;
  const group = await Group.findById(id)
    .select('id name members.user')
    .populate({ path: 'members.user', select: 'id name email' });

  if (!group) throw new BadRequestError('Group ID is invalid.');

  group.members.map((member) => member.user);
  return res.status(StatusCodes.OK).send(group);
};
