import axios from 'axios';

const API = axios.create({ baseURL: '/api' });
const USER_API = axios.create({ baseURL: '/api' });
const AUTH_API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

USER_API.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

USER_API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('user_token');
      localStorage.removeItem('app_user');
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/admin')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(err);
  }
);

export const login = (email, password) => AUTH_API.post('/auth/login', { email, password });
export const verifyToken = () => API.get('/auth/verify');

export const userLogin = (email, password) => AUTH_API.post('/auth/user/login', { email, password });
export const verifyUserToken = () => USER_API.get('/auth/user/verify');

// Staff API
export const getStaffProfile = () => USER_API.get('/staff/profile');
export const updateStaffProfile = (data) => USER_API.put('/staff/profile', data);
export const clockIn = () => USER_API.post('/staff/time-logs', { action: 'in' });
export const clockOut = () => USER_API.post('/staff/time-logs', { action: 'out' });
export const getTodayTimeLogs = () => USER_API.get('/staff/time-logs/today');
export const getStaffTasks = () => USER_API.get('/staff/tasks');
export const updateTaskStatus = (id, status) => USER_API.put(`/staff/tasks/${id}/status`, { status });
export const getStaffReminders = () => USER_API.get('/staff/reminders');
export const createStaffReminder = (data) => USER_API.post('/staff/reminders', data);
export const deleteStaffReminder = (id) => USER_API.delete(`/staff/reminders/${id}`);
export const getStaffNotes = () => USER_API.get('/staff/notes');
export const createStaffNote = (content) => USER_API.post('/staff/notes', { content });
export const deleteStaffNote = (id) => USER_API.delete(`/staff/notes/${id}`);
export const getStaffClients = () => USER_API.get('/staff/clients');
export const addStaffClient = (clientId, notes) => USER_API.post('/staff/clients', { client_id: clientId, notes });
export const searchClients = (q) => USER_API.get('/staff/clients/search', { params: { q } });
export const deleteStaffClient = (id) => USER_API.delete(`/staff/clients/${id}`);
export const getClientFavorites = (clientId) => USER_API.get(`/staff/clients/${clientId}/favorites`);
export const getStaffSchedule = () => USER_API.get('/staff/schedule');

// Client API
export const getClientPromotions = () => USER_API.get('/client/promotions');
export const getClientEventBanners = () => USER_API.get('/client/event-banners');
export const getMyFavorites = () => USER_API.get('/client/favorites');
export const getClientProfile = () => USER_API.get('/client/profile');
export const updateClientAvatar = (file) => {
  const form = new FormData();
  form.append('avatar', file);
  return USER_API.put('/client/profile/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const updateClientName = (name) => USER_API.put('/client/profile/name', { name });
export const getAutoFavorites = () => USER_API.get('/client/favorites/auto');
export const getPinnedFavorites = () => USER_API.get('/client/favorites/pinned');
export const pinFavorite = (menu_item_id) => USER_API.post('/client/favorites/pinned', { menu_item_id });
export const unpinFavorite = (id) => USER_API.delete(`/client/favorites/pinned/${id}`);

// Admin Staff API
export const getAdminStaffList = () => USER_API.get('/admin/staff');
export const createAdminStaff = (data) => USER_API.post('/admin/staff', data);
export const deleteAdminStaff = (id) => USER_API.delete(`/admin/staff/${id}`);
export const getAdminTasks = () => USER_API.get('/admin/tasks');
export const assignAdminTask = (data) => USER_API.post('/admin/tasks', data);
export const deleteAdminTask = (id) => USER_API.delete(`/admin/tasks/${id}`);
export const assignAdminReminder = (data) => USER_API.post('/admin/reminders', data);
export const getAdminScheduleEvents = () => USER_API.get('/admin/schedule-events');
export const createAdminScheduleEvent = (data) => USER_API.post('/admin/schedule-events', data);
export const deleteAdminScheduleEvent = (id) => USER_API.delete(`/admin/schedule-events/${id}`);
export const getAdminTimeLogs = () => USER_API.get('/admin/time-logs');
export const getAdminClients = () => USER_API.get('/admin/clients');
export const getAdminClientFavorites = (id) => USER_API.get(`/admin/clients/${id}/favorites`);

export const getMenuItems = () => API.get('/menu');
export const getAllMenuItems = () => API.get('/menu/all');
export const getFeaturedItems = () => API.get('/menu/featured');
export const createMenuItem = (data) => API.post('/menu', data);
export const updateMenuItem = (id, data) => API.put(`/menu/${id}`, data);
export const deleteMenuItem = (id) => API.delete(`/menu/${id}`);

export const getEvents = () => API.get('/events');
export const getUpcomingEvents = () => API.get('/events/upcoming');
export const createEvent = (data) => API.post('/events', data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// Stats API
export const getStatsOverview = () => USER_API.get('/stats/overview');
export const getStatsMenu = () => USER_API.get('/stats/menu');
export const getStatsStaff = () => USER_API.get('/stats/staff');
export const getStatsClients = () => USER_API.get('/stats/clients');
export const getStatsEvents = () => USER_API.get('/stats/events');

// Sales API
export const getSales = (params) => USER_API.get('/sales', { params });
export const getSalesSummary = (period) => USER_API.get('/sales/summary', { params: { period } });
export const createSale = (data) => USER_API.post('/sales', data);
export const deleteSale = (id) => USER_API.delete(`/sales/${id}`);

export const getLandingSettings = () => API.get('/settings/landing');
export const updateLandingSettings = (data) => API.put('/settings/landing', data);

export const uploadImage = (file) => {
  const form = new FormData();
  form.append('image', file);
  return API.post('/upload', form);
};
export const getUploadedImages = () => API.get('/upload');

// Admin Reminders API
export const getAdminReminders = () => API.get('/auth/reminders');
export const createAdminReminder = (data) => API.post('/auth/reminders', data);
export const markReminderDone = (id) => API.put(`/auth/reminders/${id}/done`);
export const deleteAdminReminder = (id) => API.delete(`/auth/reminders/${id}`);

export default API;
