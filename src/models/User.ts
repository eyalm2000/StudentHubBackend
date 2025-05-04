import mongoose, { Schema, Document, Types } from 'mongoose';
import { encrypt, decrypt } from '../utils/encryption';
import config from '../config';

export interface IUser extends Document {
    _id: Types.ObjectId;
    googleAccountId: string;
    name: {
        google: string;
        moe: string;
    }
    email?: string;
    profilePictureUrl?: {
        google: string;
        ofek: string;
        webtop: string;
    }

    googleTokens?: {
        accessToken: string;
        refreshToken: string;
        expiresAt: Date;
    }

    credentialsCache?: {
        ofek: string;
        webtop: string;
    }

    mainClass?: Types.ObjectId;
    subClasses?: Types.ObjectId[];

    settings?: {
        notifications?: {
            newGrade?: boolean;
            newEvent?: boolean;
            newHomework?: boolean;
        }
    }

    isAdmin?: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema({
    googleAccountId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        google: {
            type: String,
            required: true,
        },
        moe: {
            type: String,
            required: false,
        },
    },
    
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    profilePictureUrl: {
        google: {
            type: String,
            required: false,
        },
        ofek: {
            type: String,
            required: false,
        },
        webtop: {
            type: String,
            required: false,
        }
    },

    googleTokens: {
        accessToken: { type: String },
        refreshToken: { type: String },
        expiresAt: { type: Date },
    },

    credentialsCache: {
        ofek: { type: String },
        webtop: { type: String }
    },

    mainClass: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
    },

    subClasses: [{
        type: Schema.Types.ObjectId,
        ref: 'Class',
    }],

    settings: {
        notifications: {
            newGrade: { type: Boolean, default: true },
            newEvent: { type: Boolean, default: true },
            newHomework: { type: Boolean, default: true },
        }
    },

    isAdmin: { type: Boolean, default: false },

}, { timestamps: true });

UserSchema.pre<IUser>('save', function(next) {
    if (!config.encryptionKey) {
        if (config.nodeEnv === 'development') {
            console.warn('!!! NO ENCRYPTION KEY, data will not be encrypted');
            return next();
        } else {
            return next(new Error('!!! NO ENCRYPTION KEY, please set the encryption key in the .env file before deploying to production'));
        }
    }

    if (this.isModified('credentialsCache.ofek') && this.credentialsCache?.ofek) {
        try {
            this.credentialsCache.ofek = encrypt(this.credentialsCache.ofek, config.encryptionKey);
        } catch (error) {
            console.error('!!! ERROR ENCRYPTING CREDENTIALS CACHE for ofek', error);
            return next(new Error('!!! ERROR ENCRYPTING CREDENTIALS CACHE for ofek'));
        }
    }

    if (this.isModified('credentialsCache.webtop') && this.credentialsCache?.webtop) {
        try {
            this.credentialsCache.webtop = encrypt(this.credentialsCache.webtop, config.encryptionKey);
        } catch (error) {
            console.error('!!! ERROR ENCRYPTING CREDENTIALS CACHE for webtop', error);
            return next(new Error('!!! ERROR ENCRYPTING CREDENTIALS CACHE for webtop'));
        }
    }

    if (this.isModified('googleTokens.refreshToken') && this.googleTokens?.refreshToken) {
        try {
            this.googleTokens.refreshToken = encrypt(this.googleTokens.refreshToken, config.encryptionKey);
        } catch (error) {
            console.error('!!! ERROR ENCRYPTING GOOGLE TOKENS for refreshToken', error);
            return next(new Error('!!! ERROR ENCRYPTING GOOGLE TOKENS for refreshToken'));
        }
    }

    next();
});

export default mongoose.model<IUser>('User', UserSchema);