import { auth } from "@/auth";
import { ApiService } from "@/app/services/api/types";

const initApiService = async (): Promise<ApiService> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const session = await auth();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: '*/*',
    Authorization: `Bearer ${session?.user.data.accessToken || ''}`
  };

  const handleFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
    try {
      const response = await fetch(url, options);
      return response.json();
    } catch (error) {
      console.error('Error in fetch method:', error);
      throw error;
    }
  };

  return {
    list: async <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${baseUrl}/${endpoint}?${queryParams}`;
      return handleFetch<T>(url, { headers });
    },
    show: async <T>(endpoint: string, id: string | number): Promise<T> => {
      return handleFetch<T>(`${baseUrl}/${endpoint}/${id}`, { headers });
    },
    create: async <T>(endpoint: string, data: any): Promise<T> => {
      return handleFetch<T>(`${baseUrl}/${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
    },
    update: async <T>(endpoint: string, id: string | number, data: any): Promise<T> => {
      return handleFetch<T>(`${baseUrl}/${endpoint}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
    },
    destroy: async <T>(endpoint: string, id: string | number): Promise<T> => {
      return handleFetch<T>(`${baseUrl}/${endpoint}/${id}`, {
        method: 'DELETE',
        headers,
      });
    }
  };
};

export default initApiService;
