import apiClient from '../../../axios';

export const AIService = {
  /**
   * Sends a message to the AI Gateway and returns the assistant's response.
   * @param message The message text from the user.
   */
  sendMessage: async (message: string): Promise<{ response: string }> => {
    // Note: apiClient uses baseURL: 'https://backend.jobryn.com/api/v1'
    // Providing an absolute URL here overrides the baseURL but keeps the interceptors (headers, token, etc.)
    const response = await apiClient.post('https://ai-gateway.jobryn.com/ai', { message });
    return response.data;
  },
};
