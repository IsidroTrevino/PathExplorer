interface ChatSession {
    session_id: number;
    is_active: boolean;
    created_at: string;
}

interface ChatResponse {
    message_id: number;
    response: string;
    session_id: number;
    timestamp: string;
}

export class ChatService {
  async createSession(token: string): Promise<ChatSession> {
    try {
      const response = await fetch('/api/chat/session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create chat session');
      }

      const data = await response.json();
      return {
        session_id: data.session_id,
        is_active: data.is_active,
        created_at: data.created_at,
      };
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  async sendMessage(token: string, sessionId: number, message: string): Promise<ChatResponse> {
    try {
      const response = await fetch('/api/chat/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
