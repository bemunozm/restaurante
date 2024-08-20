import { Document, Schema, Types } from "mongoose";
import mongoose from "mongoose";

export type TokenType = Document & {
    token: string;
    user: Types.ObjectId;
    createdAT: Date;
}

const TokenSchema = new Schema({
    token: { type: String, required: true},
    user: { type: Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now(), expires: "10m" }, //expires: "10m" = el token expira en 10 minutos
});

const Token = mongoose.model<TokenType>('Token', TokenSchema);
export default Token;