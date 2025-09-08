import api, { useApi } from "./api";
// Initialize the API composable
const { get, post, patch, delete: del, loading, error, postFormData } = useApi();

// Define API endpoints as functions
export const endpoints = {
  // Auth endpoints
  auth: {
    login: (credentials) =>
      post("/users/login", { otp_code: credentials.otp_code }),
    logout: () => post("/users/logout"),
  },

  // User endpoints
  users: {
    getProfile: (userId) => get(`/users/${userId}`),
    updateProfile: (userId, data) => patch(`/users/${userId}`, data),
  },

  // Example endpoints for your app features
  // Add more endpoints based on your app's needs
  speaking: {
    getAll: () => get("/speaking-tests/active/true"),
    getById: (testId) => get(`/speaking-tests/${testId}`),
    getPurchasedTests: () => get("/my-purchased-tests/user"),
    getPart1: () => get(`/speaking-parts/part-type/1.1`),
    getPart2: () => get(`/speaking-parts/part-type/1.2`),
    getPart3: () => get(`/speaking-parts/part-type/2`),
    getPart4: () => get(`/speaking-parts/part-type/3`),
    getPartById: (id) => get(`/speaking-parts/${id}`),
    saveRecording: (file) => postFormData("/upload", file),
    uploadResponse: (data) => post("/speaking-response", data),
  },

  // Add your custom endpoints here...
};

// Export loading and error states from the API composable
export { loading as apiLoading, error as apiError };

// Export the raw API instance if direct access is needed
export { api };

// Default export for the endpoints
export default endpoints;
