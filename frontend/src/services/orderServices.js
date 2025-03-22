import axios from "axios";
const VITE_BACKEND_BASEURL = 'http://3.92.239.167:4000/api'

export const saveOrders = async (userId, ordersData, totalPrice) => {
    try {
        const response = await axios.post(`${VITE_BACKEND_BASEURL}/orders/add-orders`, { userId, ordersData, totalPrice }, {
        });

        if (response.status < 200 || response.status >= 300) {
            throw new Error("Failed to save orders");
        }

        return response.data;
    } catch (error) {
        console.error("Error saving orders: ", error);
        throw error;
    }
};

export const fetchOrders = async () => {
    try {
        const response = await axios.get(`${VITE_BACKEND_BASEURL}/orders/fetch-orders`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            return response.data
        }

    } catch (error) {
        console.error("Error saving orders: ", error);
        throw error;
    }
};

