import { Document, Schema, Types } from "mongoose";
import mongoose from "mongoose";

export type TokenType = Document & {
    token: string;
    user?: Types.ObjectId;
    session?: Types.ObjectId;
    createdAT: Date;
}

const TokenSchema = new Schema({
    token: { type: String, required: true},
    user: { type: Types.ObjectId, ref: 'User' },
    session: { type: Types.ObjectId, ref: 'Session' },
    createdAt: { type: Date, default: Date.now, expires: 43200 }, // Expira en 12 horas (43200 segundos)
});

const Token = mongoose.model<TokenType>('Token', TokenSchema);
export default Token;