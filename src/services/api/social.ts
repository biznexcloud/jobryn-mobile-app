import apiClient from '../../../axios';

/**
 * ─── Social & Feed Service ───────────────────────────────────────────────────
 * Connects to the live Jobryn backend for stories, posts, and interactions.
 * Endpoints sourced from the Jobryn API YAML:
 *   - /api/v1/stories/stori/           (list / create)
 *   - /api/v1/stories/stori/{id}/      (retrieve / update / delete)
 *   - /api/v1/stories/stori-likes/     (like)
 *   - /api/v1/stories/stori-comments/  (comment)
 *   - /api/v1/stories/stori-views/     (view tracking)
 *   - /api/v1/posts/post/              (feed)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface Story {
  id: string | number;
  user_name: string;
  user_avatar: string;
  image: string;
  caption?: string;
  created_at: string;
  views_count?: number;
  likes_count?: number;
  author?: number;
  author_email?: string;
}

/**
 * Normalize a raw API story object into the shape our UI components expect.
 * The backend returns: { id, author, caption, images, visibility, is_active, views_count, likes_count, author_email, ... }
 * The UI expects:       { id, image, user: { name, avatar }, caption, ... }
 */
const normalizeStory = (raw: any): any => {
  return {
    ...raw,
    // Map 'images' field → 'image' for the UI
    image: raw.images || raw.image || '',
    // Build a user object from whatever the backend provides
    user: raw.user || {
      id: raw.author,
      name: raw.author_name || raw.author_email || 'User',
      avatar: raw.author_avatar || `https://i.pravatar.cc/150?u=${raw.author || raw.id}`,
    },
    caption: raw.caption || '',
    created_at: raw.created_at || 'Just now',
  };
};

/**
 * Normalize a raw API comment object.
 */
const normalizeComment = (raw: any): any => {
  return {
    ...raw,
    id: String(raw.id),
    text: raw.content || raw.text || '',
    time: raw.created_at || 'Just now',
    likes: raw.likes_count ?? raw.likes ?? 0,
    author: raw.author || {
      id: raw.user?.id || raw.author_id,
      name: raw.user?.name || raw.author_name || raw.author_email || 'User',
      avatar: raw.user?.avatar || raw.author_avatar || `https://i.pravatar.cc/150?u=${raw.id}`,
      role: raw.user?.role || raw.author_role || 'Member'
    }
  };
};

/**
 * Normalize a raw API post object into the shape our UI components expect.
 */
const normalizePost = (raw: any): any => {
  return {
    ...raw,
    // Ensure id is a string
    id: String(raw.id),
    // Map content safely
    content: raw.content || '',
    image: raw.image || null,
    video: raw.video || null,
    likes: raw.likes_count ?? raw.likes ?? 0,
    comments_count: raw.comments_count ?? (Array.isArray(raw.comments) ? raw.comments.length : 0),
    reposts: raw.shares_count ?? raw.shares ?? 0,
    is_liked: String(raw.is_liked) === 'true',
    is_saved: Boolean(raw.is_saved),
    postedAt: raw.created_at || 'Just now',
    author: raw.author || {
      id: raw.user?.id || raw.author_id,
      name: raw.user?.name || raw.author_name || raw.author_email || 'User',
      avatar: raw.user?.avatar || raw.author_avatar || `https://i.pravatar.cc/150?u=${raw.id}`,
      headline: raw.user?.role || raw.author_role || 'Member'
    },
    // Recursively normalize comments if they exist in the post object
    comments: Array.isArray(raw.comments) ? raw.comments.map(normalizeComment) : []
  };
};


