import { Types } from 'mongoose';

import { AddRepoDto } from '../dtos/repo.dto';
import { RepoModel, IRepo } from '../models/repo.model';
import { HttpError } from '../utils/HttpError';

import { githubService } from './github.service';

export const repoService = {
    async addRepo(userId: string, dto: AddRepoDto): Promise<IRepo> {
        const data = await githubService.fetchRepo(dto.fullName);

        const exists = await RepoModel.findOne({
            owner: data.owner,
            name: data.name,
            addedBy: userId,
        });

        if (exists) {
            throw new HttpError(409, 'Repository already added');
        }

        return RepoModel.create({
            owner: data.owner,
            name: data.name,
            url: data.url,
            stars: data.stars,
            forks: data.forks,
            issues: data.issues,
            createdAt: new Date(data.createdAt),
            addedBy: new Types.ObjectId(userId),
            addedAt: new Date(),
            lastFetchedAt: new Date(),
        });
    },

    async listRepos(userId: string) {
        return RepoModel.find({ addedBy: userId }).sort({ addedAt: -1 }).lean();
    },

    async refreshRepo(userId: string, repoId: string) {
        const repo = await RepoModel.findById(repoId);
        if (!repo) {
            throw new HttpError(404, 'Repository not found');
        }

        if (repo.addedBy.toString() !== userId) {
            throw new HttpError(403, 'Forbidden');
        }

        const latest = await githubService.fetchRepo(`${repo.owner}/${repo.name}`);

        repo.stars = latest.stars;
        repo.forks = latest.forks;
        repo.issues = latest.issues;
        repo.lastFetchedAt = new Date();

        await repo.save();
        return repo;
    },

    async deleteRepo(userId: string, repoId: string): Promise<void> {
        const repo = await RepoModel.findById(repoId);
        if (!repo) {
            throw new HttpError(404, 'Repository not found');
        }

        if (repo.addedBy.toString() !== userId) {
            throw new HttpError(403, 'Forbidden');
        }

        await RepoModel.deleteOne({ _id: repoId });
    },
};
