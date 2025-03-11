import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    image: { type: String, required: true },
    places: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Place' }
    ],
    resetToken: { type: String },
    resetTokenExpiration: { type: Date }
}, { timestamps: true });

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);