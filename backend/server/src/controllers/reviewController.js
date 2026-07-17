import Review from '../models/Review.js';
import Product from '../models/Product.js';

// Create Review
export const createReview = async (req, res) => {
    try {
        // Accept product or productId to be flexible
        const { user, productId, product, rating, comment, title } = req.body;
        const targetProductId = productId || product;

        if (!targetProductId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const newReview = new Review({
            user,
            product: targetProductId,
            rating,
            comment,
            title // Optional if schema doesn't have it, but strict mode might strip it. Schema doesn't have title.
        });

        const savedReview = await newReview.save();

        // Update Product Stats
        const reviews = await Review.find({ product: targetProductId });
        const numReviews = reviews.length;
        const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / numReviews;

        await Product.findByIdAndUpdate(targetProductId, {
            numReviews: numReviews,
            rating: avgRating
        });

        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get All Reviews (Admin)
export const getAllReviews = async (req, res) => {
    try {
        // Populate product details to show name in admin panel
        const reviews = await Review.find().populate('product', 'title').sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Reviews for specific Product (Optional helper)
export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
