/**
 * API Client for synaptiCITY Backend
 * Handles all HTTP requests to the Express.js API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  /**
   * Load auth token from localStorage
   */
  private loadToken() {
    this.token = localStorage.getItem('supabase_token');
  }

  /**
   * Set auth token
   */
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('supabase_token', token);
    } else {
      localStorage.removeItem('supabase_token');
    }
  }

  /**
   * Make HTTP request
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error: any) {
      console.error(`API Error (${endpoint}):`, error);
      return {
        error: error.message || 'Network error',
      };
    }
  }

  // ============================================================================
  // NETWORK ENDPOINTS
  // ============================================================================

  /**
   * Get all public networks
   */
  async getNetworks(params?: {
    page?: number;
    limit?: number;
    sort?: 'recent' | 'popular' | 'liked';
    tags?: string[];
    q?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.sort) queryParams.set('sort', params.sort);
    if (params?.tags) queryParams.set('tags', params.tags.join(','));
    if (params?.q) queryParams.set('q', params.q);

    const query = queryParams.toString();
    return this.request(`/networks${query ? `?${query}` : ''}`);
  }

  /**
   * Get single network
   */
  async getNetwork(id: string) {
    return this.request(`/networks/${id}`);
  }

  /**
   * Get current user's networks
   */
  async getMyNetworks() {
    return this.request('/networks/me/networks');
  }

  /**
   * Create new network
   */
  async createNetwork(data: {
    name: string;
    description?: string;
    vocabulary: string[];
    weights: number[][];
    learning_rate: number;
    learning_rule: string;
    is_public?: boolean;
    allow_derivatives?: boolean;
    tags?: string[];
  }) {
    return this.request('/networks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update network
   */
  async updateNetwork(id: string, data: Partial<any>) {
    return this.request(`/networks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete network
   */
  async deleteNetwork(id: string) {
    return this.request(`/networks/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Like a network
   */
  async likeNetwork(id: string) {
    return this.request(`/networks/${id}/like`, {
      method: 'POST',
    });
  }

  /**
   * Unlike a network
   */
  async unlikeNetwork(id: string) {
    return this.request(`/networks/${id}/like`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // USER ENDPOINTS
  // ============================================================================

  /**
   * Get user profile
   */
  async getProfile(id: string) {
    return this.request(`/users/${id}`);
  }

  /**
   * Get current user's profile
   */
  async getMyProfile() {
    return this.request('/users/me/profile');
  }

  /**
   * Update current user's profile
   */
  async updateProfile(data: {
    username?: string;
    display_name?: string;
    bio?: string;
    avatar_url?: string;
  }) {
    return this.request('/users/me/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get user achievements
   */
  async getUserAchievements(userId: string) {
    return this.request(`/users/${userId}/achievements`);
  }

  /**
   * Get current user's activity log
   */
  async getMyActivity(limit = 50) {
    return this.request(`/users/me/activity?limit=${limit}`);
  }

  /**
   * Update user stats (XP, level)
   */
  async updateStats(data: { xp_gained: number; action: string }) {
    return this.request('/users/me/stats', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(params?: { timeframe?: string; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.timeframe) queryParams.set('timeframe', params.timeframe);
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    const query = queryParams.toString();
    return this.request(`/users/leaderboard${query ? `?${query}` : ''}`);
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);

// Export types
export type { ApiResponse };
