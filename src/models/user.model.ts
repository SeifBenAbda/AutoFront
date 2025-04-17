// src/models/user.model.ts

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  position?: string;
  profile_picture_url?: string;
  is_active: boolean;
  date_joined?: Date;
  last_login?: Date | null;
  password_hash: string;
  role: string;
}