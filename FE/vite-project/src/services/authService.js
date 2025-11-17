import { authAPI } from './api';

class AuthService {
    //Login
    async login(credentials) {
        try {
            const response = await authAPI.login(credentials);
            
            if (response.success && response.data.token) {
                this.setSession(response.data.token, response.data.user);
                return response.data;
            }
            
            throw new Error('Error en el inicio de sesión');
        } catch (error) {
            throw error;
        }
    }

    //Register
    async register(userData) {
        try {
            const response = await authAPI.register(userData);
            
            if (response.success && response.data.token) {
                this.setSession(response.data.token, response.data.user);
                return response.data;
            }
            
            throw new Error('Error en el registro');
        } catch (error) {
            throw error;
        }
    }

    //Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    //Guardar sesión
    setSession(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }

    //Obtener usuario actual
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    //Obtener token
    getToken() {
        return localStorage.getItem('token');
    }

    //Verificar si está autenticado
    isAuthenticated() {
        return !!this.getToken();
    }

    //Verificar rol
    hasRole(roleId) {
        const user = this.getCurrentUser();
        return user && user.rol_id === roleId;
    }

    //Obtener perfil actualizado
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

    //Actualizar perfil
    async updateProfile(data) {
        try {
            const response = await authAPI.updateProfile(data);
            if (response.success) {
                await this.getProfile(); // Actualizar datos locales
                return response.data;
            }
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthService();