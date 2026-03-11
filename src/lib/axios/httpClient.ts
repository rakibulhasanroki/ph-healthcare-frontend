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

const httpGet = async (endpoint: string, options?: ApiRequestOptions) => {
  try {
    const response = await axiosInstance().get(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`GET request failed: ${endpoint}`, error);
    throw error;
  }
};

const httpPost = async (endpoint: string, options?: ApiRequestOptions) => {
  try {
    const response = await axiosInstance().post(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`POST request failed: ${endpoint}`, error);
    throw error;
  }
};

const httpPut = async (endpoint: string, options?: ApiRequestOptions) => {
  try {
    const response = await axiosInstance().put(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`PUT request failed: ${endpoint}`, error);
    throw error;
  }
};

const httpPatch = async (endpoint: string, options?: ApiRequestOptions) => {
  try {
    const response = await axiosInstance().patch(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`PATCH request failed: ${endpoint}`, error);
    throw error;
  }
};
const httpDelete = async (endpoint: string, options?: ApiRequestOptions) => {
  try {
    const response = await axiosInstance().delete(endpoint, {
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
