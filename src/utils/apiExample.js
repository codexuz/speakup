// Example of how to use the API utilities in Vue components

import { defineComponent, ref, onMounted } from 'vue';
import endpoints, { apiLoading, apiError } from '../utils/apiEndpoints';

export default defineComponent({
  setup() {
    const user = ref(null);
    const topics = ref([]);

    // Example method for login
    const login = async (otpCode) => {
      try {
        const response = await endpoints.auth.login({ otp_code: otpCode });
        // Store token or user data
        localStorage.setItem('auth_token', response.access_token);
        return response;
      } catch (error) {
        console.error('Login failed:', error);
        // Handle error
      }
    };

    // Example method for fetching data
    const fetchSpeakingTopics = async () => {
      try {
        topics.value = await endpoints.speaking.getTopics();
      } catch (error) {
        console.error('Failed to fetch topics:', error);
        // Error is already tracked in apiError
      }
    };

    // Example for uploading files
    const uploadRecording = async (audioFile, metadata) => {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('metadata', JSON.stringify(metadata));
      
      try {
        const response = await endpoints.speaking.saveRecording(formData);
        return response;
      } catch (error) {
        console.error('Upload failed:', error);
        // Handle error
      }
    };

    onMounted(() => {
      // Fetch data when component mounts
      fetchSpeakingTopics();
    });

    return {
      user,
      topics,
      login,
      fetchSpeakingTopics,
      uploadRecording,
      // Expose loading and error states from the API
      loading: apiLoading,
      error: apiError
    };
  }
});
