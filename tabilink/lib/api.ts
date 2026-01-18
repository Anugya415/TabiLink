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
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (!response.ok) {
          const text = await response.text().catch(() => '');
          throw new Error(`HTTP error! status: ${response.status}${text ? ` - ${text}` : ''}`);
        }
        return {} as T;
      }

      let data;
      try {
        const responseText = await response.text();
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        // If JSON parsing fails, create a meaningful error
        const errorMessage = `Invalid JSON response from server (status: ${response.status})`;
        if (response.status >= 500) {
          console.error('Server error - JSON parse failed:', {
            status: response.status,
            url: url,
            parseError: parseError instanceof Error ? parseError.message : String(parseError),
          });
        }
        throw new Error(errorMessage);
      }

      if (!response.ok) {
        // Extract error message from response
        const errorMessage = data?.message || data?.error || `HTTP error! status: ${response.status}`;
        const error = new Error(errorMessage);
        // Attach response data to error for debugging
        (error as any).response = data;
        (error as any).status = response.status;
        // Don't log expected client errors (4xx) as errors, only server errors (5xx)
        // 503 is Service Unavailable (configuration issues), log but don't treat as critical error
        if (response.status >= 500 && response.status !== 503) {
          // Build log data with guaranteed non-empty values
          const statusCode = response.status ?? 500;
          const msg = errorMessage || 'Server error occurred';
          const requestUrl = url || 'Unknown URL';

          // Log with explicit properties to avoid empty object issues
          console.error(`Server error (${statusCode}):`, msg);
          console.error('Request URL:', requestUrl);
          if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            console.error('Response data:', data);
          } else if (data && typeof data !== 'object') {
            console.error('Response data:', data);
          }
        } else if (response.status === 503) {
          // 503 Service Unavailable - log as info, not error (configuration issues)
          console.warn(`Service unavailable (503):`, errorMessage);
        }
        throw error;
      }

      return data;
    } catch (error: any) {
      // Handle network errors
      if (error instanceof TypeError && (error.message === 'Failed to fetch' || error.message.includes('fetch'))) {
        const errorMessage = `Cannot connect to backend server at ${this.baseURL}. Please make sure:
1. The backend server is running on http://localhost:5000
2. The server is accessible and not blocked by firewall
3. Check the browser console for more details`;
        console.error('Network error:', errorMessage);
        console.error('Attempted URL:', url);
        console.error('Error details:', error);
        throw new Error(errorMessage);
      }
      // Handle abort/timeout errors
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        console.error('Request timeout:', url);
        throw new Error('Request timeout. The server is taking too long to respond.');
      }
      // Only log unexpected errors (not 4xx client errors which are expected)
      // Check if error has a status code (from response)
      const errorStatus = (error as any).status;
      if (!errorStatus || errorStatus >= 500) {
        // Log server errors or unexpected errors
        console.error('API request failed:', {
          message: error.message || 'Unknown error',
          name: error.name || 'Error',
          status: errorStatus || 'N/A',
          url: url,
          error: error.toString(),
        });
      }

      // If error has a message, throw it; otherwise wrap it
      if (error.message) {
        throw error;
      }
      throw new Error(`API request failed: ${error.toString() || 'Unknown error'}`);
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

  async googleLogin(idToken: string) {
    return this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(data: { token: string; email: string; password: string }) {
    return this.request('/auth/reset-password', {
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

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.request('/auth/change-password', {
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

  async createHotel(data: any) {
    return this.request('/hotels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateHotel(id: string | number, data: any) {
    return this.request(`/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteHotel(id: string | number) {
    return this.request(`/hotels/${id}`, {
      method: 'DELETE',
    });
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

  async createPackage(data: any) {
    return this.request('/packages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePackage(id: string | number, data: any) {
    return this.request(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePackage(id: string | number) {
    return this.request(`/packages/${id}`, {
      method: 'DELETE',
    });
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
    discountCode?: string;
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

  async modifyBooking(id: string, data: {
    checkIn?: string;
    checkOut?: string;
    travelers?: number;
    hotelRoomType?: string;
    travelPackageTier?: string;
    guests?: Array<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    }>;
  }) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
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

  // User Management (Admin/Super Admin)
  async getUsers(params?: {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return this.request('/auth/users', { params });
  }

  async createUser(data: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    role?: 'user' | 'admin' | 'super_admin';
    membershipTier?: 'Silver' | 'Gold' | 'Platinum';
  }) {
    return this.request('/auth/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string | number, data: {
    name?: string;
    email?: string;
    phone?: string;
    role?: 'user' | 'admin' | 'super_admin';
    isActive?: boolean;
    membershipTier?: 'Silver' | 'Gold' | 'Platinum';
    password?: string;
  }) {
    return this.request(`/auth/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string | number) {
    return this.request(`/auth/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Discounts
  async getDiscounts(params?: {
    active?: boolean;
    applicableTo?: 'all' | 'hotel' | 'travel';
  }) {
    return this.request('/discounts', { params });
  }

  async getDiscount(id: string | number) {
    return this.request(`/discounts/${id}`);
  }

  async validateDiscountCode(data: {
    code: string;
    subtotal: number;
    type: 'hotel' | 'travel';
    hotelId?: string | number;
    travelPackageId?: string | number;
  }) {
    return this.request('/discounts/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createDiscount(data: {
    code: string;
    name: string;
    description?: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
    applicableTo?: 'all' | 'hotel' | 'travel';
    applicableHotelIds?: number[];
    applicableTravelPackageIds?: number[];
    startDate: string;
    endDate: string;
    usageLimit?: number;
    userUsageLimit?: number;
    isActive?: boolean;
  }) {
    return this.request('/discounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDiscount(id: string | number, data: {
    code?: string;
    name?: string;
    description?: string;
    discountType?: 'percentage' | 'fixed';
    discountValue?: number;
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
    applicableTo?: 'all' | 'hotel' | 'travel';
    applicableHotelIds?: number[];
    applicableTravelPackageIds?: number[];
    startDate?: string;
    endDate?: string;
    usageLimit?: number;
    userUsageLimit?: number;
    isActive?: boolean;
  }) {
    return this.request(`/discounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDiscount(id: string | number) {
    return this.request(`/discounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Rewards & Redemptions
  async getRewards(params?: {
    category?: 'discount' | 'cashback' | 'voucher' | 'upgrade' | 'freebie';
    minPoints?: number;
    maxPoints?: number;
  }) {
    return this.request('/rewards', { params });
  }

  async getReward(id: string | number) {
    return this.request(`/rewards/${id}`);
  }

  async getUserRedemptions(params?: {
    status?: 'pending' | 'completed' | 'cancelled' | 'expired';
  }) {
    return this.request('/rewards/redemptions', { params });
  }

  async redeemReward(id: string | number) {
    return this.request(`/rewards/${id}/redeem`, {
      method: 'POST',
    });
  }

  async getConversionRate() {
    return this.request('/rewards/conversion-rate');
  }

  async calculatePointsValue(points: number) {
    return this.request('/rewards/calculate-value', {
      method: 'POST',
      body: JSON.stringify({ points }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;

