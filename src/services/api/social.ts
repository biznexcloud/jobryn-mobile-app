import { Platform } from 'react-native';
import apiClient from '../../../axios';
import { useAuthStore } from '../../store/authStore';

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
 */

export const BASE_URL = 'https://backend.jobryn.com';
export const API_BASE = `${BASE_URL}/api/v1`;

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
]; // Root domain for media files

/**
 * Helper to ensure a URL is absolute. 
 * Prepends BASE_URL if the path is relative (/media/...).
 */
const ensureFullUrl = (path: any): string => {
  if (!path) return '';
  
  // Handle arrays
  if (Array.isArray(path) && path.length > 0) {
    return ensureFullUrl(path[0]);
  }

  // Handle nested objects
  if (typeof path === 'object' && path !== null) {
    const objPath = path.image || path.file || path.url || path.path || path.uri || path.link;
    if (objPath) return ensureFullUrl(objPath);
    return '';
  }

  if (typeof path !== 'string') return '';

  // Handle absolute URLs (including local uris for preview)
  if (path.startsWith('http') || path.startsWith('file://') || path.startsWith('content://') || path.startsWith('data:')) {
    return path;
  }

  if (path === 'null' || path === 'undefined' || path === 'None') return '';

  // Handle protocol-relative URLs
  if (path.startsWith('//')) {
    return `https:${path}`;
  }

  // Handle relative paths
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath === '/' || cleanPath === '/media/' || cleanPath === '/media/null' || cleanPath === '/images/null' || cleanPath.endsWith('/None')) return '';
  
  return `${BASE_URL}${cleanPath}`;
};

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
/**
 * Internal helper to robustly extract author identity from inconsistent API responses.
 * Attempts to find name and avatar in author, user, creator, owner, or top-level properties.
 */
const extractAuthor = (raw: any, id?: string) => {
  // Try to reconstruct a readable name from email if name is missing
  const emailPrefix = raw.author_email?.split('@')[0] || '';
  const fallbackName = emailPrefix 
    ? emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)
    : `User ${id || ''}`;

  return {
    id: id || String(raw.author || ''),
    name: raw.author_name || fallbackName,
    avatar: raw.author_profile_image || raw.author_avatar || DEFAULT_AVATARS[Number(id || 0) % 4],
    role: raw.author_role || 'Member'
  };
};

/**
 * Normalize a raw API story object into the shape our UI components expect.
 */
const normalizeStory = (raw: any): any => {
  const author = extractAuthor(raw, String(raw.id));
  return {
    ...raw,
    image: ensureFullUrl(raw.images || raw.image || raw.media || raw.file || raw.image_url || raw.file_url || raw.attachment),
    user: author,
    user_name: author.name,
    user_avatar: author.avatar,
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
    author: extractAuthor(raw, String(raw.author_id || raw.id))
  };
};

/**
 * Normalize a raw API post object into the shape our UI components expect.
 */
const normalizePost = (raw: any): any => {
  return {
    ...raw,
    id: String(raw.id),
    content: raw.content || '',
    image: (() => {
      const candidates = [
        raw.image, raw.images, raw.media, raw.file, 
        raw.image_url, raw.file_url, raw.post_media, 
        raw.attachment, raw.attachment_url,
        raw.picture, raw.photo, raw.thumbnail, 
        raw.featured_image, raw.preview_image,
        raw.file_path, raw.media_path, raw.post_image, raw.post_media,
        // Dig even deeper if it's an array or object in a weird key
        raw.meta?.image, raw.data?.image, raw.content_media,
        raw.image_file, raw.attachment_file
      ];
      for (const c of candidates) {
         const resolved = ensureFullUrl(c);
         if (resolved) return resolved;
      }
      return '';
    })(),
    video: raw.video ? ensureFullUrl(raw.video) : null,
    likes: raw.likes_count ?? raw.likes ?? 0,
    comments_count: raw.comments_count ?? (Array.isArray(raw.comments) ? raw.comments.length : 0),
    comments: raw.comments_count ?? (Array.isArray(raw.comments) ? raw.comments.length : 0),
    reposts: raw.shares_count ?? raw.shares ?? 0,
    is_liked: String(raw.is_liked) === 'true',
    is_liked_by_me: String(raw.is_liked) === 'true',
    is_saved: Boolean(raw.is_saved),
    postedAt: raw.created_at || 'Just now',
    author: extractAuthor(raw),
    get authorId() {
      return this.author.id;
    },
    comments_list: Array.isArray(raw.comments) ? raw.comments.map(normalizeComment) : []
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
        
        response = await apiClient.post('/stories/stori/', formData);
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
        const uri = data.image!;
        const filename = uri.split('/').pop() || 'upload.jpg';
        const extension = filename.split('.').pop()?.toLowerCase() || 'jpg';
        
        // Map common extensions to full MIME types to satisfy Android native layer
        const mimeMap: Record<string, string> = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp'
        };
        const type = mimeMap[extension] || 'image/jpeg';
        
        const finalUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');
        
        console.log('--- [DEBUG] Uploading Image:', { uri: finalUri, type, filename });

        formData.append('content', data.content);
        
        // Single field upload to avoid Network Error in RN 0.83
        formData.append('image', {
          uri: finalUri,
          name: filename,
          type: type,
        } as any);

        if (data.shared_post) formData.append('shared_post', String(data.shared_post));
        
        console.log('--- [DEBUG] Uploading Post with image file via FETCH BYPASS');
        
        // Final connectivity bypass: Use native fetch for multipart to avoid Axios/Android boundary conflicts
        const token = useAuthStore.getState().token;
        const fetchResponse = await fetch(`${BASE_URL}/api/v1/posts/post/`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            // Do NOT set Content-Type; the native fetch will set boundary automatically
          },
        });

        if (!fetchResponse.ok) {
          const errorData = await fetchResponse.json().catch(() => ({}));
          console.error('[SocialService] Fetch upload failed:', errorData);
          throw new Error(errorData.detail || 'Upload failed');
        }

        const responseData = await fetchResponse.json();
        console.log('--- [DEBUG] Post creation SUCCESS via Fetch');
        return responseData;
      } else {
        const response = await apiClient.post('/posts/post/', data);
        return response.data;
      }
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
    try {
      const response = await apiClient.post(`/posts/post/${postId}/like/`);
      return response.data;
    } catch (e: any) {
      // If backend fails with 500 (out of range) or 403, we still want to resolve locally
      console.warn('Like action failed on server:', e.message);
      return { success: false };
    }
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
    // Explicitly cast to Number for the 'post' ForeignKey field to prevent DB IntegrityErrors
    const numericPostId = Number(postId);
    const response = await apiClient.post(`/posts/comments/`, { 
      post: numericPostId, 
      content 
    });
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
