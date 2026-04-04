import apiClient from '../../../axios';

export const NotificationService = {
  /**
   * Get all notifications for the current user
   */
  getNotifications: async (params = {}) => {
    const response = await apiClient.get('/notifications/', { params });
    return response.data;
  },

  /**
   * Mark a specific notification as read
   */
  markAsRead: async (id: number | string) => {
    const response = await apiClient.patch(`/notifications/${id}/`, { is_read: true });
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const response = await apiClient.post('/notifications/mark_all_read/', {});
    return response.data;
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (id: number | string) => {
    const response = await apiClient.delete(`/notifications/${id}/`);
    return response.data;
  },
};





