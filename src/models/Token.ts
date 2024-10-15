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
    createdAt: { type: Date, default: Date.now(), expires: "1d" }, //expires: "10m" = el token expira en 10 minutos
});

const Token = mongoose.model<TokenType>('Token', TokenSchema);
export default Token;