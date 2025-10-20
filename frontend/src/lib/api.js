import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api';

export const fetchProducts = async () => {
  const response = await axios.get(`${API_BASE}/products`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await axios.get(`${API_BASE}/categories`);
  return response.data;
};

export const fetchUserProducts = async (userId) => {
  const response = await axios.get(`${API_BASE}/users/${userId}/products`);
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await axios.post(`${API_BASE}/products`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateProduct = async (id, formData) => {
  formData.append('_method', 'PUT');
  const response = await axios.post(`${API_BASE}/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_BASE}/products/${id}`);
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await axios.get(`${API_BASE}/products/${id}`);
  return response.data;
};

export const fetchUserOrders = async (userId) => {
  const response = await axios.get(`${API_BASE}/users/${userId}/commandes`);
  return response.data;
};

export const updateUserProfile = async (userId, formData) => {
  const response = await axios.post(`${API_BASE}/users/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const changeUserPassword = async (userId, passwords) => {
  const response = await axios.post(`${API_BASE}/users/${userId}/change-password`, passwords);
  return response.data;
};

export const deleteUserAccount = async (userId) => {
  const response = await axios.delete(`${API_BASE}/users/${userId}`);
  return response.data;
};

export const cancelUserOrder = async (orderId) => {
  const response = await axios.post(`${API_BASE}/commandes/${orderId}/cancel`);
  return response.data;
};


export const createOrder = async (userId, address, items) => {
  return await axios.post(`${API_BASE}/commandes`, {
    user_id: userId,
    address,
    items,
  });
};
