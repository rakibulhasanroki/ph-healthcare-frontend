import { ApiResponse } from "@/types/api.types";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined");
}

const axiosInstance = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });
  return instance;
};

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const httpGet = async <T>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<T>> => {
  try {
    const instance = axiosInstance();
    const response = await instance.get<ApiResponse<T>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`GET request failed: ${endpoint}`, error);
    throw error;
  }
};

const httpPost = async <T>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<T>> => {
  try {
    const instance = axiosInstance();
    const response = await instance.post<ApiResponse<T>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`POST request failed: ${endpoint}`, error);
    throw error;
  }
};

const httpPut = async <T>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<T>> => {
  try {
    const instance = axiosInstance();
    const response = await instance.put<ApiResponse<T>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`PUT request failed: ${endpoint}`, error);
    throw error;
  }
};

const httpPatch = async <T>(
  endpoint: string,
  data: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<T>> => {
  try {
    const instance = axiosInstance();
    const response = await instance.patch<ApiResponse<T>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`PATCH request failed: ${endpoint}`, error);
    throw error;
  }
};
const httpDelete = async <T>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<T>> => {
  try {
    const instance = axiosInstance();
    const response = await instance.delete<ApiResponse<T>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`DELETE request failed: ${endpoint}`, error);
    throw error;
  }
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};
