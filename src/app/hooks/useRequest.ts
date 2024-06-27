'use client';
import { AxiosPromise, AxiosRequestConfig } from "axios";
import { useBaseRequest } from "@/app/hooks/useBaseRequest";

export default function useRequest() {
  const { instance } = useBaseRequest();

  const list = <T>(path: string, config?: AxiosRequestConfig): AxiosPromise<T> => {
    return instance.get(`${path}`, { ...config })
  }

  const show = <T>(path: string, id: string, config?: AxiosRequestConfig): AxiosPromise<T> => {
    return instance.get(`${path}/${id}`, { ...config })
  }

  const create = <T>(path: string, payload: T, id?: string, config?: AxiosRequestConfig): AxiosPromise => {
    return instance.post(`${path}${id ? `/${id}` : String()}`, payload, { ...config })
  }

  const update = <T>(path: string, id: string, payload: T, config?: AxiosRequestConfig): AxiosPromise => {
    return instance.put(`${path}/${id}`, payload, { ...config })
  }

  const destroy = (path: string, id: string, config?: AxiosRequestConfig): AxiosPromise => {
    return instance.delete(`${path}/${id}`, { ...config })
  }

  return {
    list,
    create,
    update,
    show,
    destroy
  };
}
