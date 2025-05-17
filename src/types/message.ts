export interface Friend {
    id: string;
    name: string;
    avatar: string;
    unreadCount: number;
  }
  
  export interface Message {
    id: string;
    text: string;
    timestamp: string;
    sender: 'me' | 'them';
  }