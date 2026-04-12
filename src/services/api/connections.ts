import apiClient from '../../../axios';

// ─── Connection Service ────────────────────────────────────────────────────────
// Wraps the Jobryn /follows/ endpoints.
// Docs note: Some endpoints (accept/decline/pending) may not yet be in the
// API spec — safe fallbacks ensure the UI degrades gracefully.
// ─────────────────────────────────────────────────────────────────────────────

export interface ConnectionStatus {
  is_following: boolean;
  is_connected: boolean;
  connection_id?: number | string;
}

export const ConnectionService = {

  // ── Status ────────────────────────────────────────────────────────────────

  /** Check connection/follow status with a target user. */
  getStatus: async (targetId: string | number): Promise<ConnectionStatus> => {
    const response = await apiClient.get(`/follows/status/${targetId}/`);
    return response.data;
  },

  // ── Follow / Unfollow ─────────────────────────────────────────────────────

  /** Follow a user — creates a follow / connection request. */
  follow: async (targetId: string | number) => {
    const response = await apiClient.post('/follows/follow/', { following: targetId });
    return response.data;
  },

  /** Unfollow / remove follow by follow-record ID. */
  unfollow: async (followId: string | number) => {
    await apiClient.delete(`/follows/unfollow/${followId}/`);
  },

  /** Alias — send a connection request. */
  connect: async (targetId: string | number) => {
    return ConnectionService.follow(targetId);
  },

  // ── Followers / Following ─────────────────────────────────────────────────

  /** Get all people FOLLOWING the user (accepted connections). */
  getFollowers: async (userId: string | number, params: any = {}) => {
    const response = await apiClient.get(`/follows/followers/${userId}/`, { params });
    return response.data;
  },

  /** Get all people the user is FOLLOWING. */
  getFollowing: async (userId: string | number, params: any = {}) => {
    const response = await apiClient.get(`/follows/following/${userId}/`, { params });
    return response.data;
  },

  /** Get connections for logged-in user (me). */
  getConnections: async (params: any = {}) => {
    const response = await apiClient.get('/follows/followers/me/', { params });
    return response.data;
  },

  // ── Pending / Invitations ─────────────────────────────────────────────────

  /**
   * Get pending connection requests sent TO the current user.
   * These are followers whose follow has not yet been reciprocated
   * (i.e., you have not followed back).
   * Tries a dedicated /follows/pending/ endpoint first; falls back to
   * filtering notifications for connection-request types.
   */
  getPendingRequests: async (): Promise<any[]> => {
    try {
      // Primary: dedicated pending endpoint if it exists
      const response = await apiClient.get('/follows/pending/');
      const data = response.data;
      return Array.isArray(data) ? data : (data?.results || []);
    } catch {
      // Fallback: pull connection-type notifications as invitations
      try {
        const response = await apiClient.get('/notifications/', {
          params: { notification_type: 'connection_request', is_read: false },
        });
        const data = response.data;
        const results = Array.isArray(data) ? data : (data?.results || []);
        // Shape notifications into a follower-like object
        return results
          .filter((n: any) =>
            n.notification_type === 'connection_request' ||
            n.type === 'connection' ||
            (n.message || n.title || '').toLowerCase().includes('connect')
          )
          .map((n: any) => ({
            id: n.id,
            notification_id: n.id,
            follower: n.sender || n.actor_id,
            follower_email: n.sender_email || n.actor_email || '',
            follower_name: n.sender_name || n.actor_name || n.sender_email?.split('@')[0] || 'Someone',
            follower_avatar: n.sender_avatar || n.actor_avatar || '',
            follow_type_display: n.message || n.title || 'Wants to connect with you',
            created_at: n.created_at,
            _from_notification: true,
          }));
      } catch {
        return [];
      }
    }
  },

  /**
   * Accept a pending connection request.
   * Follows the requester back (mutual follow = connection).
   */
  acceptRequest: async (requesterId: string | number, notificationId?: string | number) => {
    // Follow back = accept connection
    await ConnectionService.follow(requesterId);
    // Optionally mark the notification as read
    if (notificationId) {
      try {
        await apiClient.patch(`/notifications/${notificationId}/`, { is_read: true });
      } catch { /* non-critical */ }
    }
  },

  /**
   * Decline a pending connection request.
   * If the record has a follow ID, unfollow it; otherwise mark notification read.
   */
  declineRequest: async (followId?: string | number, notificationId?: string | number) => {
    if (followId) {
      try {
        await ConnectionService.unfollow(followId);
      } catch { /* may not exist yet */ }
    }
    if (notificationId) {
      try {
        await apiClient.patch(`/notifications/${notificationId}/`, { is_read: true });
      } catch { /* non-critical */ }
    }
  },

  getSuggestions: async (params: any = {}): Promise<any[]> => {
    try {
      // Attempt to hit the dedicated suggestion API
      const response = await apiClient.get('/follows/suggestions/', { params });
      const data = response.data;
      return Array.isArray(data) ? data : (data?.results || []);
    } catch {
      // Fallback: Try mixing recruiters and seekers to allow bidirectional connections
      let mixedResults: any[] = [];
      
      try {
        const seekerRes = await apiClient.get('/profiles/seeker/', { params: { page_size: 15, ...params } });
        const sData = seekerRes.data;
        mixedResults = mixedResults.concat(Array.isArray(sData) ? sData : (sData?.results || []));
      } catch (err: any) {
        // Silently swallow 403s if a specific user role lacks permission
      }

      try {
        const recruiterRes = await apiClient.get('/profiles/recruiter/', { params: { page_size: 15, ...params } });
        const rData = recruiterRes.data;
        mixedResults = mixedResults.concat(Array.isArray(rData) ? rData : (rData?.results || []));
      } catch (err: any) {
        // Silently swallow 403s 
      }
      
      return mixedResults;
    }
  },
};
