import axios from "axios";

export const baseURL = "https://backend-8o4k.onrender.com/api";

// Create an axios instance with the base URL
const api = axios.create({
    baseURL: baseURL,
    timeout: 10000, // Set a timeout of 10 seconds
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Important for CORS with credentials
});

api.interceptors.request.use(
    (config) => {
        // Add token to headers if available
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle errors globally
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/"; 
        }
        return Promise.reject(error);
    }
);

// Helper function to extract data and handle errors
const handleResponse = async (apiCall) => {
    try {
        const response = await apiCall;
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Request failed';
        throw new Error(message);
    }
};

// Auth
export const login = (email, password) => 
    handleResponse(api.post('/auth/login', { email, password }));

export const register = (name, email, password, role = 'Borrower') => 
    handleResponse(api.post('/auth/register', { name, email, password, role }));

// User
export const getMe = (token) => 
    handleResponse(api.get('/users/me'));

export const updateMe = (payload) => 
    handleResponse(api.patch('/users/me', payload));

// Books
export const listBooks = () => 
    handleResponse(api.get('/books'));

export const getBook = (id) => 
    handleResponse(api.get(`/books/${id}`));

export const createBook = (payload) => 
    handleResponse(api.post('/books', payload));

export const updateBook = (id, payload) => 
    handleResponse(api.put(`/books/${id}`, payload));

export const deleteBook = (id) => 
    handleResponse(api.delete(`/books/${id}`));

export const deleteAllBooks = () =>
    handleResponse(api.delete('/books'));

// Borrow
export const borrowBook = (bookId) => 
    handleResponse(api.post('/borrow', { bookId }));

export const returnBook = (userId, bookId) => 
    handleResponse(api.post('/borrow/return', { userId, bookId }));

export const listBorrowRecords = () => 
    handleResponse(api.get('/borrow/records'));

// Contact
export const submitContact = (payload) => 
    handleResponse(api.post('/contact', payload));

export default api;
// Note: AuthContext is defined in src/context/AuthContext.jsx
