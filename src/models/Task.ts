import mongoose, { Schema, Document, Types } from 'mongoose';
import { IClass } from './Class';

export interface ITask extends Document {
    targetClass: Types.ObjectId;
    title: string;
    description?: string;
    type: 'assignment' | 'homework' | 'other';
    coverImage?: string;
    attachmentsUrls?: string[];
    dueDate?: {
        date: Date;
        lessonNumber: number;
    };
    // isDone: boolean; it should be per-user
    // subject: 
    // teacher: 
    source: 'classroom' | 'ofek' | 'user';
    creator?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema({
    targetClass: {
        type: Types.ObjectId,
        ref: 'Class',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    coverImage: {
        type: String,
        default: ''
    },
    attachmentsUrls: {
        type: [String],
        default: []
    },
    dueDate: {
        date: {
            type: Date,
        },
        lessonNumber: {
            type: Number,
        }
    },
    source: {
        type: String,
        enum: ['classroom', 'ofek', 'user'],
        required: true
    },
    creator: {
        type: Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);

