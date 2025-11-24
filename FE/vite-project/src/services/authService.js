import { authAPI } from './api';

class AuthService {

    async login(credentials) {
        try {
            const response = await authAPI.login(credentials);
            
            if (response.success && response.data.token) {
                this.setSession(response.data.token, response.data.user);
                return response.data;
            }
            
            //Si la respuesta indica fallo, pero no es un error HTTP, lanzar un error para ser capturado por el componente
            throw new Error(response.message || 'Error en el inicio de sesión');
        } catch (error) {
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await authAPI.register(userData);
            
            if (response.success && response.data.token) {
                this.setSession(response.data.token, response.data.user);
                return response.data;
            }
            
            throw new Error(response.message || 'Error en el registro');
        } catch (error) {
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }


    setSession(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {

                return JSON.parse(userStr);
            } catch (e) {
                
                console.error("Error al parsear el usuario de localStorage:", e);
                this.logout();
                return null;
            }
        }
        return null;
    }


    getToken() {
        return localStorage.getItem('token');
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    hasRole(roleId) {
        const user = this.getCurrentUser();
        return user && user.rol_id === roleId;
    }


    async getProfile() {
        try {
            const response = await authAPI.getProfile();
            if (response.success) {
                const user = this.getCurrentUser();
                const updatedUser = { ...user, ...response.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return updatedUser;
            }
        } catch (error) {
            throw error;
        }
    }

    async updateProfile(data) {
        try {
            const response = await authAPI.updateProfile(data);
            if (response.success) {
                await this.getProfile(); 
                return response.data;
            }
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthService();