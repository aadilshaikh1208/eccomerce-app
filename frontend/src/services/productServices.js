import axios from "axios"
const VITE_BACKEND_BASEURL = 'http://3.91.47.62:4000/api'


export const fetchProductsData = async () => {
    try {
        const response = await fetch(`${VITE_BACKEND_BASEURL}/products/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching products: ", error);
        throw error;
    }
};

export const fetchOneProduct = async (productId) => {
    try {
        const response = await fetch(`${VITE_BACKEND_BASEURL}/products/${productId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch product details: ${response.statusText}`);
        }
        console.log('Response:', response);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch product details:', error);
        throw error;
    }
};
export const addProduct = async (product) => {
    try {
        const response = await fetch(`${VITE_BACKEND_BASEURL}/products/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product)
        })
        if (!response.ok) {
            throw new Error("Failed to add product")
        }
        return response.json()
    }
    catch (error) {
        console.error("Error adding product: ", error)
        throw error
    }
}

export const updateProduct = async (productId, updatedProduct) => {
    try {
        const response = await fetch(`${VITE_BACKEND_BASEURL}/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct)
        })
        if (!response.ok) {
            throw new Error("Failed to update product")
        }
        return response

    }
    catch (error) {
        console.error("Error updating product: ", error)
        throw error
    }
}

export const deleteProduct = async (productId) => {
    try {
        const response = await fetch(`${VITE_BACKEND_BASEURL}/products/${productId}`, {
            method: "DELETE"
        })
        if (!response.ok) {
            throw new Error("Failed to delete product")
        }
    }
    catch (error) {
        console.error("Error deleting product: ", error)
        throw error
    }
}

export const fetchProductsByCategory = async (category) => {
    try {
        const response = await axios.get(`${VITE_BACKEND_BASEURL}/products/category/${category}`)
        return response.data
    }
    catch (error) {
        console.error("Error fetching products by category", error)
        throw error
    }
}

export const fetchProductCategories = async () => {
    try {
        const response = await axios.get(`${VITE_BACKEND_BASEURL}/products/categories/all`)
        return response.data
    }
    catch (error) {
        console.error("Error fetching product categories", error)
        throw error
    }
} 