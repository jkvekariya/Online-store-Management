import express from 'express';
import { addOrderItems, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', addOrderItems);
router.get('/', getAllOrders);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

export default router;
