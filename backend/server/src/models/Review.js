import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    user: {
        type: String, // Storing user name or email for simplicity given auth setup
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: false
    },
    comment: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Review', reviewSchema);
