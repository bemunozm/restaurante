import mongoose, { Schema, Document } from "mongoose";

// Typescript type
export type CategoryType = Document & {
    name: string;
};

// Mongoose model
const CategorySchema: Schema = new Schema({
    name: { type: String, required: true, trim: true, unique: true },
});

const Category = mongoose.model<CategoryType>("Category", CategorySchema);
export default Category;
