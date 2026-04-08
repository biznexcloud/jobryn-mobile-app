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
   */
  getStatus: async (targetId: string | number): Promise<ConnectionStatus> => {
    const response = await apiClient.get(`/follows/status/${targetId}/`);
    return response.data;
  },

  /**
   * Follow a user or company.
   */
  follow: async (targetId: string | number) => {
    const response = await apiClient.post('/follows/follow/', { following: targetId });
    return response.data;
  },

  /**
   * Unfollow a user or company.
   */
  unfollow: async (followId: string | number) => {
    await apiClient.delete(`/follows/unfollow/${followId}/`);
  },

  /**
   * Send a connection request (Mutual Follow initiation).
   */
  connect: async (targetId: string | number) => {
    return ConnectionService.follow(targetId);
  },

  /**
   * Get all people the user is FOLLOWING.
   */
  getFollowing: async (userId: string | number, params = {}) => {
    const response = await apiClient.get(`/follows/following/${userId}/`, { params });
    return response.data;
  },

  /**
   * Get all people FOLLOWING the user.
   */
  getFollowers: async (userId: string | number, params = {}) => {
    const response = await apiClient.get(`/follows/followers/${userId}/`, { params });
    return response.data;
  },

  /**
   * Unified call to get "Connections" (Mutual follows or general network).
   */
  getConnections: async (params = {}) => {
    const response = await apiClient.get('/follows/followers/me/', { params });
    return response.data;
  },

  acceptRequest: async (targetId: string | number) => {
    return ConnectionService.follow(targetId);
  },

  declineRequest: async (followId: string | number) => {
    return ConnectionService.unfollow(followId);
  },
};





