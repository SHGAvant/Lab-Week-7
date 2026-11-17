import { Strategy as GitHubStrategy } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { Request  } from 'express';
import { Profile } from 'passport-github2';
import { VerifyCallback } from 'passport-oauth2';
import { database } from '../../models/userModel';

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: "http://localhost:8000/auth/github/callback",
        passReqToCallback: true,
    },

    async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        let user = database.find((user) => user.githubId === profile.id);

    if (!user) {
        user = {
            id: Math.max(0, ...database.map(u => u.id)) + 1,
            githubId: profile.id,
            name: profile.displayName || profile.username || "GitHub User",
            role: "user"
        };

        database.push(user);
    }
    return done(null, user);
    }
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
