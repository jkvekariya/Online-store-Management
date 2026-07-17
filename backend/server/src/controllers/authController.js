import SignupUser from '../models/SignupUser.js';
import LoginUser from '../models/LoginUser.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const { firstname, lastname, mobile, email, password } = req.body;

        // Check if user already exists
        const existingUser = await SignupUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new SignupUser({
            firstname,
            lastname,
            mobile,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'Signup successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists in Signup collection
        const user = await SignupUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Per user request: store login data in separate collection
        const loginRecord = new LoginUser({ email, password: '***' }); // Not storing real password in login log
        await loginRecord.save();

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successfully',
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                mobile: user.mobile,
                dob: user.dob,
                gender: user.gender
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstname, lastname, mobile, dob, gender } = req.body;

        const updatedUser = await SignupUser.findByIdAndUpdate(
            userId,
            { firstname, lastname, mobile, dob, gender },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
