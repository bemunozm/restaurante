import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import { CategoryType } from "./Category";
import { IngredientType } from "./Ingredient";

// TypeScript type para los ingredientes de un producto
type ProductIngredient = {
    ingredientId: PopulatedDoc<IngredientType & Document>;
    quantityRequired: number; // Cantidad requerida del ingrediente para este producto
};

// TypeScript type para el producto
export type ProductType = Document & {
    name: string;
    price: number;
    about: string;
    image?: string;
    categoryId: PopulatedDoc<CategoryType & Document>;
    ingredients: ProductIngredient[];
};

// Mongoose model
const ProductSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    image: { type: String, required: false, trim: true },
    about: { type: String, required: true, trim: true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true, index: true },
    ingredients: [
        {
            ingredientId: { type: Types.ObjectId, ref: "Ingredient", required: true },
            quantityRequired: { type: Number, required: true, min: 0 },
        }
    ],
}, { timestamps: true });

const Product = mongoose.model<ProductType>("Product", ProductSchema);
export default Product;
