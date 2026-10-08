import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function getBooks(params = {}) {
  const response = await api.get("/books/", { params });
  return response.data;
}

export async function getBook(id) {
  const response = await api.get(`/books/${id}/`);
  return response.data;
}

export async function loginUser(username, password) {
  const response = await api.post("/auth/login/", {username,password});
  return response.data;
}

export async function registerUser(username, email, password) {
  const response = await api.post("/auth/register/", { username, email, password,});
  return response.data;
}

export async function getCart() {
  const response = await api.get("/cart/");
  return response.data;
}

export async function addToCart(bookId, quantity) {
  const response = await api.post("/cart/", {
    book: bookId,
    quantity: quantity,
  });
  return response.data;
}

export async function updateCartItem(itemId, quantity) {
  const response = await api.patch(`/cart/items/${itemId}/`,{quantity});
  return response.data;
}

export async function removeCartItem(itemId) {
  const response = await api.delete(`/cart/items/${itemId}/`);
  return response.data;
}

export async function createOrder() {
  const response = await api.post("/orders/");
  return response.data;
}

export async function getOrders() {
  const response = await api.get("/orders/list/");
  return response.data;
}

export async function getOrder(id) {
  const response = await api.get(`/orders/${id}/`);
  return response.data;
}

export async function cancelOrder(id) {
  const response = await api.patch(`/orders/${id}/cancel/`);
  return response.data;
}

export default api;