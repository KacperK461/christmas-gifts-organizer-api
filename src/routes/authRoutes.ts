import express from 'express';
const router = express.Router();

import { register, login, logout } from '../controllers/authController';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { loginUserSchema, registerUserSchema } from '../schemas/user.schema';

router.post('/register', validate(registerUserSchema), register);
router.post('/login', validate(loginUserSchema), login);
router.delete('/logout', authenticate, logout);

export default router;
