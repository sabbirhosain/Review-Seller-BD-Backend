import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    date_and_time: {
        type: Date,
        default: Date.now()
    },
    date_and_time_formated: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^\+?[0-9]{7,15}$/, 'Please enter a valid phone number']
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
}, { timestamps: true })

const ContactModel = mongoose.model("Contact", ContactSchema);
export default ContactModel