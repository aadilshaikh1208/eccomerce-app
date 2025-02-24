import axios from "axios"
const VITE_BACKEND_BASEURL = 'http://54.221.82.201:4000/api'

export const getUsers = async () => {
    try {
        const response = await axios.get(`${VITE_BACKEND_BASEURL}/users/getUsers/`)
        return response.data
    }
    catch (error) {
        console.error("Error fetching users : ", error)
        throw error
    }
}

export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${VITE_BACKEND_BASEURL}/users/getUserById/${userId}`)
        return response.data
    }
    catch (error) {
        console.error("Error fetching users by ID", error)
        throw error
    }
}

export const addUser = async (userData) => {
    try {
        const response = await axios.post(`${VITE_BACKEND_BASEURL}/users/addUsers`, userData);
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}