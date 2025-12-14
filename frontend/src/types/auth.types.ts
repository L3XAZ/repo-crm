export type User = {
    id: string;
    email: string;
};

export type AuthResponse = {
    user: User;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    email: string;
    password: string;
};
