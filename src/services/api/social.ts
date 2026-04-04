import apiClient from '../../../axios';

/**
 * ─── Social & Feed Service ───────────────────────────────────────────────────
 * ⚠️ NOTE: The current Jobryn API.yaml does not explicitly define social feed 
 * endpoints. This service uses standardized conventions (/api/v1/posts/) 
 * structured for future backend alignment.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface Story {
  id: string | number;
  user_name: string;
  user_avatar: string;
  image: string;
  created_at: string;
}

let TEMP_STORIES: Story[] = [
  { 
    id: 's1', 
    user_name: 'Alex Rivers', 
    user_avatar: 'https://i.pravatar.cc/150?u=a1', 
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
    created_at: '1h ago'
  },
  {
    id: 's2',
    user_name: 'CreativeHub',
    user_avatar: 'https://i.pravatar.cc/150?u=c1',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
    created_at: '3h ago'
  }
];

export const SocialService = {
  /**
   * Get active stories for the current session.
   */
  getStories: async () => {
    // In a real app, this would fetch from /api/v1/stories/
    return TEMP_STORIES;
  },

  /**
   * Upload a story for the current session.
   */
  uploadStory: async (data: { uri?: string; text?: string; bg?: string[]; user: any }) => {
    const newStory: Story = {
      id: 'ns-' + Math.random(),
      user_name: data.user?.name || 'You',
      user_avatar: data.user?.avatar || 'https://i.pravatar.cc/150?u=me',
      image: data.uri || 'https://via.placeholder.com/1080x1920?text=' + encodeURIComponent(data.text || 'New Story'),
      created_at: 'Just now'
    };
    TEMP_STORIES = [newStory, ...TEMP_STORIES];
    return { success: true, story: newStory };
  },
  /**
   * Get main feed posts (Discover/Networking).
   */
  getFeed: async (params = {}) => {
    try {
      const response = await apiClient.get('/posts/', { params });
      return response.data;
    } catch {
      // Return structured dummy data for visual parity if endpoint fails
      return {
        results: [
          {
            id: 'p1',
            user: { id: 101, name: 'Alex Rivers', role: 'Fullstack Dev', avatar: 'https://i.pravatar.cc/150?u=a1' },
            likes_count: 24,
            comments_count: 5,
            is_liked: true,
            is_saved: false,
            reaction_summary: 'Sarah Jenkins and 23 others',
            created_at: '2h ago'
          },
          {
            id: 'p2',
            user: { id: 202, name: 'TechCorp Solutions', role: 'Recruiter', avatar: 'https://i.pravatar.cc/150?u=t1' },
            content: 'We are expanding our mission team in London! Looking for Senior React Native architects who thrive in high-stakes environments. Apply via the Jobs portal.',
            image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800',
            likes_count: 56,
            comments_count: 12,
            is_liked: false,
            is_saved: true,
            reaction_summary: 'Binod Tamang and 55 others',
            created_at: '5h ago'
          }
        ]
      };
    }
  },

  /**
   * Create a new social post.
   */
  createPost: async (data: { content: string; image?: string; feeling?: string; backgroundColor?: string }) => {
    try {
      const response = await apiClient.post('/posts/', data);
      return response.data;
    } catch {
      return { success: true, message: 'Post simulated successfully.', data };
    }
  },

  /**
   * Get a single post detail with comments.
   */
  getPostDetail: async (id: string | number) => {
    try {
      const response = await apiClient.get(`/posts/${id}/`);
      return response.data;
    } catch {
      return {
        id,
        user: { id: 101, name: 'Alex Rivers', role: 'Fullstack Dev', avatar: 'https://i.pravatar.cc/150?u=a1' },
        content: 'Simulation detail of post ' + id,
        likes_count: 10,
        comments_count: 2,
        is_liked: false,
        created_at: '1d ago',
        comments: [
          { 
            id: 'c1', 
            author: { name: 'Sarah Mission', avatar: 'https://i.pravatar.cc/150?u=s1', role: 'Talent Acquisition' }, 
            content: 'Great insights! This modular approach is exactly what modern teams need.', 
            time: '1h ago', 
            reaction_count: 5,
            is_liked: true
          },
          { 
            id: 'c2', 
            author: { name: 'Dev Ops', avatar: 'https://i.pravatar.cc/150?u=d1', role: 'System Architect' }, 
            content: 'Totally agree. The scalability here is impressive.', 
            time: '30m ago', 
            reaction_count: 2,
            is_liked: false
          }
        ]
      };
    }
  },

  /**
   * Like/Unlike a post.
   */
  toggleLike: async (postId: string | number) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/like/`, {});
      return response.data;
    } catch {
      return { status: 'success' };
    }
  },

  /**
   * Save/Unsave a post (Simulated).
   */
  toggleSave: async (postId: string | number) => {
    try {
      // In a real app: apiClient.post(`/posts/${postId}/save/`, {});
      return { status: 'success', saved: true };
    } catch {
      return { status: 'success' };
    }
  },

  /**
   * Share a post (Simulated).
   */
  sharePost: async (postId: string | number, platform: string) => {
    try {
      // In a real app: apiClient.post(`/posts/${postId}/share/`, { platform });
      return { status: 'success', shared: true, platform };
    } catch {
      return { status: 'success' };
    }
  },

  /**
   * Add a comment to a post.
   */
  addComment: async (postId: string | number, content: string) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/comments/`, { content });
      return response.data;
    } catch {
      return { 
        id: 'new-c-' + Math.random(), 
        content, 
        author: { name: 'You', avatar: 'https://i.pravatar.cc/150?u=me', role: 'Professional' },
        time: 'Just now',
        likes: 0
      };
    }
  }
};





