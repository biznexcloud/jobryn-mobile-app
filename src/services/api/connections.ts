import apiClient from '../../../axios';

// ─── Connection Service ────────────────────────────────────────────────────────
// ⚠️  NOTE: The Jobryn API.yaml specification does NOT currently define
// networking/connections endpoints. These methods are structured for future
// backend implementation. All calls are wrapped in try/catch and return
// safe empty-state fallbacks to avoid breaking the UI.
export interface ConnectionStatus {
  is_following: boolean;
  is_connected: boolean;
  connection_id?: number | string;
}

export const ConnectionService = {
  /**
   * Check connection/follow status with a target user.
   * ⚠️ Endpoint not yet in spec — returns empty state as fallback.
   */
  getStatus: async (targetId: string | number): Promise<ConnectionStatus> => {
    try {
      const response = await apiClient.get(`/networking/status/${targetId}/`);
      return response.data;
    } catch {
      return { is_following: false, is_connected: false };
    }
  },

  /**
   * Follow a user or company.
   * ⚠️ Endpoint not yet in spec.
   */
  follow: async (targetId: string | number) => {
    try {
      const response = await apiClient.post(`/networking/follow/${targetId}/`, {});
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Unfollow a user or company.
   * ⚠️ Endpoint not yet in spec.
   */
  unfollow: async (targetId: string | number) => {
    try {
      const response = await apiClient.delete(`/networking/follow/${targetId}/`);
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Send a connection request.
   * ⚠️ Endpoint not yet in spec.
   */
  connect: async (targetId: string | number) => {
    try {
      const response = await apiClient.post('/networking/connect/', { target_id: targetId });
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Get all connections for the current user.
   * ⚠️ Endpoint not yet in spec.
   */
  getConnections: async (params = {}) => {
    try {
      const response = await apiClient.get('/networking/connections/', { params });
      return response.data;
    } catch {
      return { results: [], count: 0 };
    }
  },

  /**
   * Accept a connection request.
   * ⚠️ Endpoint not yet in spec.
   */
  acceptRequest: async (requestId: string | number) => {
    try {
      const response = await apiClient.post(`/networking/requests/${requestId}/accept/`, {});
      return response.data;
    } catch {
      return null;
    }
  },

  /**
   * Decline a connection request.
   * ⚠️ Endpoint not yet in spec.
   */
  declineRequest: async (requestId: string | number) => {
    try {
      const response = await apiClient.delete(`/networking/requests/${requestId}/`);
      return response.data;
    } catch {
      return null;
    }
  },
};