export const SocialService = {
  /**
   * Get active stories for the current session.
   * Maps backend Stori objects into UI-ready format.
   * Supports pagination: getStories({ page: 2 })
   */
  getStories: async (params: any = {}) => {
    try {
      const response = await apiClient.get('/stories/stori/', { params });
      const raw = response.data;
      
      // The API typically returns { count, next, previous, results: [] } or just []
      const results = Array.isArray(raw) ? raw : (raw?.results || []);
      const normalized = results.map(normalizeStory);
      
      return { 
        results: normalized,
        next: raw?.next || null,
        count: raw?.count || normalized.length
      };
    } catch (e: any) {
      console.error('[SocialService] getStories API failure:', e.message);
      // Return empty instead of simulation to allow UI to handle error states
      return { results: [], error: e.message };
    }
  },

  /**
   * Upload/create a story via the backend API.
   * Uses multipart/form-data for local image files.
   */
  uploadStory: async (data: { caption?: string; images: string; visibility?: string; is_active?: boolean }) => {
    try {
      const isLocalFile = data.images.startsWith('file://') || data.images.startsWith('content://');
      
      let response;
      if (isLocalFile) {
        const formData = new FormData();
        const filename = data.images.split('/').pop() || 'story.jpg';
        formData.append('images', {
          uri: data.images,
          name: filename,
          type: 'image/jpeg',
        } as any);
        if (data.caption) formData.append('caption', data.caption);
        formData.append('visibility', data.visibility || 'public');
        formData.append('is_active', String(data.is_active ?? true));
        
        response = await apiClient.post('/stories/stori/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await apiClient.post('/stories/stori/', {
          images: data.images,
          caption: data.caption || '',
          visibility: data.visibility || 'public',
          is_active: data.is_active ?? true,
        });
      }
      
      return { success: true, story: normalizeStory(response.data) };
    } catch (e: any) {
      console.error('[SocialService] uploadStory failed:', e.message);
      throw e; // Rethrow so UI can show error Alert
    }
  },

  /**
   * Get main feed posts (Discover/Networking).
   * Supports pagination: getFeed({ page: 1 })
   */
  getFeed: async (params: any = {}) => {
    try {
      const response = await apiClient.get('/posts/post/', { params });
      const raw = response.data;
      
      // Standardize the paginated response
      const results = Array.isArray(raw) ? raw : (raw?.results || []);
      const normalized = results.map(normalizePost);
      
      return { 
        results: normalized,
        next: raw?.next || null,
        count: raw?.count || normalized.length
      };
    } catch (e: any) {
      console.error('[SocialService] getFeed API failure:', e.message);
      // Return empty instead of simulation to allow UI to handle error states
      return { results: [], error: e.message };
    }
  },

  /**
   * Create a new social post.
   */
  createPost: async (data: { content: string; image?: string; video?: string; visibility?: string; shared_post?: number }) => {
    try {
      const isLocalFile = data.image?.startsWith('file://') || data.image?.startsWith('content://');
      
      let response;
      if (isLocalFile) {
        const formData = new FormData();
        const filename = data.image?.split('/').pop() || 'post.jpg';
        formData.append('content', data.content);
        formData.append('image', {
          uri: data.image,
          name: filename,
          type: 'image/jpeg',
        } as any);
        if (data.visibility) formData.append('visibility', data.visibility);
        
        response = await apiClient.post('/posts/post/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await apiClient.post('/posts/post/', data);
      }
      return response.data;
    } catch (e: any) {
      console.error('[SocialService] createPost failed:', e.message);
      throw e;
    }
  },

  /**
   * Get a single post detail with comments.
   */
  getPostDetail: async (id: string | number) => {
    try {
      const response = await apiClient.get(`/posts/post/${id}/`);
      return normalizePost(response.data);
    } catch (e: any) {
      console.error('[SocialService] getPostDetail failed:', e.message);
      throw e;
    }
  },

  /**
   * Like/Unlike a post.
   */
  toggleLike: async (postId: string | number) => {
    const response = await apiClient.post(`/posts/post/${postId}/like/`, {});
    return response.data;
  },

  /**
   * ─── Post Interactions ────────────────────────────────────────────────────
   */

  /**
   * Like a post.
   */
  likePost: async (postId: string | number) => {
    const response = await apiClient.post(`/posts/post/${postId}/like/`);
    return response.data;
  },

  /**
   * Save/Bookmark a post.
   */
  savePost: async (postId: string | number) => {
    const response = await apiClient.post(`/posts/post/${postId}/save/`);
    return response.data;
  },

  /**
   * Share/Repost a post.
   */
  sharePost: async (postId: string | number) => {
    const response = await apiClient.post(`/posts/post/${postId}/share/`);
    return response.data;
  },

  /**
   * Add a comment to a post.
   */
  addComment: async (postId: string | number, content: string) => {
    const response = await apiClient.post(`/posts/comments/`, { post: postId, content });
    return response.data;
  },

  /**
   * ─── Story Interactions ───────────────────────────────────────────────────
   */

  /**
   * Like a story. API: POST /stories/stori-likes/ { story: storyId }
   */
  likeStory: async (storyId: string | number) => {
    const response = await apiClient.post('/stories/stori-likes/', { story: storyId });
    return response.data;
  },

  /**
   * Add a comment/reply to a story. API: POST /stories/stori-comments/ { story, content }
   */
  addStoryComment: async (storyId: string | number, content: string) => {
    const response = await apiClient.post('/stories/stori-comments/', { story: storyId, content });
    return response.data;
  },

  /**
   * Track a story view. API: POST /stories/stori-views/ { story: storyId }
   */
  trackStoryView: async (storyId: string | number) => {
    const response = await apiClient.post('/stories/stori-views/', { story: storyId });
    return response.data;
  }
};
