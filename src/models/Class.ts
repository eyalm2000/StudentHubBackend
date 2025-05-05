import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './User';

export interface IClass extends Document {
    _id: Types.ObjectId;
    name: string;
    type: 'main' | 'course';
    googleCoursesIds: string[];
    members: Types.ObjectId[] | IUser[];
    // school: 
    createdAt: Date;
    updatedAt: Date;
}

const ClassSchema = new Schema({
    name: { 
        type: String,
        required: true,
        trim: true
     },
    type: { 
        type: String, 
        enum: ['main', 'course'],
        required: true
     },
    googleCoursesIds: { 
        type: [String],
        default: []
    },
    members: { 
        type: [Types.ObjectId], 
        ref: 'User', 
     },
}, { timestamps: true });

export default mongoose.model<IClass>('Class', ClassSchema);
