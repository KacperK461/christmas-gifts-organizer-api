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
  modifyGroupSchema,
} from '../schemas/group.schema';

const router = express.Router();
router.patch('/:id', authenticate, validate(modifyGroupSchema), modifyGroup);
router.get('/link/:id', authenticate, validate(genericGroupIdSchema), getLink);
router.patch('/link/:id', authenticate, validate(genericGroupIdSchema), changeLink);
router.delete('/:id/:userId', authenticate, validate(genericGroupAndUserIdSchema), kickMember);
router.patch('/admin/grant/:id/:userId', authenticate, validate(genericGroupAndUserIdSchema), grantAdmin);
router.patch('/admin/revoke/:id/:userId', authenticate, validate(genericGroupAndUserIdSchema), revokeAdmin);
router.delete('/:id', authenticate, validate(genericGroupIdSchema), deleteGroup);

router.post('/create', authenticate, validate(createGroupSchema), createGroup);
router.post('/join/:link', authenticate, validate(joinGroupSchema), joinGroup);
router.delete('/leave/:id', authenticate, validate(genericGroupIdSchema), leaveGroup);
router.get('/all', authenticate, getAllGroups);
router.get('/:id', authenticate, validate(genericGroupIdSchema), getGroup);

export default router;
