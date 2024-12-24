import { Ticket } from "./ticket.model";
import { User } from "./user.model";


export interface Message {
    _id: string;
    ticket : Ticket;
    sender : string | User;
    message : string;
    create_at: Date;
}