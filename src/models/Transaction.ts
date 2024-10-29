import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { OrderType } from "./Order";
import { SessionType } from "./Session";

// Typescript type
export type TransactionType = Document & {
    token: string;
    orders: PopulatedDoc<OrderType & Document>;
    sessionId: PopulatedDoc<SessionType & Document>;
    amount: number;
    status: 'CREADA' | 'CONFIRMADA' | 'ANULADA';
};

// Mongoose model
const TransactionSchema: Schema = new Schema({
    token: { type: String, trim: true },
    orders: [{ type: Types.ObjectId , required: true, ref: "Order" }],
    sessionId: { type: Types.ObjectId, required: true, ref: "Session" },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['CREADA', 'CONFIRMADA', 'ANULADA'], default: 'CREADA' }
});

const Transaction = mongoose.model<TransactionType>("Transaction", TransactionSchema);
export default Transaction;
