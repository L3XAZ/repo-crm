import bcrypt from 'bcryptjs';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { UserModel, IUser } from '../models/user.model';
import { config } from '../config';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

interface TokenPayload extends JwtPayload {
    sub: string;
}

export const authService = {
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    },

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    },

    createToken(user: IUser): string {
        const payload: TokenPayload = { sub: user.id };

        const options: SignOptions = {
            expiresIn: config.jwtExpiresIn as SignOptions['expiresIn']
        };

        return jwt.sign(payload, config.jwtSecret, options);
    },

    async register(dto: RegisterDto) {
        const existed = await UserModel.findOne({ email: dto.email }).lean();
        if (existed) {
            const err: any = new Error('Email already in use');
            err.status = 409;
            throw err;
        }

        const passwordHash = await this.hashPassword(dto.password);
        const newUser = await UserModel.create({ email: dto.email, passwordHash });

        return {
            token: this.createToken(newUser),
            user: { id: newUser.id, email: newUser.email }
        };
    },

    async login(dto: LoginDto) {
        const user = await UserModel.findOne({ email: dto.email });
        if (!user) {
            const err: any = new Error('Invalid credentials');
            err.status = 401;
            throw err;
        }

        const ok = await this.comparePassword(dto.password, user.passwordHash);
        if (!ok) {
            const err: any = new Error('Invalid credentials');
            err.status = 401;
            throw err;
        }

        return {
            token: this.createToken(user),
            user: { id: user.id, email: user.email }
        };
    }
};
