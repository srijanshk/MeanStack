export class user {
    username: string;
    passowrd: string;
    role: {
        type: string,
    enum: ['user', 'admin']
    }
}