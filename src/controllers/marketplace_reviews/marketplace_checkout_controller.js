import mongoose from "mongoose";
import Fiverr_Reviews_Model from "../../models/marketplace_reviews/fiverr_review_model.js";
import Google_Reviews_Model from "../../models/marketplace_reviews/google_review_model.js";
import Kwork_Reviews_Model from "../../models/marketplace_reviews/kwork_review_model.js";
import Marketplace_Checkout_Model from "../../models/marketplace_reviews/marketplace_checkout_model.js";
import People_Per_Reviews_Model from "../../models/marketplace_reviews/people_per_review_model.js";
import Upwork_Reviews_Model from "../../models/marketplace_reviews/upwork_review_model.js";
import { formatDateOnly } from "../../utils/helper_function.js";

export const create = async (req, res) => {
    try {
        const { item_id, billing_address } = req.body;

        // ObjectId validation
        const fields_validate = { objectId: ['item_id'] };
        for (const field of fields_validate.objectId) {
            const value = req.body[field];
            if (!value || !mongoose.Types.ObjectId.isValid(value)) {
                return res.status(400).json({ success: false, message: `${field} is required and must be a valid ObjectId.` });
            }
        }

        // check exist data in 5 model
        const find_items = await Fiverr_Reviews_Model.findById(item_id) || await Upwork_Reviews_Model.findById(item_id) || await Kwork_Reviews_Model.findById(item_id) || await Google_Reviews_Model.findById(item_id) || await People_Per_Reviews_Model.findById(item_id);
        if (!find_items) { return res.json({ success: false, message: "Item Not Found" }) }

        // Check is active
        if (find_items.status !== "active") {
            return res.json({ success: false, message: "Item is not available for purchase" });
        }

        // Validate billing address structure
        const billingAddress = ['first_name', 'last_name', 'email', 'phone', 'country', 'address'];
        for (let field of billingAddress) {
            if (!billing_address?.[field]) {
                return res.json({ [field]: 'is required (string)' });
            }
        }

        // Save to DB
        const result = await new Marketplace_Checkout_Model({
            date_and_time: new Date(),
            date_and_time_formated: formatDateOnly(new Date()),
            item_id: item_id,
            item_name: find_items.item_name,
            categories: find_items.categories_name,
            review_from: find_items.review_from,
            order_amount: find_items.order_amount,
            review_price: find_items.review_price,
            billing_address: {
                ...billing_address,
                full_name: billing_address.first_name + " " + billing_address.last_name
            }
        }).save();

        return res.json({
            success: true,
            message: 'Order Success',
            payload: result
        });

    } catch (error) {
        return res.json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
};

export const show = async (req, res) => {
    try {
        const search = req.query.search || "";
        const { from_date, to_date, payment, status } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchQuery = new RegExp('.*' + search + '.*', 'i');

        // Create base filter
        const dataFilter = {
            $or: [
                { 'item_name': { $regex: searchQuery } },
                { 'billing_address.full_name': { $regex: searchQuery } },
                { 'billing_address.email': { $regex: searchQuery } },
                { 'billing_address.phone': { $regex: searchQuery } }
            ]
        };

        // Add date filter
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

        // Payment method validation and filter
        const paymentMethod = ['credit_card', 'mobile_bank', 'cash_on_delivery', 'bank']
        if (payment && paymentMethod.includes(payment)) {
            dataFilter.payment_method = payment;
        }

        // Status validation and filter
        const validStatus = ['pending', 'completed', 'cancelled', 'returned'];
        if (status && validStatus.includes(status)) {
            dataFilter.status = status;
        }

        const result = await Marketplace_Checkout_Model.find(dataFilter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)

        const count = await Marketplace_Checkout_Model.find(dataFilter).countDocuments();

        // Check not found
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
                payload: result,
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
}

export const single = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the mongoose id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Invalid ID format" });
        }

        // Check not found
        const result = await Marketplace_Checkout_Model.findById(id);
        if (!result) {
            return res.json({ message: "Data not found" });
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
            error: error.message || 'Internal Server Error'
        });
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params
        const { delivery_date_and_time, payment_method, notes, status } = req.body;

        // check exist data
        if (!mongoose.Types.ObjectId.isValid(id)) { return res.json({ success: false, message: "Invalid ID Format" }) }
        const find_items = await Marketplace_Checkout_Model.findById(id);
        if (!find_items) { return res.json({ success: false, message: "No Data Found" }) }

        // Validate payment method
        const selectPaymentMethods = ['credit_card', 'mobile_bank', 'cash_on_delivery', 'bank'];
        if (!selectPaymentMethods.includes(payment_method)) {
            return res.json({ payment_method: 'Field is required. Use [ credit_card, mobile_bank, cash_on_delivery and bank ]' });
        }

        // Validate payment method
        const selectStatus = ['pending', 'completed', 'cancelled', 'returned'];
        if (!selectStatus.includes(status)) {
            return res.json({ status: 'Field is required. Use [ pending, completed, cancelled, returned ]' });
        }

        // update
        const result = await Marketplace_Checkout_Model.findByIdAndUpdate(id, {
            delivery_date_and_time: delivery_date_and_time,
            delivery_date_and_time_formated: formatDateOnly(delivery_date_and_time),
            payment_method: payment_method,
            notes: notes,
            status: status,
        }, { new: true })

        if (result) {
            return res.json({
                success: true,
                message: 'Item Update Success',
                payload: result
            });
        }

    } catch (error) {
        return res.json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
}

export const destroy = async (req, res) => {
    try {
        // Validate the mongoose id
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) { return res.json({ success: false, message: "Invalid ID format" }) }

        // check exist data
        const find_items = await Marketplace_Checkout_Model.findById(id);
        if (!find_items) { return res.json({ message: "Item not found" }) }

        const result = await Marketplace_Checkout_Model.findByIdAndDelete(id);

        // Check not found
        if (!result) {
            return res.json({ success: false, message: "Data not found" });
        } else {
            return res.json({
                success: true,
                message: 'Item Destroy Success',
            });
        }

    } catch (error) {
        return res.json({
            success: false,
            error: error.message || 'Internal Server Error'
        });
    }
}