import express from 'express';
import {
    getDashboardStats,
    getSalesReport,
    getProductReport,
    getCustomerReport,
    getAnalyticsData
} from '../controllers/statsController.js';

const router = express.Router();

router.get('/', getDashboardStats);
router.get('/reports/sales', getSalesReport);
router.get('/reports/products', getProductReport);
router.get('/reports/customers', getCustomerReport);
router.get('/analytics', getAnalyticsData);

export default router;
