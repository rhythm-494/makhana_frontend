const API_BASE_URL = 'https://makhana-nodebackend.onrender.com/api';

export const orderService = {
    createOrder: async (orderData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    getUserOrders: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders?user_id=${userId}`, {
                credentials: 'include'
            });
            
            const data = await response.json();
            console.log("data: ", data);
            
            if (data && Array.isArray(data) && data.length > 0) {
                return {
                    status: 1,
                    orders: data,
                    message: "Orders retrieved successfully"
                };
            } else {
                return {
                    status: 1,
                    orders: [],
                    message: "No orders found. Start shopping to see your orders here!"
                };
            }
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw error;
        }
    },

    getAllOrders: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                credentials: 'include'
            });
            
            const data = await response.json();
            return {
                status: 1,
                orders: data || [],
                message: "All orders retrieved successfully"
            };
        } catch (error) {
            console.error('Error fetching all orders:', error);
            throw error;
        }
    },

    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: orderId,
                    status: status
                })
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }
};
