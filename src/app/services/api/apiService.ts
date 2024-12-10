import { auth } from "@/auth";
import { ApiService } from "@/app/services/api/types";

const initApiService = async (): Promise<ApiService> => {
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
    list: async <T>(uri: string, params?: Record<string, any>): Promise<T> => {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${uri}?${queryParams}`;
      return handleFetch<T>(url, { headers });
    },

    show: async <T>(uri: string, id: string | number): Promise<T> => {
      return handleFetch<T>(`${uri}/${id}`, { headers });
    },

    create: async <T>(uri: string, data: any): Promise<T> => {
      return handleFetch<T>(uri, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
    },

    update: async <T>(uri: string, id: string | number, data: any): Promise<T> => {
      return handleFetch<T>(`${uri}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
    },

    destroy: async <T>(uri: string, id: string | number): Promise<T> => {
      return handleFetch<T>(`${uri}/${id}`, {
        method: 'DELETE',
        headers,
      });
    }
  };
};

export default initApiService;
