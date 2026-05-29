import API from './api';

export const authService = {
    // 1. Submit structural credentials to create a profile table row
    register: async (username, email, password, role) => {
        const response = await API.post('/register', { username, email, password, role });
        return response.data;
    },

    // 2. Authenticate credentials and return system access keys
    login: async (email, password) => {
        const response = await API.post('/login', { email, password });
        return response.data;
    },

    // 3. Clear authorization records out of browser persistence memories
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // 4. Delete the logged-in user profile permanently
    deleteAccount: async () => {
        const response = await API.delete('/student/delete-account');
        return response.data;
    },

    // 5. Update user profile configurations
    updateProfile: async (profileData) => {
        const response = await API.put('/user/profile', profileData);
        return response.data; // Structure outcome: { message, user }
    },

    // 6. Request a password reset message
    requestResetLink: async (email) => {
        const response = await API.post('/forgot-password', { email });
        return response.data;
    },

    // 7. Complete the password adjustment sequence
    submitNewPassword: async (token, password) => {
        const response = await API.post('/reset-password', { token, password });
        return response.data;
    }



};
