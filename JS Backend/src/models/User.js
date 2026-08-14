import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    leetcodeId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    refreshToken: {
        type: String,
        default: null,
        select: false
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;