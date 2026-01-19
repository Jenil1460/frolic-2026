import axios from 'axios';
import { getAuthToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle success and error responses
api.interceptors.response.use(
  (response) => {
    // Return server wrapper: { success, data, message }
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Preserve the HTTP response on the thrown Error so callers can inspect it
    const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
    const err = new Error(errorMessage);
    err.response = error.response;
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  getMyRegistrations: () => api.get('/auth/registrations')
};

export const eventAPI = {
  getEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  registerForEvent: (eventId) => api.post(`/events/${eventId}/register`),
  checkRegistrationStatus: (eventId) => api.get(`/events/${eventId}/registration-status`),
  getMyEvents: () => api.get('/events/my-events'),
};

export const paymentAPI = {
  demoUPI: (data) => api.post('/payments/demo-upi', data),
};

export const adminAPI = {
    getDashboardStats: () => api.get('/dashboard/stats'),

    // User Management
    fetchAdminUsers: (params) => api.get('/admin/users', { params }),
    updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
    updateUserStatus: (id, isActive) => api.patch(`/admin/users/${id}/status`, { isActive }),
    updateUserVerification: (id, isVerified) => api.patch(`/admin/users/${id}/verify`, { isVerified }),
    deleteUserByAdmin: (id) => api.delete(`/admin/users/${id}`),
    exportAdminUsers: (params) => api.get('/admin/users/export', { params, responseType: 'blob' }),

    // Coordinator Management
    getCoordinators: () => api.get('/admin/coordinators'),
    assignCoordinator: (id, data) => api.patch(`/admin/coordinators/${id}/assign`, data),

    // Activity logs
    getActivityLogs: (params) => api.get('/admin/activity-logs', { params }),

    getInstitutes: () => api.get('/institutes'),
    createInstitute: (data) => api.post('/institutes', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    updateInstitute: (id, data) => api.put(`/institutes/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteInstitute: (id) => api.delete(`/institutes/${id}`),
    getDepartments: () => api.get('/departments'),
    createDepartment: (data) => api.post('/departments', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    updateDepartment: (id, data) => api.put(`/departments/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteDepartment: (id) => api.delete(`/departments/${id}`),
    getEvents: () => api.get('/events'),
    getEventById: (id) => api.get(`/events/${id}`),
    createEvent: (data) => api.post('/events', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    updateEvent: (id, data) => api.put(`/events/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteEvent: (id) => api.delete(`/events/${id}`),
    getGroupsByEvent: (eventId) => api.get(`/groups/event/${eventId}`),
    updateGroup: (id, data) => api.put(`/groups/${id}`, data),
    deleteGroup: (id) => api.delete(`/groups/${id}`),
    getWinnersByEvent: (eventId) => api.get(`/winners/event/${eventId}`),
    declareWinners: (data) => api.post('/winners', data),
    updateWinners: (id, data) => api.put(`/winners/${id}`, data),
    getEventReport: (eventId) => api.get(`/reports/event/${eventId}`),
    getInstituteReport: (instituteId) => api.get(`/reports/institute/${instituteId}`),
    getDepartmentReport: (departmentId) => api.get(`/reports/department/${departmentId}`),
    getWinnerReport: () => api.get('/reports/winners'),

    // Gallery Management
    getGalleries: () => api.get('/gallery'),
    getFeaturedGalleries: () => api.get('/gallery/featured'),
    getGalleryById: (id) => api.get(`/gallery/${id}`),
    getGalleriesByCategory: (category) => api.get(`/gallery/category/${category}`),
    createGallery: (data) => api.post('/gallery', data),
    updateGallery: (id, data) => api.put(`/gallery/${id}`, data),
    addImagesToGallery: (id, images) => api.post(`/gallery/${id}/images`, { images }),
    uploadImagesToGallery: (id, formData) => api.post(`/gallery/${id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    removeImageFromGallery: (id, imageIndex) => api.delete(`/gallery/${id}/images/${imageIndex}`),
    deleteGallery: (id) => api.delete(`/gallery/${id}`),
};

export default api;