import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    googleId: {
        type: String,
        default: null
    },
    profilePic: {
        type: String,
        default: null
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    }
});

const User = mongoose.models.User  || mongoose.model('User', UserSchema);

export default User;