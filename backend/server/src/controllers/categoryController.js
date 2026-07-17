import Category from '../models/Category.js';
import Product from '../models/Product.js';

// Get all categories with genuine product counts
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        const products = await Product.find({}, 'category');

        const categoriesWithCounts = categories.map(cat => {
            const count = products.filter(p => {
                // For main categories like 'Topwear', we need to check if product category is one of its children
                // This logic should match the one in Products.jsx if possible, 
                // but for simplicity, the admin should define the main category name.
                // If the dynamic categories are 'Topwear', 'Bottomwear' etc, 
                // we should handle the mapping.

                // For now, let's just do a direct match or use the mapping logic we defined earlier.
                const categoryMapping = {
                    'Topwear': ['Hoodies', 'T-Shirts', 'Jackets', 'Shirts', 'Topwear'],
                    'Bottomwear': ['Jeans', 'Trousers', 'Bottomwear'],
                    'Handbags': ['Handbags'],
                    'Accessories': ['Accessories'],
                    'Shoes': ['Shoes'],
                    'Dresses': ['Dresses']
                };

                const allowed = categoryMapping[cat.name] || [cat.name];
                return allowed.includes(p.category);
            }).length;

            return {
                ...cat._doc,
                count
            };
        });

        res.status(200).json(categoriesWithCounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new category
export const createCategory = async (req, res) => {
    const { name, image } = req.body;
    try {
        const newCategory = new Category({ name, image });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a category
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, image } = req.body;
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, { name, image }, { new: true });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a category
export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await Category.findByIdAndDelete(id);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
