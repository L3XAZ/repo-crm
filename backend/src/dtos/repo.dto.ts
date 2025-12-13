import { z } from 'zod';

export const addRepoSchema = z.object({
    fullName: z.string().regex(/^[^/]+\/[^/]+$/, {
        message: 'Please enter repository in format "owner/repository"',
    }),
});

export type AddRepoDto = z.infer<typeof addRepoSchema>;
