import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITeacher extends Document {
    _id: Types.ObjectId;
    name: string;
    subjects: Types.ObjectId[];
    email?: string; // all emails from classroom users
    createdAt: Date;
    updatedAt: Date;
}

const TeacherSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    subjects: {
        type: [Types.ObjectId],
        ref: 'Subject',
    },
    email: {
        type: String,
        required: false,
        trim: true,
        unique: true,
    }
}, { timestamps: true });

export default mongoose.model<ITeacher>('Teacher', TeacherSchema);