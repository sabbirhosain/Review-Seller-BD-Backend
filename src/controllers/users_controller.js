import mongoose from "mongoose";
import UsersModel from "../models/users_model.js";
import { formatDateOnly } from "../utils/helper_function.js";

export const create = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, country, gender, password, confirm_password } = req.body;
        const fields_validate = {
            string: ['first_name', 'last_name', 'email', 'country', 'gender', 'password', 'confirm_password'],
            number: ['phone']
        };

        // String validation
        for (const field of fields_validate.string) {
            const value = req.body[field];
            if (typeof value !== 'string' || value.trim() === '') {
                return res.json({ success: false, message: `${field} is required and must be a non-empty string.` });
            }
        }
        // Number validation
        for (const field of fields_validate.number) {
            const value = req.body[field];
            if (isNaN(value) || Number(value) <= 0) {
                return res.status(400).json({ success: false, message: `${field} is required and must be a positive number.` });
            }
        }

        // Password validation
        if (password.length < 6) { return res.json({ success: false, message: 'Password must be at least 6 characters long' }) }
        if (password !== confirm_password) { return res.json({ success: false, message: "Password and Confirm Password doesn't match" }) }

        // Email domain validation
        const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com', 'icloud.com', 'aol.com', 'mail.com', 'protonmail.com', 'zoho.com', 'gmx.com', 'rediffmail.com', 'naver.com', 'qq.com'];
        const emailDomain = email.split('@')[1]?.toLowerCase();
        if (!emailDomain || !allowedDomains.includes(emailDomain)) {
            return res.status(400).json({
                success: false,
                message: 'Only personal email allowed (gmail, yahoo, outlook, etc.)'
            });
        }

        // gender validation
        if (gender && !['male', 'female', 'other'].includes(gender)) {
            return res.status(400).json({
                success: false,
                message: 'gender must be either "male", "female", "other"'
            });
        }

        // exist check
        const exist_email = await UsersModel.exists({ $or: [{ email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } }] })
        if (exist_email) { return res.json({ success: false, message: "Email Already Exists. Try Another !" }) }

        const exist_phone = await UsersModel.exists({ $or: [{ phone: { $regex: new RegExp(`^${phone.toString().trim()}$`, 'i') } }] })
        if (exist_phone) { return res.json({ success: false, message: "Phone Already Exists. Try Another !" }) }

        const result = await new UsersModel({
            date_and_time: Date.now(),
            date_and_time_formated: formatDateOnly(Date.now()),
            first_name: first_name,
            last_name: last_name,
            full_name: first_name + ' ' + last_name,
            email: email,
            phone: phone,
            country: country,
            gender: gender,
            password: password
        }).save();

        if (result) {
            return res.json({
                success: true,
                message: 'Register Success',
                payload: result
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const show = async (req, res) => {
    try {
        const search = req.query.search || "";
        const { from_date, to_date, gender, status, role } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchQuery = new RegExp('.*' + search + '.*', 'i');

        // Add search filter
        const dataFilter = {
            $or: [
                { full_name: { $regex: searchQuery } },
                { email: { $regex: searchQuery } },
                { phone: { $regex: searchQuery } },
                { country: { $regex: searchQuery } },
            ]
        };

        // Add date and time filter
        if (from_date || to_date) {
            dataFilter.date_and_time = {};

            if (from_date) {
                const startDate = new Date(from_date);
                startDate.setHours(0, 0, 0, 0);
                dataFilter.date_and_time.$gte = startDate;
            }

            if (to_date) {
                const endDate = new Date(to_date);
                endDate.setHours(23, 59, 59, 999);
                dataFilter.date_and_time.$lte = endDate;
            }
        }

        // Add gender filter
        const allowed_gender = ['male', 'female', 'other'];
        if (gender && allowed_gender.includes(gender)) { dataFilter.gender = gender }

        // Add status filter
        const allowed_status = ['pending', 'active', 'hold'];
        if (status && allowed_status.includes(status)) { dataFilter.status = status }

        // Add role filter
        const allowed_role = ['user', 'admin', 'manager'];
        if (role && allowed_role.includes(role)) { dataFilter.role = role }

        const result = await UsersModel.find(dataFilter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)

        const count = await UsersModel.find(dataFilter).countDocuments();
        if (result.length === 0) {
            return res.json({ success: false, message: "No Data Found" });
        } else {
            return res.json({
                success: true,
                message: 'Item Show Success',
                pagination: {
                    per_page: Number(limit),
                    current_page: Number(page),
                    total_data: count,
                    total_page: Math.ceil(count / Number(limit)),
                    previous: Number(page) - 1 > 0 ? Number(page) - 1 : null,
                    next: Number(page) + 1 <= Math.ceil(count / Number(limit)) ? Number(page) + 1 : null
                },
                payload: result
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const single = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Invalid ID Format" })
        }

        const result = await UsersModel.findById(id);
        if (!result) {
            return res.json({ success: false, message: "No Data Found" });
        } else {
            return res.json({
                success: true,
                message: 'Item Show Success',
                payload: result
            });
        }

    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params
        const { first_name, last_name, email, phone, country, role, status } = req.body;
        const fields_validate = {
            string: ['first_name', 'last_name', 'email', 'country', 'password', 'confirm_password'],
            number: ['phone']
        };

        // String validation
        for (const field of fields_validate.string) {
            if (req.body[field] !== undefined) {
                const value = req.body[field];
                if (typeof value !== 'string' || value.trim() === '') {
                    return res.status(400).json({ success: false, message: `${field} is required and must be a non-empty string.` });
                }
            }
        }

        // Number validation
        for (const field of fields_validate.number) {
            if (req.body[field] !== undefined) {
                const value = req.body[field];
                if (isNaN(value) || Number(value) <= 0) {
                    return res.status(400).json({ success: false, message: `${field} is required and must be a positive number.` });
                }
            }
        }

        // Email domain validation
        const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com', 'icloud.com', 'aol.com', 'mail.com', 'protonmail.com', 'zoho.com', 'gmx.com', 'rediffmail.com', 'naver.com', 'qq.com'];
        const emailDomain = email.split('@')[1]?.toLowerCase();
        if (!emailDomain || !allowedDomains.includes(emailDomain)) {
            return res.status(400).json({
                success: false,
                message: 'Only personal email allowed (gmail, yahoo, outlook, etc.)'
            });
        }

        // gender validation
        if (gender && !['male', 'female', 'other'].includes(gender)) {
            return res.status(400).json({
                success: false,
                message: 'gender must be either "male", "female", "other"'
            });
        }

        // role validation
        if (role && !['user', 'admin', 'manager'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'status must be either "user", "admin", "manager"'
            });
        }

        // status validation
        if (status && !['pending', 'active', 'hold'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'status must be either "pending", "active", "hold"'
            });
        }

        // exist check
        const exist_email = await UsersModel.findOne({ $or: [{ email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } }] })
        if (exist_email && exist_email._id.toString() !== id) {
            return res.json({ success: false, message: "Email exists. Try another" })
        }

        const exist_phone = await UsersModel.findOne({ $or: [{ phone: { $regex: new RegExp(`^${phone.trim()}$`, 'i') } }] })
        if (exist_phone && exist_phone._id.toString() !== id) {
            return res.json({ success: false, message: "Phone exists. Try another" })
        }

        const result = await UsersModel.findByIdAndUpdate(id, {
            first_name: first_name,
            last_name: last_name,
            full_name: first_name + ' ' + last_name,
            email: email,
            phone: phone,
            country: country,
            role: role,
            gender: gender,
            status: status
        }, { new: true })

        if (result) {
            return res.json({
                success: true,
                message: 'Items Update Success',
                payload: result
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}

export const destroy = async (req, res) => {
    try {

        // Validate MongoDB ObjectId
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) { return res.json({ success: false, message: "Invalid ID Format" }) }

        // Find the users by ID
        const find_users = await UsersModel.findById(id);
        if (!find_users) { return res.json({ success: false, message: "Item Not Found" }) }

        // Proceed to delete
        const result = await UsersModel.findByIdAndDelete(id);
        if (!result) {
            return res.json({ success: false, message: "Data Not Found" });
        } else {
            return res.json({
                success: true,
                message: 'Items Destroy Success',
            });
        }

    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}