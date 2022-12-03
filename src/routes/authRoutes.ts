import express from 'express';
const router = express.Router();

import { register, login, logout } from '../controllers/authController';

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', logout);

export default router;
