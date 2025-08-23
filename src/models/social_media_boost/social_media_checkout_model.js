import mongoose from "mongoose";

const Social_Media_Checkout_Schema = new mongoose.Schema({
    date_and_time: {
        type: Date,
        default: Date.now()
    },
    date_and_time_formated: {
        type: String,
        trim: true
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    item_name: {
        type: String,
        trim: true
    },
    categories: {
        type: String,
        trim: true
    },
    review_from: {
        type: String,
        trim: true
    },
    order_amount: {
        type: Number,
        trim: true
    },
    review_price: {
        type: Number,
        trim: true
    },
    delivery_date_and_time: {
        type: Date,
        default: null
    },
    delivery_date_and_time_formated: {
        type: String,
        default: null
    },
    payment_method: {
        type: String,
        enum: ['credit_card', 'mobile_bank', 'cash_on_delivery', 'bank'],
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled', 'returned'],
        default: 'pending'
    },
    attachment: {
        type: Object,
        default: null
    },
    notes: {
        type: String,
        trim: true,
        default: null
    },
    billing_address: {
        first_name: {
            type: String,
            required: true,
            trim: true
        },
        last_name: {
            type: String,
            required: true,
            trim: true
        },
        full_name: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            trim: true,
            default: null
        },
        address: {
            type: String,
            trim: true,
            default: null
        },
        message: {
            type: String,
            trim: true,
            default: null
        }
    }
}, { timestamps: true });


const Social_Media_Checkout_Model = mongoose.model("Social_Media_Checkout", Social_Media_Checkout_Schema);
export default Social_Media_Checkout_Model;