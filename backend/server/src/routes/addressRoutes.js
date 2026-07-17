import express from 'express';
import { addAddress, getByUserId, updateAddress, deleteAddress } from '../controllers/addressController.js';

const router = express.Router();

router.post('/', addAddress);
router.get('/:userId', getByUserId);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;
