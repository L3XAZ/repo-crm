import { Schema, model, Document, Types } from 'mongoose';

export interface IRepo extends Document {
    owner: string;
    name: string;
    url: string;
    stars: number;
    forks: number;
    issues: number;
    createdAt: Date;
    addedBy: Types.ObjectId;
    addedAt: Date;
    lastFetchedAt?: Date | null;
}

const RepoSchema = new Schema<IRepo>({
    owner: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true, default: '' },
    stars: { type: Number, required: true, default: 0 },
    forks: { type: Number, required: true, default: 0 },
    issues: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, required: true, default: Date.now },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    addedAt: { type: Date, default: Date.now },
    lastFetchedAt: { type: Date, default: null },
});

RepoSchema.index({ owner: 1, name: 1, addedBy: 1 }, { unique: true });

export const RepoModel = model<IRepo>('Repo', RepoSchema);
