import apiClient from '../../../axios';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'application', title: 'New Application', message: 'John Doe applied for Senior Designer role.', is_read: false, created_at: '2m ago' },
  { id: 2, type: 'message', title: 'New Message', message: 'You have a new message from Jane Smith.', is_read: false, created_at: '1h ago' },
  { id: 3, type: 'job_posting', title: 'Job Approved', message: 'Your posting for Product Manager is now live.', is_read: true, created_at: '1d ago' }
];

export const NotificationService = {
  /**
   * Get all notifications for the current user
   */
  getNotifications: async (params = {}) => {
    try {
      const response = await apiClient.get('/notifications/', { params });
      return response.data;
    } catch (e: any) {
      console.warn('[NotificationService] getNotifications failed:', e.message);
      // Return empty instead of mock to allow UI to handle real state
      return { results: [], count: 0 };
    }
  },

  /**
   * Mark a specific notification as read
   */
  markAsRead: async (id: number | string) => {
    try {
      const response = await apiClient.patch(`/notifications/${id}/`, { is_read: true });
      return response.data;
    } catch {
      return { id, is_read: true };
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      const response = await apiClient.post('/notifications/mark_all_read/', {});
      return response.data;
    } catch {
      return { success: true };
    }
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (id: number | string) => {
    try {
      const response = await apiClient.delete(`/notifications/${id}/`);
      return response.data;
    } catch {
      return { success: true };
    }
  },
};





