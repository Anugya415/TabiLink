const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    // Build URL with query parameters
    let url = `${this.baseURL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    // Get auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      // Handle network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('Network error: Could not connect to API server. Make sure the backend is running on http://localhost:5000');
        throw new Error('Cannot connect to server. Please make sure the backend server is running.');
      }
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async register(data: { name: string; email: string; password: string; phone?: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(data: { name?: string; phone?: string; preferences?: any }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Hotels
  async getHotels(params?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    city?: string;
    country?: string;
    isPopular?: boolean;
    featured?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
  }) {
    return this.request('/hotels', { params });
  }

  async getHotel(id: string) {
    return this.request(`/hotels/${id}`);
  }

  // Travel Packages
  async getPackages(params?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    destination?: string;
    isPopular?: boolean;
    featured?: boolean;
    page?: number;
    limit?: number;
    sort?: string;
  }) {
    return this.request('/packages', { params });
  }

  async getPackage(id: string) {
    return this.request(`/packages/${id}`);
  }

  // Bookings
  async getBookings(params?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    return this.request('/bookings', { params });
  }

  async getBooking(id: string) {
    return this.request(`/bookings/${id}`);
  }

  async createBooking(data: {
    type: 'hotel' | 'travel';
    hotel?: string;
    travelPackage?: string;
    checkIn?: string;
    checkOut?: string;
    travelers: number;
    guests?: Array<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    }>;
  }) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelBooking(id: string, reason?: string) {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ cancellationReason: reason }),
    });
  }

  // Contact
  async submitContact(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;

