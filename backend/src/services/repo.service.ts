import { RepoModel, IRepo } from '../models/repo.model';
import { githubService } from './github.service';
import { Types } from 'mongoose';
import { AddRepoDto } from '../dtos/repo.dto';

export const repoService = {
    async addRepo(userId: string, dto: AddRepoDto): Promise<IRepo> {
        const data = await githubService.fetchRepo(dto.fullName);

        const exists = await RepoModel.findOne({
            owner: data.owner,
            name: data.name,
            addedBy: userId
        });

        if (exists) {
            const err: any = new Error('Repository already added');
            err.status = 409;
            throw err;
        }

        return RepoModel.create({
            owner: data.owner,
            name: data.name,
            url: data.url,
            stars: data.stars,
            forks: data.forks,
            issues: data.issues,
            createdAt: data.createdAt,
            addedBy: new Types.ObjectId(userId),
            addedAt: new Date(),
            lastFetchedAt: new Date()
        });
    },

    async listRepos(userId: string) {
        return RepoModel.find({ addedBy: userId }).sort({ addedAt: -1 }).lean();
    },

    async refreshRepo(userId: string, repoId: string) {
        const repo = await RepoModel.findById(repoId);
        if (!repo) {
            const err: any = new Error('Repository not found');
            err.status = 404;
            throw err;
        }

        if (repo.addedBy.toString() !== userId) {
            const err: any = new Error('Forbidden');
            err.status = 403;
            throw err;
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
            const err: any = new Error('Repository not found');
            err.status = 404;
            throw err;
        }

        if (repo.addedBy.toString() !== userId) {
            const err: any = new Error('Forbidden');
            err.status = 403;
            throw err;
        }

        await RepoModel.deleteOne({ _id: repoId });
    }
};
