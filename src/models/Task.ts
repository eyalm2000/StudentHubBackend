import mongoose, { Schema, Document, Types } from 'mongoose';
import { IClass } from './Class';
import { ISubject } from './Subject';
import { ITeacher } from './Teacher';

export interface ITask extends Document {
    _id: Types.ObjectId;
    targetClass: Types.ObjectId;
    title: string;
    description?: string;
    type: 'assignment' | 'homework' | 'other'; // no exams here, it's from the school
    coverImageUrl?: string;
    attachmentsUrls?: string[];
    dueDate?: {
        date: Date;
        lessonNumber: number;
    };
    // isDone: boolean; it should be per-user
    subject: Types.ObjectId;
    teacher: Types.ObjectId;
    source: 'classroom' | 'ofek' | 'fullproof' | 'webtop' | 'user' | 'unknown';
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
    type: {
        type: String,
        enum: ['assignment', 'homework', 'other'],
        required: true, 
    },
    coverImageUrl: {
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
            required: true,
        },
        lessonNumber: {
            type: Number,
        }
    },
    subject: {
        type: Types.ObjectId,
        ref: 'Subject',
        index: true,
    },
    teacher: {
        type: Types.ObjectId,
        ref: 'Teacher',
        index: true,
    },
    source: {
        type: String,
        enum: ['classroom', 'ofek', 'fullproof', 'webtop', 'user', 'unknown'],
        required: true
    },
    creator: {
        type: Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);

