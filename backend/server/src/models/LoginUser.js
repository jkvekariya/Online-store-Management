import mongoose from 'mongoose';

const loginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    loginAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('LoginUser', loginSchema);
