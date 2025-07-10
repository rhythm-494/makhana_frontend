const API_BASE_URL = 'https://makhana-nodebackend.onrender.com/api';

export const paymentService = {
    loadRazorpay: () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    },

    createRazorpayOrder: async (amount) => {
        try {
            const response = await fetch(`${API_BASE_URL}/payments/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount * 100, // Convert to paise
                    currency: 'INR'
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            throw error;
        }
    },

    verifyPayment: async (paymentData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/payments/verify`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    }
};
