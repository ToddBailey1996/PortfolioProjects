export interface UsersCrudDto{
    id: number;
    username: string;
    password: string;
    createdDate: Date;
    isActive: boolean;
}