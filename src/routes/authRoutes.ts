import express from 'express';
const router = express.Router();

import { register, login, logout } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { registerUserSchema } from '../schemas/user.schema';

router.post('/register', validate(registerUserSchema), register);
router.post('/login', login);
router.delete('/logout', logout);

export default router;
