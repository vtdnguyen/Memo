interface Avatar {
    id: string;
    url: string;
    name: string;
    format: string;
    key: string;
}

export interface User {
    avatarId: string | null;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    phoneNumber: string | null;
    username: string;
    avatar: Avatar;
}

export interface AuthState {
    token: string | null;
    refreshToken: string | null;
    isFirstTimeUser: boolean;
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
}