import mongoose from "mongoose";

const Fetchers_Reviews_Schema = new mongoose.Schema({
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

const Fetchers_Reviews_Model = mongoose.model("Fetchers_Reviews", Fetchers_Reviews_Schema);
export default Fetchers_Reviews_Model