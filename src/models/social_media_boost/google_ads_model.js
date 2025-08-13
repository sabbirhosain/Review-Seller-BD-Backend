import mongoose from "mongoose";

const Google_Ads_Schema = new mongoose.Schema({
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
    price: {
        type: Number,
        trim: true,
        default: 0
    },
    quentity: {
        type: Number,
        trim: true,
        default: 0
    },
    duration: {
        type: Number,
        trim: true,
        default: 0
    },
    duration_type: {
        type: String,
        trim: true,
        enum: ['Day', 'Month', 'Year'],
        default: 'Day'
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

const Google_Ads_Model = mongoose.model("Google_Ads_Campaign", Google_Ads_Schema);
export default Google_Ads_Model