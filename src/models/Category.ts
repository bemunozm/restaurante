import mongoose, { Schema, Document } from "mongoose";

// Typescript type
export type CategoryType = Document & {
    name: string;
    image?: string;
};

// Mongoose model
const CategorySchema: Schema = new Schema({
    name: { type: String, required: true, trim: true, unique: true },
    image: { type: String, required: false, trim: true },
});

const Category = mongoose.model<CategoryType>("Category", CategorySchema);
export default Category;
