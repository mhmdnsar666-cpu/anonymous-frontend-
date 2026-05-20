const API_BASE_URL = '/api';

export interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  likes: number;
  replies: number;
}

export interface User {
  id: number;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  messageCount: number;
  likeCount: number;
  replyCount: number;
  allowMessages: boolean;
  showTimestamps: boolean;
  enableNotifications: boolean;
}

export const api = {
  // Get all messages
  async getMessages(): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/messages`);
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    return response.json();
  },

  // Get a single message by ID
  async getMessage(id: number): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch message');
    }
    return response.json();
  },

  // Create a new message
  async createMessage(content: string, sender: string): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, sender }),
    });
    if (!response.ok) {
      throw new Error('Failed to create message');
    }
    return response.json();
  },

  // Like a message
  async likeMessage(id: number): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages/${id}/like`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to like message');
    }
    return response.json();
  },

  // Get user profile
  async getUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  },

  // Update user profile
  async updateUser(updates: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    return response.json();
  },
};
