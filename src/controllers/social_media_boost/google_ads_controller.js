import mongoose from "mongoose";
import CategoriesModel from "../../models/categories_model.js";
import Google_Ads_Model from "../../models/social_media_boost/google_ads_model.js";

export const create = async (req, res) => {
    try {
        const { item_name, categories_id, features, price, quentity, duration, duration_type, review_from, status, notes } = req.body;
        const fields_validate = {
            string: ['item_name', 'review_from'],
            objectId: ['categories_id'],
            number: ['price', 'duration'],
            array: ['features']
        };

        // String validation
        for (const field of fields_validate.string) {
            const value = req.body[field];
            if (typeof value !== 'string' || value.trim() === '') {
                return res.status(400).json({ success: false, message: `${field} is required and must be a non-empty string.` });
            }
        }
        // ObjectId validation
        for (const field of fields_validate.objectId) {
            const value = req.body[field];
            if (!value || !mongoose.Types.ObjectId.isValid(value)) {
                return res.status(400).json({ success: false, message: `${field} is required and must be a valid ObjectId.` });
            }
        }
        // Number validation
        for (const field of fields_validate.number) {
            const value = req.body[field];
            if (isNaN(value) || Number(value) <= 0) {
                return res.status(400).json({ success: false, message: `${field} is required and must be a positive number.` });
            }
        }
        // Array validation
        for (const field of fields_validate.array) {
            const value = req.body[field];
            if (!Array.isArray(value) || value.length === 0 || value.some(element => typeof element !== 'string' || element.trim() === '')) {
                return res.status(400).json({ success: false, message: `${field} must be a non-empty array of non-empty strings.` });
            }
        }

        // duration type validation
        if (duration_type && !['Day', 'Month', 'Year'].includes(duration_type)) {
            return res.status(400).json({
                success: false,
                message: 'duration_type must be either "Day" or "Month", and "Year"'
            });
        }

        // status validation
        if (status && !['active', 'deactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'status must be either "active" or "deactive"'
            });
        }

        const find_categories = await CategoriesModel.findById(categories_id);
        if (!find_categories) { return res.json({ success: false, message: "Category Not Found" }) }

        const exist_items = await Google_Ads_Model.exists({ $or: [{ item_name: { $regex: new RegExp(`^${item_name.trim()}$`, 'i') } }] })
        if (exist_items) { return res.json({ success: false, message: "already exists. try another" }) }

        const result = await new Google_Ads_Model({
            item_name: item_name,
            categories_id: categories_id,
            categories_name: find_categories.categories_name,
            features: features,
            price: price,
            quentity: quentity,
            duration: duration,
            duration_type: duration_type,
            review_from: review_from,
            status: status,
            notes: notes
        }).save();

        if (result) {
            // Increment items_count in the category
            await CategoriesModel.findByIdAndUpdate(categories_id, { $inc: { items_count: 1 } });

            return res.json({
                success: true,
                message: 'Item Create Success',
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
        const { categories, status } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchQuery = new RegExp('.*' + search + '.*', 'i');

        // Add search filter
        const dataFilter = {
            $or: [{ item_name: { $regex: searchQuery } }],
        };

        // Category filter (if provided and valid)
        if (categories && categories !== 'undefined' && categories !== 'null' && categories !== '') {
            if (mongoose.Types.ObjectId.isValid(categories)) {
                dataFilter.categories_id = categories;
            } else {
                return res.json({ success: false, message: 'Invalid ID Format' });
            }
        }

        // Add status filter (if provided and not empty)
        const allowedStatuses = ['active', 'deactive'];
        if (status && status !== 'undefined' && status !== 'null' && status !== '' && allowedStatuses.includes(status)) {
            dataFilter.status = status;
        }

        const result = await Google_Ads_Model.find(dataFilter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)

        const count = await Google_Ads_Model.find(dataFilter).countDocuments();

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

        // show the items value
        const result = await Marketplace_Reviews_Model.findById(id);
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
        const { item_name, categories_id, features, price, quentity, duration, duration_type, review_from, status, notes } = req.body;

        // Find the items by ID
        if (!mongoose.Types.ObjectId.isValid(id)) { return res.json({ success: false, message: "Invalid ID Format" }) }
        const find_items = await Google_Ads_Model.findById(id);
        if (!find_items) { return res.json({ success: false, message: "Item Not Found" }) }

        const fields_validate = {
            string: ['item_name', 'review_from'],
            objectId: ['categories_id'],
            number: ['price', 'duration'],
            array: ['features']
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
        // ObjectId validation
        for (const field of fields_validate.objectId) {
            if (req.body[field] !== undefined) {
                const value = req.body[field];
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return res.status(400).json({ success: false, message: `${field} is required and must be a valid ObjectId.` });
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
        // Array validation
        for (const field of fields_validate.array) {
            if (req.body[field] !== undefined) {
                const value = req.body[field];
                if (!Array.isArray(value) || value.length === 0 || value.some(element => typeof element !== 'string' || element.trim() === '')) {
                    return res.status(400).json({ success: false, message: `${field} must be a non-empty array of non-empty strings.` });
                }
            }
        }

        // Duration type validation
        if (duration_type && !['Day', 'Month', 'Year'].includes(duration_type)) {
            return res.status(400).json({
                success: false,
                message: 'duration_type must be either "Day" or "Month", and "Year"'
            });
        }

        // Status validation
        if (status && !['active', 'deactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'status must be either "active" or "deactive"'
            });
        }

        // Find the category by ID
        const find_categories = await CategoriesModel.findById(categories_id);
        if (!find_categories) { return res.json({ success: false, message: "Category Not Found" }) }

        // Find the items by Name
        const exist_items = await Google_Ads_Model.exists({ $or: [{ item_name: { $regex: new RegExp(`^${item_name.trim()}$`, 'i') }, _id: { $ne: id } }] })
        if (exist_items) { return res.json({ success: false, message: "already exists. try another" }) }

        // Proceed to create
        const result = await Google_Ads_Model.findByIdAndUpdate(id, {
            item_name: item_name,
            categories_id: categories_id,
            categories_name: find_categories.categories_name,
            features: features,
            price: price,
            quentity: quentity,
            duration: duration,
            duration_type: duration_type,
            review_from: review_from,
            status: status,
            notes: notes
        }, { new: true })

        if (result) {
            // change category items_count
            if (categories_id && find_categories._id !== categories_id) {
                await CategoriesModel.findByIdAndUpdate(find_categories._id, { $inc: { items_count: -1 } }); // Decrement old items_count
                await CategoriesModel.findByIdAndUpdate(categories_id, { $inc: { items_count: 1 } }); // Increment new items_count
            }

            return res.json({
                success: true,
                message: 'Item Update Success',
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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: "Invalid ID Format" })
        }

        // Find the items by ID
        const find_items = await Google_Ads_Model.findById(id);
        if (!find_items) { return res.json({ success: false, message: "Item Not Found" }) }

        // Proceed to delete
        const result = await Google_Ads_Model.findByIdAndDelete(id);
        if (!result) {
            return res.json({ success: false, message: "Data Not Found" });

        } else {
            // Decrement the items_count
            if (find_items.categories_id) {
                await CategoriesModel.findByIdAndUpdate(find_items.categories_id, { $inc: { items_count: -1 } });
            }

            return res.json({
                success: true,
                message: 'Item Destroy Success',
            });
        }

    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}