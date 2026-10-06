

export interface LoginResponse {
    accessToken: string,
    expiresIn: number,
    role: 'ADMIN' | 'USER'
}
