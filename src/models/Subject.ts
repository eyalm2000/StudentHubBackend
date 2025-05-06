import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubject extends Document {
    _id: Types.ObjectId;
    name: string;
    iconName: string; // for icons library (react-icons or similar)
    color: string; // user can choose custom color / auto-generated color
    createdAt: Date;
    updatedAt: Date;
}

const SubjectSchema = new Schema({
    // _id?
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    iconName: {
        type: String,
        required: false,
    },
    color: {
        type: String,
        required: false,
    }
}, { timestamps: true });

export default mongoose.model<ISubject>('Subject', SubjectSchema);
