import { Document, Schema, Types } from "mongoose";
import mongoose from "mongoose";

export type SessionTokenType = Document & {
    token: string;
    session: Types.ObjectId;
    createdAT: Date;
}

const SessionTokenSchema = new Schema({
    token: { type: String, required: true},
    session: { type: Types.ObjectId, ref: 'Session' },
    createdAt: { type: Date, default: Date.now()},
});

const SessionToken = mongoose.model<SessionTokenType>('SessionToken', SessionTokenSchema);
export default SessionToken;