import apiClient from '../../../axios';

// ─── Message Service ───────────────────────────────────────────────────────────
// ⚠️  NOTE: The Jobryn API.yaml specification does NOT currently define
// messaging/conversations endpoints. These methods are structured for future
// backend implementation. All calls are wrapped in try/catch and return
// safe empty-state fallbacks to avoid breaking the UI.
export const MessageService = {
  /**
   * Get all conversations for the current user.
   * ⚠️ Endpoint not yet in spec.
   */
  getConversations: async (params = {}) => {
    try {
      const response = await apiClient.get('/conversations/', { params });
      return response.data;
    } catch {
      return { results: [], count: 0 };
    }
  },

  /**
   * Get messages for a specific conversation.
   * ⚠️ Endpoint not yet in spec.
   */
  getMessages: async (conversationId: number | string, params = {}) => {
    try {
      const response = await apiClient.get(`/conversations/${conversationId}/messages/`, { params });
      return response.data;
    } catch {
      return { results: [], count: 0 };
    }
  },

  /**
   * Send a message in a conversation.
   * ⚠️ Endpoint not yet in spec.
   */
  sendMessage: async (conversationId: number | string, text: string) => {
    try {
      const response = await apiClient.post(`/conversations/${conversationId}/messages/`, { text });
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Start a new conversation with a user.
   * ⚠️ Endpoint not yet in spec.
   */
  startConversation: async (recipientId: number | string) => {
    try {
      const response = await apiClient.post('/conversations/', { recipient: recipientId });
      return response.data;
    } catch {
      return null;
    }
  },
};





