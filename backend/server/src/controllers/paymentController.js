import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

export const createOrder = async (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body;
    const keyId = process.env.RAZORPAY_KEY_ID || '';

    // Simulation Mode: If keys are placeholders or missing, return a mock order
    if (!keyId || keyId.includes('placeholder') || keyId === '') {
        console.log('--- PAYMENT SIMULATION MODE ACTIVE ---');
        return res.json({
            id: `order_mock_${Math.random().toString(36).substring(7)}`,
            amount: amount * 100,
            currency: currency,
            receipt: receipt,
            status: 'created',
            isMock: true,
            key: 'rzp_test_simulation_key' // Safe dummy key for frontend detection
        });
    }

    try {
        const options = {
            amount: amount * 100, // Razorpay works in paise
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);
        // Include the real key so frontend doesn't use a hardcoded placeholder
        res.json({ ...order, key: keyId });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Simulation Mode: Auto-verify mock orders
    if (razorpay_order_id && razorpay_order_id.startsWith('order_mock_')) {
        return res.json({ message: 'Mock payment verified successfully', success: true });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
        .update(sign.toString())
        .digest('hex');

    if (razorpay_signature === expectedSign) {
        res.json({ message: 'Payment verified successfully', success: true });
    } else {
        res.status(400).json({ message: 'Invalid payment signature', success: false });
    }
};
