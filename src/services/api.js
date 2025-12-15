import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Users API endpoints
export const usersApi = {
  // Fetch all users
  getUsers: () => api.get('/users'),
  
  // Create a new user (mock API)
  createUser: (userData) => api.post('/users', userData),
  
  // Update a user (mock API)
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Delete a user (mock API)
  deleteUser: (id) => api.delete(`/users/${id}`),
};