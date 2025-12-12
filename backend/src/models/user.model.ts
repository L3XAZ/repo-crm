import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() }
});

export const UserModel = model<IUser>('User', UserSchema);
