import mongoose from 'mongoose';

const pageContentSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
        unique: true,
        enum: ['about', 'contact', 'privacy', 'terms', 'faq']
    },
    title: {
        type: String,
        required: true
    },
    sections: {
        type: mongoose.Schema.Types.Mixed, // High flexibility for structured content
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('PageContent', pageContentSchema);
