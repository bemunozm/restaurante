import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import { ProductType } from "./Product";
import { TableType } from "./Table";

// Tipo de datos para un ítem en la orden
export type OrderItemType = {
    productId: PopulatedDoc<ProductType & Document>;
    quantity: number;
};

// Tipo de datos para una Orden
export type OrderType = Document & {
    tableId: PopulatedDoc<TableType & Document>; // Referencia a la sesión a la que pertenece la orden
    guestName: string; // Nombre del invitado que realizó la orden
    //guestEmail?: string; // Email opcional del invitado con el que se aplicaran descuentos en futuro en un modelo de fidelización
    items: OrderItemType[]; // Lista de productos en la orden
    status: 'Pendiente'| 'En Preparacion' | 'Listo' | 'Cancelado' | 'Pagado';
};

// Esquema para una Orden
export const OrderSchema: Schema = new Schema({
    tableId: { type: Types.ObjectId, ref: "Table", required: true }, // Relación con la sesión
    guestName: { type: String, required: true }, // Nombre del invitado
    // guestEmail: { type: String }, // Email opcional del invitado
    items: [
        {
            productId: { type: Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    status: { type: String, enum: ['Pendiente', 'En Preparacion', 'Listo', 'Cancelado', 'Pagado'], default: 'Pendiente' },
}, { timestamps: true });

const Order = mongoose.model<OrderType>("Order", OrderSchema);
export default Order;
