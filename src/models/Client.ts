import mongoose, { Schema, Document } from "mongoose";

// TypeScript type
export type ClientType = Document & {
    email: string;
    confirmed: boolean;
};

// Mongoose model
const ClientSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    confirmed: { type: Boolean, required: true, default: false },
}, { timestamps: true });

const Client = mongoose.model<ClientType>("Client", ClientSchema);
export default Client;
