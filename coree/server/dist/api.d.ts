export type AuthResponse = {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
};
export declare function register(data: {
    name: string;
    email: string;
    password: string;
}): Promise<AuthResponse>;
export declare function login(data: {
    email: string;
    password: string;
}): Promise<AuthResponse>;
//# sourceMappingURL=api.d.ts.map