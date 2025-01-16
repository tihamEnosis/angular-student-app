export interface studentFromDB{
    id: number;
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    initialFileName: string;
    modifiedFileName: string;
    path: string;
    createdAt: string;
    updatedAt: string;
}

export interface customHttpResponse {
    status:number;
    message:string;
}