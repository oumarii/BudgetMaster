import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transactionService = {
  getAll: (userId) => api.get(`/transactions/user/${userId}`),
  getByType: (userId, type) => api.get(`/transactions/user/${userId}/type/${type}`),
  getByDateRange: (userId, startDate, endDate) => 
    api.get(`/transactions/user/${userId}/date-range?startDate=${startDate}&endDate=${endDate}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

export const budgetService = {
  getAll: (userId) => api.get(`/budgets/user/${userId}`),
  getByCategory: (userId, category) => api.get(`/budgets/user/${userId}/category/${category}`),
  create: (data) => api.post('/budgets', data),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
};

export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (name) => api.post('/categories', name),
  delete: (id) => api.delete(`/categories/${id}`),
};
