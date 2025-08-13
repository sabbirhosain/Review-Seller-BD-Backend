import mongoose from "mongoose";

const Google_Reviews_Schema = new mongoose.Schema({
    item_name: {
        type: String,
        required: true,
        trim: true
    },
    categories_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true
    },
    categories_name: {
        type: String,
        trim: true,
        default: null
    },
    features: {
        type: [String],
        trim: true,
        default: [],
    },
    price_usd: {
        type: Number,
        trim: true,
        default: 0
    },
    price_bdt: {
        type: Number,
        trim: true,
        default: 0
    },
    review_from: {
        type: String,
        trim: true,
        default: null
    },
    notes: {
        type: String,
        trim: true,
        default: null
    },
    status: {
        type: String,
        trim: true,
        enum: ['active', 'deactive'],
        default: 'active'
    },
    attachment: {
        type: Object,
        default: null
    }
}, { timestamps: true })

const Google_Reviews_Model = mongoose.model("Google_Reviews", Google_Reviews_Schema);
export default Google_Reviews_Model