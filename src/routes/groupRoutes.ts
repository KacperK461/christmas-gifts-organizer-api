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
import { idSchema, idAndUserIdSchema } from '../schemas/generics.schema';

const router = express.Router();
router.post('/create', authenticate, validate(createGroupSchema), createGroup);
router.post('/join/:link', authenticate, validate(joinGroupSchema), joinGroup);

router.patch('/:id', authenticate, validate(modifyGroupSchema), modifyGroup);
router.patch('/link/:id', authenticate, validate(idSchema), changeLink);
router.patch('/admin/grant/:id/:userId', authenticate, validate(idAndUserIdSchema), grantAdmin);
router.patch('/admin/revoke/:id/:userId', authenticate, validate(idAndUserIdSchema), revokeAdmin);

router.get('/link/:id', authenticate, validate(idSchema), getLink);
router.get('/all', authenticate, getAllGroups);
router.get('/:id', authenticate, validate(idSchema), getGroup);

router.delete('/leave/:id', authenticate, validate(idSchema), leaveGroup);
router.delete('/:id/:userId', authenticate, validate(idAndUserIdSchema), kickMember);
router.delete('/:id', authenticate, validate(idSchema), deleteGroup);

export default router;
