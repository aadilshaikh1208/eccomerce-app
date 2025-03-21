import axios from 'axios';

const VITE_BACKEND_BASEURL = 'http://3.91.47.62:4000/api'

export const updateCartOnServer = async (userId, cartItems) => {
    try {
        const response = await axios.post(`${VITE_BACKEND_BASEURL}/cart/update`, { userId, cartItems }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating cart on server:', error);
        throw error;
    }
};

export const fetchCartFromServer = async (userId) => {
    try {
        const response = await axios.get(`${VITE_BACKEND_BASEURL}/cart/${userId}`);
        return response.data.cartItems || [];
    } catch (error) {
        console.error('Error fetching cart from server:', error);
        throw error;
    }
};



export const mergeCarts = async (userId, guestCart) => {
    try {
        const response = await axios.post(`${VITE_BACKEND_BASEURL}/cart/merge`, { userId, guestCart }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error merging carts:', error);
        throw error;
    }
};


export const removeCartFromServer = async (userId) => {
    try {
        const response = await axios.delete(`${VITE_BACKEND_BASEURL}/cart/remove/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing cart from server:', error);
        throw error;
    }
}