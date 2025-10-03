import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api';

export const fetchProducts = async () => {
  const response = await axios.get(`${API_BASE}/products`);
  return response.data;
};

export async function fetchCategories() {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/categories`);
  return res.data;
}
