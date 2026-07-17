import Address from '../models/Address.js';

// Add new address
export const addAddress = async (req, res) => {
    try {
        const { user } = req.body; // In a real app, this would come from auth middleware
        const newAddress = new Address({ ...req.body });
        await newAddress.save();
        res.status(201).json({ message: "Address added successfully", address: newAddress });
    } catch (error) {
        res.status(500).json({ message: "Failed to add address", error: error.message });
    }
};

// Get all addresses for a user
export const getByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const addresses = await Address.find({ user: userId });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch addresses", error: error.message });
    }
};

// Update address
export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAddress = await Address.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
    } catch (error) {
        res.status(500).json({ message: "Failed to update address", error: error.message });
    }
};

// Delete address
export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        await Address.findByIdAndDelete(id);
        res.status(200).json({ message: "Address removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete address", error: error.message });
    }
};
