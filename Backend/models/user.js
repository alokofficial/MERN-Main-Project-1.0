import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    image: { type: String },
    places: { type: String},
    resetToken: { type: String },
    resetTokenExpiration: { type: Date }
}, { timestamps: true });

export default mongoose.model('User', userSchema);