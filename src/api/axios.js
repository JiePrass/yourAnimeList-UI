// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Ganti dengan URL API kamu
});

// Tambahkan interceptor atau konfigurasi lain jika perlu

export default api;
