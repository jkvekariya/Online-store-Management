import Contact from '../models/Contact.js';

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new contact entry
        const newContact = new Contact({
            name,
            email,
            phone,
            subject,
            message
        });

        await newContact.save();

        res.status(201).json({
            message: 'Your query sent successfully',
            contact: newContact
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to submit contact form',
            error: error.message
        });
    }
};

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ contacts });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch contacts',
            error: error.message
        });
    }
};
