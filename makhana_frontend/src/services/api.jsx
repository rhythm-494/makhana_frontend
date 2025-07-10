import axios from "axios";

const api_url = 'https://makhana-nodebackend.onrender.com/api';

const api = axios.create({
    baseURL: api_url,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const productAPI = {
    getAllProducts: () => api.get('/products'),
    
    addProduct: (productData) => {
        const formData = new FormData();
        Object.keys(productData).forEach(key => {
            formData.append(key, productData[key]);
        });
        return api.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    
    updateProduct: (productData) => {
        const formData = new FormData();
        Object.keys(productData).forEach(key => {
            formData.append(key, productData[key]);
        });
        return api.put('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    
    deleteProduct: (productId) => api.delete('/products', { 
        data: { id: productId } 
    }),
    
    findProducts: (productIds) => api.post('/products/find', { 
        productIds 
    }),
};

export const adminAPI = {
    login: (credentials) => api.post('/admin/login', credentials),
    checkAuth: () => api.get('/admin/check-auth'),
    logout: () => api.post('/admin/logout'),
    getProducts: () => api.get('/products'), // Same endpoint, different handling
};

export default api;
