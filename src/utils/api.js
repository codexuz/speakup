import axios from "axios";
import { ref } from "vue";
import { useUser } from "@/composables/useUser";
const { loadUser, authToken } = useUser();

// Load user data on initialization
loadUser();

// Create an instance of axios with default configuration
const api = axios.create({
  // Base URL for all API requests
  baseURL: "https://impulse-speaking.jkturn.easypanel.host",
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor for adding auth token, etc.
api.interceptors.request.use(
  (config) => {
    // Get token from authToken ref in useUser composable
    const token = authToken.value;

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData - remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses
api.interceptors.response.use(
  (response) => {
    // For edumoacademy.uz API, the response might have a data property
    // that contains the actual data we want to work with
    if (response.data && response.data.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    // Handle common errors (e.g., 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access by calling logout from useUser
      const { logout } = useUser();
      logout();
    }

    return Promise.reject(error);
  }
);

// Composable for handling API requests with loading and error states
export function useApi() {
  const loading = ref(false);
  const error = ref(null);

  // Generic request method
  const request = async (method, url, data = null, options = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api({
        method,
        url,
        ...(data && (method === "get" ? { params: data } : { data })),
        ...options,
      });

      return response.data;
    } catch (err) {
      error.value = err.response?.data || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Helper methods for common HTTP verbs
  const get = (url, params, options) => request("get", url, params, options);
  const post = (url, data, options) => request("post", url, data, options);
  const put = (url, data, options) => request("put", url, data, options);
  const patch = (url, data, options) => request("patch", url, data, options);
  const del = (url, options) => request("delete", url, null, options);

  // Helper method for file uploads with FormData
  const uploadFile = async (url, file, additionalData = {}, options = {}) => {
    const formData = new FormData();

    // Add file to FormData
    if (file instanceof File) {
      formData.append("file", file);
    } else if (file && file.uri) {
      // Handle Capacitor/Cordova file objects
      const response = await fetch(file.uri);
      const blob = await response.blob();
      formData.append("file", blob, file.name || "file");
    }

    // Add additional data to FormData
    Object.keys(additionalData).forEach((key) => {
      const value = additionalData[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    return request("post", url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...options,
    });
  };

  // Helper method for multiple file uploads
  const uploadFiles = async (url, files, additionalData = {}, options = {}) => {
    const formData = new FormData();

    // Add files to FormData
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file instanceof File) {
        formData.append("files[]", file);
      } else if (file && file.uri) {
        // Handle Capacitor/Cordova file objects
        const response = await fetch(file.uri);
        const blob = await response.blob();
        formData.append("files[]", blob, file.name || `file_${i}`);
      }
    }

    // Add additional data to FormData
    Object.keys(additionalData).forEach((key) => {
      const value = additionalData[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    return request("post", url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...options,
    });
  };

  // Helper method for sending FormData directly
  const postFormData = (url, formData, options) => {
    return request("post", url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...options,
    });
  };

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del, // renamed because delete is a reserved word
    uploadFile,
    uploadFiles,
    postFormData,
  };
}

// Export the axios instance for direct use
export default api;
