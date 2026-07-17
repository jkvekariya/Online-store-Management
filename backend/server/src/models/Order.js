import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SignupUser',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            title: String,
            price: Number,
            quantity: Number,
            size: String,
            image: String
        }
    ],
    shippingAddress: {
        type: Object,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    },
    orderId: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Processing',
        enum: ['Processing', 'Shipped', 'Dispatched', 'Delivered', 'Cancelled']
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
