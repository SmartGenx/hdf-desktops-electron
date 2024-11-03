import axios, { AxiosRequestConfig } from 'axios'
// import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
// import { redirect } from 'react-router-dom';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5050/api'
})

type Config = AxiosRequestConfig<unknown> | undefined



export function getApi<T>(url: string, config?: Config) {

  return axiosInstance.get<T>(url, config)
}

export function putApi<T>(url: string, data: unknown, config?: Config) {
  return axiosInstance.put<T>(url, data, config)
}

export function postApi<T>(url: string, data: unknown, config?: Config) {
  
  return axiosInstance.post<T>(url, data, config)
}

export function patchApi<T>(url: string, data: unknown, config?: Config) {
  return axiosInstance.patch<T>(url, data, config)
}

export function deleteApi<T>(url: string, config?: Config) {
  return axiosInstance.delete<T>(url, config)
}
