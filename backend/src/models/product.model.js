const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    stocks:{
        type: Number,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    reviews: [{ name: String, rating: Number, comment: String }],
    numberOfReviews: {
        type: Number,
        default: 0
    },
    ratings:{
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
},{timestamps: true});

const productModel  = mongoose.model("Product", productSchema);
module.exports = productModel;