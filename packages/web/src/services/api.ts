import api from '../config/axios'

// Auth API calls
export const authAPI = {
  signup: (userData: { name: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  logout: () => api.post('/auth/logout'),
  
  refresh: () => api.post('/auth/refresh'),
  
  profile: () => api.get('/auth/profile'),
}

// Books API calls
export const booksAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/books', { params }),
  
  getById: (id: string) => api.get(`/books/${id}`),

  getBySlug: (slug: string) => api.get(`/books/slug/${slug}`),
  
  create: (bookData: any) => api.post('/books', bookData),
  
  update: (id: string, bookData: any) => api.put(`/books/${id}`, bookData),
  
  delete: (id: string) => api.delete(`/books/${id}`),
}

// Categories API calls
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  
  getById: (id: string) => api.get(`/categories/${id}`),
}

// Users API calls
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (userData: any) => api.put('/users/profile', userData),
  
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) =>
    api.put('/users/change-password', passwordData),
}

// Readlist API calls
export const readlistAPI = {
  addToReadList: (bookId: string) => api.post(`/readlist/${bookId}`),
  removeFromReadList: (bookId: string) => api.delete(`/readlist/${bookId}`),
  getReadList: () => api.get('/readlist'),
  getReadListBooks: () => api.get('/readlist/books'),
}

// Reviews API calls
export const reviewsAPI = {
  addReview: (bookId: string, reviewData: any) => api.post(`/reviews/${bookId}`, reviewData),
  getReviews: (bookId: string) => api.get(`/reviews/${bookId}`),
  deleteReview: (reviewId: string) => api.delete(`/reviews/${reviewId}`),
}

export default api 