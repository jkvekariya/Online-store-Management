import express from 'express';
import { createReview, getAllReviews, getProductReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', createReview);
router.get('/', getAllReviews);
router.get('/product/:productId', getProductReviews);

export default router;
