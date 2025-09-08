import { ref, reactive } from 'vue';
import { Preferences } from '@capacitor/preferences';

// Global user state (reactive)
const user = ref(null);
const isAuthenticated = ref(false);
const loading = ref(false);
const authToken = ref(null);

export function useUser() {
  // Load user data from Capacitor Preferences
  const loadUser = async () => {
    try {
      loading.value = true;
      
      const { value } = await Preferences.get({ key: 'user' });
      const { value: token } = await Preferences.get({ key: 'auth_token' });
      
      
      if (value) {
        const userData = JSON.parse(value);
        user.value = userData;
        isAuthenticated.value = true;
      } else {
        user.value = null;
        isAuthenticated.value = false;
      }
      
      if (token) {
        authToken.value = token;
      } else {
        authToken.value = null;
      }
      
      
    } catch (error) {
      console.error('Error loading user:', error);
      user.value = null;
      isAuthenticated.value = false;
      authToken.value = null;
    } finally {
      loading.value = false;
    }
  };

  // Save user data to Capacitor Preferences
  const saveUser = async (userData, token = null) => {
    try {
      
      if (!userData) {
        throw new Error('No user data provided to saveUser');
      }
      
      user.value = userData;
      isAuthenticated.value = true;
        await Preferences.set({ 
        key: 'user', 
        value: JSON.stringify(userData) 
      });
      
      if (token) {
        authToken.value = token;
        await Preferences.set({ 
          key: 'auth_token', 
          value: token 
        });
      }
      
    } catch (error) {
      console.error('Error saving user:', error);
      // Reset state on error
      user.value = null;
      isAuthenticated.value = false;
      authToken.value = null;
      throw error; // Re-throw so caller can handle
    }
  };

  // Update user profile data
  const updateUser = async (updates) => {
    if (user.value) {
      user.value = { ...user.value, ...updates };
      await saveUser(user.value, authToken.value);
    }
  };

  // Update user avatar
  const updateUserAvatar = async (avatarUrl) => {
    if (user.value) {
      user.value.avatar_url = avatarUrl;
      await saveUser(user.value, authToken.value);
    }
  };

  // Set user data (for login response)
  const setUser = async (loginResponse) => {
    
    // Extract user data and token from login response
    const userData = loginResponse.user || loginResponse;
    const token = loginResponse.access_token || loginResponse.token;
    
    
    // Validate that we have user data
    if (!userData || !userData.id) {
      console.error('Invalid user data received:', userData);
      throw new Error('Invalid user data received from server');
    }
    
    // Validate that we have a token
    if (!token) {
      console.error('No authentication token received');
      throw new Error('No authentication token received from server');
    }
    
    await saveUser(userData, token);
    
  };

  // Logout user
  const logout = async () => {
    try {
      user.value = null;
      isAuthenticated.value = false;
      authToken.value = null;
      
      await Preferences.remove({ key: 'user' });
      await Preferences.remove({ key: 'auth_token' });
      await Preferences.remove({ key: 'userAuth' });
      
      // Also remove from localStorage for backward compatibility
      localStorage.removeItem('auth');
      localStorage.removeItem('userId');
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    loading,
    authToken,
    
    // Actions
    loadUser,
    saveUser,
    updateUser,
    updateUserAvatar,
    setUser,
    logout
  };
}