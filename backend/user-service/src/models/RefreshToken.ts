import mongoose, { Schema } from "mongoose";
import config from "../config";

export interface RefreshToken {
    token: string,
    userId: mongoose.Types.ObjectId,
    family: string,
    isRevoked: boolean,
    revokedAt: Date,
    sessionExpiresAt: Date
}

const refreshTokenSchema = new Schema<RefreshToken>({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    family: {
        type: String,
        required: true,
        index: true
    },
    isRevoked: {
        type: Boolean,
        default: false
    },
    revokedAt: {
        type: Date,
        default: null,
        index: { expireAfterSeconds: config.cookies.refreshTokenTTL },
    },
    sessionExpiresAt: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model<RefreshToken>('RefreshToken', refreshTokenSchema);