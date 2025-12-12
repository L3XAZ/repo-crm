import { Schema, model, Document, Types } from 'mongoose';

export interface IRepo extends Document {
    owner: string;
    name: string;
    url: string;
    stars: number;
    forks: number;
    issues: number;
    createdAt: string;
    addedBy: Types.ObjectId;
    addedAt: Date;
    lastFetchedAt?: Date;
}

const RepoSchema = new Schema<IRepo>({
    owner: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    stars: { type: Number, required: true },
    forks: { type: Number, required: true },
    issues: { type: Number, required: true },
    createdAt: { type: String, required: true },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    addedAt: { type: Date, default: () => new Date() },
    lastFetchedAt: { type: Date }
});

RepoSchema.index({ owner: 1, name: 1, addedBy: 1 }, { unique: true });

export const RepoModel = model<IRepo>('Repo', RepoSchema);
