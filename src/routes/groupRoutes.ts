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
import { createGroupSchema, joinGroupSchema, modifyGroupSchema } from '../schemas/group.schema';
import { genericIdSchema, genericIdAndUserIdSchema } from '../schemas/generics.schema';

const router = express.Router();
router.patch('/:id', authenticate, validate(modifyGroupSchema), modifyGroup);
router.get('/link/:id', authenticate, validate(genericIdSchema), getLink);
router.patch('/link/:id', authenticate, validate(genericIdSchema), changeLink);
router.delete('/:id/:userId', authenticate, validate(genericIdAndUserIdSchema), kickMember);
router.patch('/admin/grant/:id/:userId', authenticate, validate(genericIdAndUserIdSchema), grantAdmin);
router.patch('/admin/revoke/:id/:userId', authenticate, validate(genericIdAndUserIdSchema), revokeAdmin);
router.delete('/:id', authenticate, validate(genericIdSchema), deleteGroup);

router.post('/create', authenticate, validate(createGroupSchema), createGroup);
router.post('/join/:link', authenticate, validate(joinGroupSchema), joinGroup);
router.delete('/leave/:id', authenticate, validate(genericIdSchema), leaveGroup);
router.get('/all', authenticate, getAllGroups);
router.get('/:id', authenticate, validate(genericIdSchema), getGroup);

export default router;
