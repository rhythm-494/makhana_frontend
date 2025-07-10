// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = 'https://makhana-nodebackend.onrender.com/api';

const authAPI = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for session cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authService = {
    signup: async (userData) => {
        try {
            const response = await authAPI.post('/auth/signup', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { status: 0, message: 'Network error' };
        }
    },

    login: async (credentials) => {
        try {
            const response = await authAPI.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || { status: 0, message: 'Network error' };
        }
    },

    logout: async () => {
        try {
            const response = await authAPI.post('/auth/logout');
            return response.data;
        } catch (error) {
            throw error.response?.data || { status: 0, message: 'Network error' };
        }
    },

    checkSession: async () => {
        try {
            const response = await authAPI.get('/auth/check_session');
            return response.data;
        } catch (error) {
            throw error.response?.data || { status: 0, message: 'Network error' };
        }
    },

    updateProfile: async (profileData) => {
        try {
            const response = await authAPI.put('/auth/update_profile', profileData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { status: 0, message: 'Network error' };
        }
    },

    seeProfileData: async (userId) => {
        try {
            const response = await authAPI.get('/auth/seeProfileData', {
                params: { user_id: userId }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { status: 0, message: 'Network error' };
        }
    }
};

export default authService;
