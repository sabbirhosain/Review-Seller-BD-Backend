import mongoose from "mongoose";
import ContactModel from "../models/contact_model.js";
import { formatDateOnly } from "../utils/helper_function.js";

export const create = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        const fields_validate = {
            string: ['name', 'email', 'subject', 'message'],
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

        const result = await new ContactModel({
            date_and_time: Date.now(),
            date_and_time_formated: formatDateOnly(Date.now()),
            name: name,
            email: email,
            phone: phone,
            subject: subject,
            message: message
        }).save();

        if (result) {
            return res.json({
                success: true,
                message: 'Message Send Success',
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
        const { status } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchQuery = new RegExp('.*' + search + '.*', 'i');

        // Add search filter
        const dataFilter = {
            $or: [
                { name: { $regex: searchQuery } },
                { email: { $regex: searchQuery } },
                { phone: { $regex: searchQuery } },
            ]
        };

        // Add status filter (if provided and not empty)
        const allowedStatuses = ['pending', 'completed', 'cancelled'];
        if (status && status !== 'undefined' && status !== 'null' && status !== '' && allowedStatuses.includes(status)) {
            dataFilter.status = status;
        }

        const result = await ContactModel.find(dataFilter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)

        const count = await ContactModel.find(dataFilter).countDocuments();

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
        if (!mongoose.Types.ObjectId.isValid(id)) { return res.json({ success: false, message: "Invalid ID Format" }) }

        const result = await ContactModel.findById(id);
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
        const { name, email, phone, subject, message, status } = req.body;
        const fields_validate = {
            string: ['name', 'email', 'subject', 'message'],
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
        // status validation
        if (status && !['pending', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'status must be either "pending" or "completed" and "cancelled"'
            });
        }

        const result = await ContactModel.findByIdAndUpdate(id, {
            name: name,
            email: email,
            phone: phone,
            subject: subject,
            message: message,
            status: status
        }, { new: true })

        if (result) {
            return res.json({
                success: true,
                message: 'Message Update Success',
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

        // Find the category by ID
        const find_categories = await ContactModel.findById(id);
        if (!find_categories) { return res.json({ success: false, message: "Item Not Found" }) }

        // Proceed to delete
        const result = await ContactModel.findByIdAndDelete(id);
        if (!result) {
            return res.json({ success: false, message: "Data Not Found" });
        } else {
            return res.json({
                success: true,
                message: 'Message Destroy Success',
            });
        }

    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}