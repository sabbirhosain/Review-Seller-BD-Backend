import mongoose from "mongoose";

const CategoriesSchema = new mongoose.Schema({
    categories_name: {
        type: String,
        required: true,
        trim: true
    },
    items_count: {
        type: Number,
        trim: true,
        default: 0
    }
}, { timestamps: true })

const CategoriesModel = mongoose.model("Categories", CategoriesSchema);
export default CategoriesModel