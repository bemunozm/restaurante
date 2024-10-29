import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import { ProductType } from "./Product";
import { TableType } from "./Table";
import { SessionType } from "./Session";
import { UserType } from "./User";

// Tipo de datos para un ítem en la orden
export type OrderItemType = {
    _id: Types.ObjectId;
    productId: PopulatedDoc<ProductType & Document>;
    quantity: number;
    status: 'Pendiente'| 'En Preparacion' | 'Listo' | 'Cancelado' | 'Entregado';
};

// Tipo de datos para una Orden
export type OrderType = Document & {
    sessionId: PopulatedDoc<SessionType & Document>; // Referencia a la sesión a la que pertenece la orden
    tableId: PopulatedDoc<TableType & Document>; // Referencia a la sesión a la que pertenece la orden
    guestId?: Types.ObjectId; // Nombre del invitado que realizó la orden
    userId?: PopulatedDoc<UserType & Document>; // Email opcional del invitado con el que se aplicaran descuentos en futuro en un modelo de fidelización
    items: OrderItemType[]; // Lista de productos en la orden
    status: 'Sin Pagar' | 'Pagado' | 'Pendiente';
};

// Esquema para una Orden
export const OrderSchema: Schema = new Schema({
    sessionId: { type: Types.ObjectId, ref: "Session", required: true }, // Relación con la sesión
    tableId: { type: Types.ObjectId, ref: "Table", required: true }, // Relación con la sesión
    guestId: { type: Types.ObjectId }, // Nombre del invitado
    userId: { type: Types.ObjectId, ref: "User" },
    items: [
        {
            productId: { type: Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1 },
            status: { type: String, enum: ['Pendiente', 'En Preparacion', 'Listo', 'Cancelado', 'Entregado'], default: 'Pendiente' },
            comment: { type: String }
        }
    ],
    status: {type: String, default:'Sin Pagar'},
}, { timestamps: true });

const Order = mongoose.model<OrderType>("Order", OrderSchema);
export default Order;
