import express from 'express';
import { getAllUsers, getUserDetails, toggleUserStatus, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserDetails);
router.put('/:id/status', toggleUserStatus);
router.delete('/:id', deleteUser);

export default router;
