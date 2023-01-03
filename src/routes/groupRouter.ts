import express from 'express';
import {
  changeLink,
  deleteGroup,
  getLink,
  grantAdmin,
  kickMember,
  modifyGroup,
  revokeAdmin,
} from '../controllers/groupAdminController';
import { createGroup, getAllGroups, getGroup, joinGroup, leaveGroup } from '../controllers/groupPublicController';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import {
  createGroupSchema,
  genericGroupIdSchema,
  genericGroupAndUserIdSchema,
  joinGroupSchema,
} from '../schemas/group.schema';

const router = express.Router();
router.put('/modify/:id', authenticate, validate(createGroupSchema), modifyGroup);
router.get('/link/:id', authenticate, validate(genericGroupIdSchema), getLink);
router.patch('/link/change', authenticate, changeLink);
router.patch('/kick/:id/:userId', authenticate, validate(genericGroupAndUserIdSchema), kickMember);
router.patch('/admin/grant/:id/:userId', authenticate, validate(genericGroupAndUserIdSchema), grantAdmin);
router.patch('/admin/revoke/:id/:userId', authenticate, validate(genericGroupAndUserIdSchema), revokeAdmin);
router.delete('/delete/:id', authenticate, validate(genericGroupIdSchema), deleteGroup);

router.post('/create', authenticate, createGroup);
router.patch('/join/:link', authenticate, validate(joinGroupSchema), joinGroup);
router.patch('/leave/:id', validate(genericGroupIdSchema), authenticate, leaveGroup);
router.get('/all', authenticate, getAllGroups);
router.get('/:id', authenticate, validate(genericGroupIdSchema), getGroup);

export default router;
