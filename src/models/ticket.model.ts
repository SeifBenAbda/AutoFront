import { User } from "./user.model";


export interface Ticket {
    _id: string;
    title: string;
    description: string;
    user_id: string | User;
    status: string; //open or closed 
    create_at: Date;
    assign_at: string | User;
}