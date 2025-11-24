import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data)
};

export const professionalAPI = {
    search: (filters) => api.get('/professionals/search', { params: filters }),
    getById: (id) => api.get(`/professionals/${id}`),
    updateProfile: (data) => api.put('/professionals/profile', data)
};


export const categoryAPI = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`)
};


export const reviewAPI = {
    create: (data) => api.post('/reviews', data),
    getByProfessional: (id) => api.get(`/reviews/professional/${id}`)
};


export const contactAPI = {
    register: (data) => api.post('/contacts', data),
    getStats: () => api.get('/contacts/stats')
};


export const serviceAPI = {
    create: (data) => api.post('/services', data),
    getMyServices: () => api.get('/services/my-services'),
    update: (id, data) => api.put(`/services/${id}`, data),
    delete: (id) => api.delete(`/services/${id}`),
    getByCategory: (id) => api.get(`/services/category/${id}`),
    getByProfessional: (userId) => api.get(`/services/professional/${userId}`)
};


export const locationAPI = {
    getAll: () => api.get('/locations')
};


export const bookingAPI = {
    getMyBookings: () => api.get('/bookings/my-bookings'),
    create: (data) => api.post('/bookings', data),
    getProfessionalRequests: () => api.get('/bookings/professional-requests'),
    updateStatus: (id, estado) => api.put(`/bookings/${id}/status`, { estado })
};

export default api;