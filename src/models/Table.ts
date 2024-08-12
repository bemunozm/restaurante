import mongoose, { Schema, Document, Types } from "mongoose";
import { OrderType } from "./Order";

// TypeScript type
export type TableType = Document & {
    tableNumber: number;
    password?: string;
    occupied: boolean;
    users: Types.ObjectId[];
    status: 'disponible' | 'pidiendo' | 'pagando';
    orders: Types.ObjectId[];
    totalPending: number;
};

// Mongoose model
const TableSchema: Schema = new Schema({
    tableNumber: { type: Number, required: true, unique: true },
    password: { type: String, required: function () { return this.occupied; } },
    occupied: { type: Boolean, default: false },
    users: [{ type: Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ['disponible', 'pidiendo', 'pagando'], default: 'disponible' },
    orders: [{ type: Types.ObjectId, ref: "Order" }],
    totalPending: { type: Number, default: 0 },
}, { timestamps: true });

const Table = mongoose.model<TableType>("Table", TableSchema);
export default Table;
