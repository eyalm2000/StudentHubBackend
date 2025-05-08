import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserTaskState extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    taskId: Types.ObjectId;
    isDone: boolean;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserTaskStateSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        index: true,
        required: true
    }, 
    taskId: {
        type: Types.ObjectId,
        ref: 'Task',
        required: true
    },
    isDone: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});

UserTaskStateSchema.index({ userId: 1, taskId: 1 }, { unique: true });

export const UserTaskState = mongoose.model<IUserTaskState>('UserTaskState', UserTaskStateSchema);
