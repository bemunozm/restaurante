import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import { ProductType } from "./Product";
import { TableType } from "./Table";

// TypeScript type
export type OrderType = Document & {
    tableId: PopulatedDoc<TableType & Document>;
    userId: Types.ObjectId;
    items: {
        productId: PopulatedDoc<ProductType & Document>;
        quantity: number;
    }[];
    status: 'pendiente' | 'aceptado' | 'preparando' | 'entregando' | 'cancelado' | 'pagado';
    cancelled: boolean;
    paid: boolean;
};

// Mongoose model
const OrderSchema: Schema = new Schema({
    tableId: { type: Types.ObjectId, ref: "Table", required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    status: { type: String, enum: ['pendiente', 'aceptado', 'preparando', 'entregando', 'cancelado', 'pagado'], default: 'pendiente' },
    cancelled: { type: Boolean, default: false },
    paid: { type: Boolean, default: false },
}, { timestamps: true });

const Order = mongoose.model<OrderType>("Order", OrderSchema);
export default Order;
