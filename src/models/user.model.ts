// src/models/user.model.ts

export interface User {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  position?: string;
  profilePictureUrl?: string;
  isActive: boolean;
  dateJoined?: Date;
  lastLogin?: Date | null;
  role: string;
  password?: string;
}