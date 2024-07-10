export interface User {
    displayName: string;
    token: string;
    username: string;
    image?: string;
}

export interface UserFormValues {
    displayName?: string;
    email: string;
    password: string;
    username?: string;
}