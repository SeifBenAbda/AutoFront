import { User } from "./user.model";


export interface Schedule {
    _id: string;
    user_id: string | User;
    title: string;
    description: string;
    date: Date;
    start_time: string;
    end_time: string;
    location: string | undefined;
    create_at: Date;
  }