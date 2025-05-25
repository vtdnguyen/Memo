import { User } from "./auth";

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
}