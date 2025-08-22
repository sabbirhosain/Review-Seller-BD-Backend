import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UsersSchema = new mongoose.Schema({
    date_and_time: {
        type: Date,
        default: Date.now()
    },
    date_and_time_formated: {
        type: String,
        trim: true
    },
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
    country: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        set: (value) => bcrypt.hashSync(value, bcrypt.genSaltSync(10))
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'manager'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'hold'],
        default: 'pending'
    }
}, { timestamps: true })

const UsersModel = mongoose.model("Users", UsersSchema);
export default UsersModel