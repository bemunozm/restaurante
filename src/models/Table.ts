import mongoose, { Schema, Document, Types } from "mongoose";

// TypeScript type
export type TableType = Document & {
    tableNumber: number;
    status: 'disponible' | 'ocupada' | 'reservada';
};

// Mongoose model
const TableSchema: Schema = new Schema({
    tableNumber: { type: Number, required: true, unique: true },
    status: { type: String, enum: ['disponible', 'ocupada', 'reservada'], default: 'disponible' },
}, { timestamps: true });

const Table = mongoose.model<TableType>("Table", TableSchema);
export default Table;
