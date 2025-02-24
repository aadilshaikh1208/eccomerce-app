import axios from "axios"
const VITE_BACKEND_BASEURL = 'http://54.221.82.201:4000/api'

export const checkAuth = async (token) => {
    try {
        const response = await axios.get(`${VITE_BACKEND_BASEURL}/auth/check-auth`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
        })
        return response.data
    }
    catch (error) {
        // console.error("Error checking authentication: ", error)
        throw error
    }
}

export const fetchAdminDetails = async (userId) => {
    try {
        const response = await axios.get(`${VITE_BACKEND_BASEURL}/admin/profile/${userId}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
        return response.data
    }
    catch (error) {
        // console.error("Error checking authentication: ", error)
        throw error
    }
}



export const logout = async () => {
    try {
        const response = await axios.post(`${VITE_BACKEND_BASEURL}/auth/logout`, {}, {
            withCredentials: true,
        })
        return response
    }
    catch (error) {
        console.error("Error while logging out : ", error)
        throw error

    }
}



export const userSignUp = async (credentials) => {
    try {
        const response = await axios.post(`${VITE_BACKEND_BASEURL}/auth/signup`, credentials, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });


        if (response.data.token && response.status === 200) {
            return response.data;
        } else {
            return "ERROR WHILE SIGNING UP";
        }
    } catch (error) {
        console.error('Signup failed', error);
        return "ERROR";
    }
};
