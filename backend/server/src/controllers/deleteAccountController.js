import SignupUser from '../models/SignupUser.js';

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        const deletedUser = await SignupUser.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
