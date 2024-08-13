import mongoose, { Schema, Document, Types, PopulatedDoc } from "mongoose";
import { TableType } from "./Table";
import { OrderType } from "./Order";
import { ClientType } from "./Client";


// TypeScript type
export type SessionType = Document & {
    table: PopulatedDoc<TableType & Document>;
    token: string;
    clients: PopulatedDoc<ClientType & Document>[];
    orders: PopulatedDoc<OrderType & Document>[];
    startedAt: Date;
    expiresAt: Date;
};

// Mongoose model
const SessionSchema: Schema = new Schema({
    table: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
    token: { type: String, required: true },
    clients: [{ type: Schema.Types.ObjectId, ref: 'Client' }], // Aquí se referencian los clientes por email
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    startedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

const Session = mongoose.model<SessionType>("Session", SessionSchema);
export default Session;
