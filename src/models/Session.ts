import mongoose, { Schema, Document, Types } from "mongoose";
import { OrderType, OrderSchema } from "./Order";

// Tipo de datos para un invitado/cliente
export type GuestType = {
    _id?: Types.ObjectId;
    name: string;
    email?: string; // Email opcional para futuros usos (fidelización, etc.)
    orders: OrderType[]; // Lista de órdenes asociadas a este invitado
};

// Tipo de datos para una Sesión
export type SessionType = Document & {
    tableId: Types.ObjectId; // Referencia a la mesa
    guests: GuestType[]; // Lista de invitados o clientes conectados
    startedAt: Date; // Fecha y hora de inicio de la sesión
    endedAt?: Date; // Fecha y hora de fin de la sesión (opcional)
};

// Esquema para un Invitado/Cliente
const GuestSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String }, // Email opcional del invitado
    orders: [OrderSchema] // Lista de órdenes embebidas, basadas en OrderSchema
});

// Esquema para una Sesión
const SessionSchema: Schema = new Schema({
    tableId: { type: Types.ObjectId, ref: "Table", required: true },
    guests: [GuestSchema], // Array de invitados conectados
    startedAt: { type: Date, default: Date.now }, // Fecha de inicio
    endedAt: { type: Date } // Fecha de fin, opcional hasta que se complete la sesión
});

// Asegurar que solo pueda existir una sesión activa por mesa
SessionSchema.index({ tableId: 1, endedAt: 1 }, { unique: true, partialFilterExpression: { endedAt: { $exists: false } } });

const Session = mongoose.model<SessionType>("Session", SessionSchema);
export default Session;
