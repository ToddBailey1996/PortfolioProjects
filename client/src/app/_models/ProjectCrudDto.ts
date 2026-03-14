export interface ProjectCrudDto{
    id: number;
    name: string;
    title: string;
    description: string;
    createdDate: Date;
    requiresLogin: boolean;
    TechList: string;
}