import mongoose from "mongoose";
import CategoriesModel from "../models/categories_model.js";

export const create = async (req, res) => {
    try {
        const { categories_name } = req.body;
        const fields_validate = { string: ['categories_name'] };

        // String validation
        for (const field of fields_validate.string) {
            const value = req.body[field];
            if (typeof value !== 'string' || value.trim() === '') {
                return res.json({ success: false, message: `${field} is required and must be a non-empty string.` });
            }
        }

        // exist categories by name
        const exist_categories = await CategoriesModel.findOne({ $or: [{ categories_name: { $regex: new RegExp(`^${categories_name.trim()}$`, 'i') } }] });
        if (exist_categories) { return res.json({ success: false, message: "already exists. try another." }) };

        const result = await new CategoriesModel({
            categories_name: categories_name
        }).save();

        if (result) {
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
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchQuery = new RegExp('.*' + search + '.*', 'i');

        // search filter
        const dataFilter = { $or: [{ categories_name: { $regex: searchQuery } }] }
        const result = await CategoriesModel.find(dataFilter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)

        const count = await CategoriesModel.find(dataFilter).countDocuments();

        if (result.length === 0) {
            return res.json({ success: false, message: "No Data Found" });
        } else {
            return res.json({
                success: true,
                message: 'Item Show Success',
                pagination: {
                    per_page: limit,
                    current_page: page,
                    total_data: count,
                    total_page: Math.ceil(count / limit),
                    previous: page - 1 > 0 ? page - 1 : null,
                    next: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
                },
                payload: result,
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

        const result = await CategoriesModel.findById(id);
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
        const { categories_name } = req.body;
        const fields_validate = { string: ['categories_name'] };

        // String validation
        for (const field of fields_validate.string) {
            if (req.body[field] !== undefined) {
                const value = req.body[field];
                if (typeof value !== 'string' || value.trim() === '') {
                    return res.status(400).json({ success: false, message: `${field} is required and must be a non-empty string.` });
                }
            }
        }

        // exist categories by id
        if (!mongoose.Types.ObjectId.isValid(id)) { return res.json({ success: false, message: "Invalid ID Format" }) }
        const find_categories = await CategoriesModel.findById(id);
        if (!find_categories) { return res.json({ success: false, message: "Not Found By ID" }) }

        // exist categories by name
        const exist_categories = await CategoriesModel.findOne({ $or: [{ categories_name: { $regex: new RegExp(`^${categories_name.trim()}$`, 'i') } }] });
        if (exist_categories) { return res.json({ success: false, message: "already exists. try another." }) };


        const result = await CategoriesModel.findByIdAndUpdate(id, {
            categories_name: categories_name
        }, { new: true })

        if (result) {
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
        if (!mongoose.Types.ObjectId.isValid(id)) { return res.json({ success: false, message: "Invalid ID Format" }) }

        // Find the category by ID
        const find_categories = await CategoriesModel.findById(id);
        if (!find_categories) { return res.json({ success: false, message: "Item Not Found" }) }

        // Check if items_count > 1
        if (find_categories.items_count > 0) {
            return res.json({ success: false, message: "The category cannot be deleted because it contains items." });
        }

        // Proceed to delete
        const result = await CategoriesModel.findByIdAndDelete(id);
        if (!result) {
            return res.json({ success: false, message: "Data Not Found" });
        } else {
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