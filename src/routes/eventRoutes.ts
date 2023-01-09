import express from 'express';
import { createEvent, deleteEvent, getAllEvents, getEvent, modifyEvent } from '../controllers/eventController';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createEventSchema, modifyEventSchema } from '../schemas/event.schema';
import { groupIdSchema, idSchema } from '../schemas/generics.schema';

const router = express.Router();
router.post('/:groupId', authenticate, validate(createEventSchema), createEvent);
router.delete('/:id', authenticate, validate(idSchema), deleteEvent);
router.patch('/:id', authenticate, validate(modifyEventSchema), modifyEvent);
router.get('/all/:groupId', authenticate, validate(groupIdSchema), getAllEvents);
router.get('/:id', authenticate, validate(idSchema), getEvent);

export default router;
