const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dxjv7gq3f/image/upload/v1690300910/ShopSphere/avatar/default-avatar_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1_1.png"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
    type: String,
    default: null
} 

}, {timestamps: true});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;