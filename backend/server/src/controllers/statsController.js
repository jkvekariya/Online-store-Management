import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Contact from '../models/Contact.js';
import SignupUser from '../models/SignupUser.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);

        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();
        const totalQueries = await Contact.countDocuments();
        const totalCustomers = await SignupUser.countDocuments({ role: { $ne: 'admin' } });

        const recentTransactions = await Order.find({})
            .populate('user', 'firstname lastname')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalOrders,
            totalRevenue,
            totalProducts,
            totalCategories,
            totalQueries,
            totalCustomers,
            recentTransactions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSalesReport = async (req, res) => {
    try {
        const { from, to } = req.query;
        let query = {};
        if (from && to) {
            const endDate = new Date(to);
            endDate.setUTCHours(23, 59, 59, 999);
            query.createdAt = {
                $gte: new Date(from),
                $lte: endDate
            };
        }

        const report = await Order.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$totalPrice' },
                    totalProductsSold: {
                        $sum: {
                            $reduce: {
                                input: "$items",
                                initialValue: 0,
                                in: { $add: ["$$value", "$$this.quantity"] }
                            }
                        }
                    }
                }
            }
        ]);

        res.json(report[0] || { totalOrders: 0, totalRevenue: 0, totalProductsSold: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductReport = async (req, res) => {
    try {
        const report = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    name: { $first: '$items.title' },
                    totalQuantitySold: { $sum: '$items.quantity' },
                    totalRevenueGenerated: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $project: {
                    name: 1,
                    totalQuantitySold: 1,
                    totalRevenueGenerated: 1,
                    remainingStock: '$productDetails.stockQuantity'
                }
            },
            { $sort: { totalRevenueGenerated: -1 } }
        ]);

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCustomerReport = async (req, res) => {
    try {
        const report = await Order.aggregate([
            {
                $group: {
                    _id: '$user',
                    totalOrders: { $sum: 1 },
                    totalAmountSpent: { $sum: '$totalPrice' }
                }
            },
            {
                $lookup: {
                    from: 'signupusers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    name: { $concat: ['$userDetails.firstname', ' ', '$userDetails.lastname'] },
                    email: '$userDetails.email',
                    totalOrders: 1,
                    totalAmountSpent: 1
                }
            },
            { $sort: { totalAmountSpent: -1 } },
            { $limit: 10 }
        ]);

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAnalyticsData = async (req, res) => {
    try {
        // 1. Monthly Sales (Bar Chart)
        const monthlySales = await Order.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    totalSales: { $sum: '$totalPrice' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        // 2. Category Sales (Pie Chart)
        const categorySales = await Order.aggregate([
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.category',
                    totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            }
        ]);

        // 3. Revenue Growth (Line Chart) - Daily for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const revenueGrowth = await Order.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    dailyRevenue: { $sum: '$totalPrice' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        res.json({
            monthlySales,
            categorySales,
            revenueGrowth
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

