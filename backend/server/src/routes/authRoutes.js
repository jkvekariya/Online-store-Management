import express from 'express';
import { signup, login, updateProfile } from '../controllers/authController.js';
import { deleteAccount } from '../controllers/deleteAccountController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/update-profile', authMiddleware, updateProfile);
router.delete('/delete-account', authMiddleware, deleteAccount);

export default router;
