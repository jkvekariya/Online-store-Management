import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    comparePrice: {
        type: Number,
        default: 0,
    },
    stockQuantity: {
        type: Number,
        required: true,
        default: 0
    },
    inStock: {
        type: Boolean,
        default: true
    },
    image: {
        type: String, // URL or path
        required: true
    },
    category: {
        type: String,
        required: true
    },
    vendor: {
        type: String,
        default: 'Local'
    },
    tags: [String], // Array of tags
    sizes: [String], // Array of sizes e.g., ['S', 'M', 'L']
    colors: [String], // Array of colors e.g., ['#ff0000', '#000000']
    isSale: {
        type: Boolean,
        default: false
    },
    images: [String], // Gallery images
    productType: {
        type: String,
        default: 'General'
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    soldCount: {
        type: Number,
        default: 0
    },
    createdAt: {


        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Product', productSchema);
