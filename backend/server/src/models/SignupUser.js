import mongoose from 'mongoose';

const signupSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: String },
    gender: { type: String },
    role: { type: String, default: 'user' },
    status: { type: String, default: 'Active' }
}, { timestamps: true });

export default mongoose.model('SignupUser', signupSchema);
