import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.API_BASE_URL,
});



api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});



api.interceptors.response.use((response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const response = await api.post("/auth/refresh/", 
            {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          localStorage.setItem("access_token", newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);

        } catch (refreshError) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
    }

      throw error;
  }
);



export async function getBooks(params = {}) {
  const response = await api.get("/books/", { params });
  return response.data;
}

export async function getBook(id) {
  const response = await api.get(`/books/${id}/`);
  return response.data;
}

export async function loginUser(username, password) {
  const response = await api.post("/auth/login/", { username, password });
  return response.data;
}

export async function registerUser(username, email, password) {
  const response = await api.post("/auth/register/", { username, email, password, });
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
  const response = await api.patch(`/cart/items/${itemId}/`, { quantity });
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