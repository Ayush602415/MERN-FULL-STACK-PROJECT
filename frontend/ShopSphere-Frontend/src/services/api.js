import axios from 'axios'
import { store } from "../redux/store";
import { logout, updateAccessToken } from "../redux/feature/authSlice";

export const apiBaseUrl = (
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
        ? "http://localhost:3000/api"
        : "https://mern-full-stack-project-hgsr.onrender.com/api")
).replace(/\/+$/, "");

let accessToken = null;
export const setAccessToken = (token) => {
    accessToken = token;
    store.dispatch(updateAccessToken(token));
} 

export const getAccessToken = ()=>{
    return accessToken
}

const api = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
})

let refreshPromise = null;

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => response, (error) => {
    const originalRequest = error.config;

    if (
        error.response?.status !== 401 ||
        !originalRequest ||
        !originalRequest.headers?.Authorization ||
        originalRequest._retry ||
        originalRequest.url?.includes('/auth/refresh')
    ) {
        return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
        refreshPromise = api.post('/auth/refresh')
            .then((response) => {
                setAccessToken(response.data.accessToken);
                return response.data.accessToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise.then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
    }).catch((refreshError) => {
        setAccessToken(null);
        store.dispatch(logout());
        return Promise.reject(refreshError);
    });
});

export const createPayment= async(orderId)=>{
   const {data} = await api.post(`/payments/create/${orderId}`)
    return data
}

export const verifyPayment = async(paymentData)=>{
    const {data} = await api.post("/payments/verify", paymentData)
    return data
}


export default api