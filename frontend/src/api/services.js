// src/api/services.js
// All API call functions in one place

import API from './axios';

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Alerts
export const triggerSOS = (locationData) => API.post('/alerts/sos', locationData);
export const getMyAlerts = () => API.get('/alerts/my-alerts');
export const getNearbyAlerts = () => API.get('/alerts/nearby');
export const acceptAlert = (id) => API.patch(`/alerts/${id}/accept`);
export const resolveAlert = (id) => API.patch(`/alerts/${id}/resolve`);
export const cancelAlert = (id) => API.patch(`/alerts/${id}/cancel`);

// Users
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (data) => API.put('/users/profile', data);
export const addContact = (data) => API.post('/users/emergency-contacts', data);
export const removeContact = (id) => API.delete(`/users/emergency-contacts/${id}`);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAllUsers = () => API.get('/admin/users');
export const getAllVolunteers = () => API.get('/admin/volunteers');
export const verifyVolunteer = (id) => API.patch(`/admin/volunteers/${id}/verify`);
export const getAllAlerts = () => API.get('/admin/alerts');