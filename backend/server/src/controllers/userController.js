import SignupUser from '../models/SignupUser.js';
import Order from '../models/Order.js';
import Address from '../models/Address.js';

// @desc    Get all users
// @route   GET /api/users
export const getAllUsers = async (req, res) => {
    try {
        const users = await SignupUser.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user details (Orders, Addresses)
// @route   GET /api/users/:id
export const getUserDetails = async (req, res) => {
    try {
        const user = await SignupUser.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
        const addresses = await Address.find({ user: user._id });

        const totalSpent = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);

        res.json({
            user,
            orders,
            addresses,
            stats: {
                totalOrders: orders.length,
                totalSpent
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle user status (Block/Unblock)
// @route   PUT /api/users/:id/status
export const toggleUserStatus = async (req, res) => {
    try {
        const user = await SignupUser.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.status = user.status === 'Active' ? 'Blocked' : 'Active';
        await user.save();

        res.json({ message: `User status changed to ${user.status}`, status: user.status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res) => {
    try {
        const user = await SignupUser.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await SignupUser.findByIdAndDelete(req.params.id);
        // Optional: Delete user's orders and addresses as well? 
        // For now, just deleting the user.

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
