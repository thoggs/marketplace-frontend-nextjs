'use client';
import axios, { AxiosInstance } from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function useBaseRequest() {
  const session = useSession();

  const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        Authorization: `Bearer ${session?.data?.user?.data.accessToken}`,
      }
    })
    instance.interceptors.response.use(async response => {
      try {
        return response
      } catch (error) {
        console.error(error)
        return Promise.reject(error)
      }
    })
    return instance;
  }

  return {
    instance: createAxiosInstance(),
  }
}
