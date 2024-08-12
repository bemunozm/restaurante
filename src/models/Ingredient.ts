import mongoose, { Schema, Document } from "mongoose";

// TypeScript type
export type IngredientType = Document & {
    name: string;
    stockQuantity: number;  // Cantidad disponible en inventario (puede ser fraccionaria)
    unit: string;  // Unidad de medida (e.g., "gramos", "litros", "trozos")
};

// Mongoose model
const IngredientSchema: Schema = new Schema({
    name: { type: String, required: true, trim: true, unique: true },
    stockQuantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },  // Ejemplo: "gramos", "litros", "trozos"
}, { timestamps: true });

const Ingredient = mongoose.model<IngredientType>("Ingredient", IngredientSchema);
export default Ingredient;
