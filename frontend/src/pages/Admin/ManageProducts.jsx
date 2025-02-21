import React, { useEffect, useState } from 'react';
import AddProductForm from '../../components/Admin/AddProductForm';
import EditProductForm from '../../components/Admin/EditProductForm';
import ProductList from '../../components/Admin/ProductList';
import { fetchProductsData, addProduct, updateProduct, deleteProduct, fetchProductsByCategory } from '../../services/productServices';
import { useNavigate } from 'react-router-dom';
import { logout, fetchAdminDetails } from '../../services/authServices';
import Overview from '../../components/Admin/Overview';
import UserDetails from '../../components/Admin/UserDetails';
import Orders from '../../components/Admin/Orders';
import AdminProfile from '../../components/Admin/AdminProfile';
import { fetchProductCategories } from '../../services/productServices';
import { checkAuth } from '../../services/authServices';
import '../../styles/ManageProducts.scss';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentSection, setCurrentSection] = useState("overview");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await checkAuth(localStorage.getItem("token"));
                const role = response.role;
                if (role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } catch (error) {
                // Handle error (e.g., stay on login page)
            }
        };
        verifyAuth();
    }, [navigate]);

    useEffect(() => {
        const overlay = document.getElementById('overlay');

        if (showAddForm || showEditForm) {
            overlay.style.display = "block";
            document.body.style.overflow = 'hidden';
        } else {
            overlay.style.display = "none";
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showAddForm, showEditForm]);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const data = await fetchAdminDetails(localStorage.getItem("userID"));
                setAdminData(data);
            } catch (error) {
                navigate('/login');
            }
        };

        fetchAdminData();
    }, [navigate]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                let products;
                if (selectedCategory === "all") {
                    products = await fetchProductsData();
                    setCurrentSection("products")
                } else if (selectedCategory !== "") {
                    products = await fetchProductsByCategory(selectedCategory);
                    setCurrentSection("products")
                }
                setProducts(products);
            } catch (error) {
                console.error("Error fetching products: ", error);
            }
        };

        loadProducts();
    }, [selectedCategory, showEditForm]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categories = await fetchProductCategories();
                setCategories(categories);
            } catch (error) {
                console.error("Error fetching product categories: ", error);
            }
        };

        loadCategories();
    }, [showAddForm, showEditForm]);

    const handleAddProduct = async (newProduct) => {
        try {
            const addedProduct = await addProduct(newProduct);
            if (addedProduct) {
                setProducts((prevProducts) => { return Array.isArray(prevProducts) ? [...prevProducts, addedProduct] : [addedProduct] });;
                setShowAddForm(false);
            } else {
                console.error('Error adding product: received undefined product');
            }
        } catch (error) {
            console.error("Error adding product: ", error);
        }
    };

    const handleEditProduct = async (updatedProduct) => {
        try {
            const updatedProd = await updateProduct(updatedProduct._id, updatedProduct);
            setProducts((products) => {
                const updatedProducts = products.map((product) => (product._id === updatedProd._id ? updatedProd : product));
                console.log("Updated Products:", updatedProducts);
                return updatedProducts;
            });
            setEditingProduct(null);
            setShowEditForm(false);
        } catch (error) {
            console.error("Error updating product: ", error);
        }
    };


    const handleDeleteProduct = async (productId) => {
        try {
            await deleteProduct(productId);

            const updatedProducts = products.filter((product) => product._id !== productId);
            setProducts(updatedProducts);

            const productCategory = products.find(product => product._id === productId).category;
            const remainingProductsInCategory = updatedProducts.filter(product => product.category === productCategory);

            if (remainingProductsInCategory.length === 0) {
                setCategories(categories.filter(category => category !== productCategory));
                setSelectedCategory("all")
            }
        } catch (error) {
            console.error("Error deleting product: ", error);
        }
    };

    const openEditForm = (product) => {
        setEditingProduct(product);
        setShowEditForm(true);
    };

    const handleAdminLogout = async () => {
        setLoading(true)
        try {
            const response = await logout();
            if (response.status === 200) {
                localStorage.removeItem("userID")
                localStorage.removeItem("userRole")
                window.dispatchEvent(new Event("authChange"))
                navigate("/");
            }
        } catch (error) {
            console.error("Error while logging out: ", error);
        }
    };

    return (
        <div className="manage-products">
            <div className="sidebar">
                <button className='sidebar-buttons' onClick={() => setCurrentSection("overview")}>Overview</button>
                <button className='sidebar-buttons' onClick={() => setCurrentSection('adminProfile')}>Profile</button>
                <select
                    className='sidebar-category'
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    value={selectedCategory}
                >
                    <option value="" defaultValue="" disabled hidden>Products</option>
                    <option value="all">All</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>


                <button className='sidebar-buttons' onClick={() => setCurrentSection("users")}>Users</button>
                <button className='sidebar-buttons' onClick={() => setCurrentSection("orders")}>Orders</button>
                <button className='sidebar-buttons' onClick={() => setShowAddForm(true)}>Add Product</button>
                <button className='sidebar-buttons' onClick={() => handleAdminLogout()}>
                    {loading ? <span className="button-loader"></span> : 'Logout'}
                </button>
            </div>
            <div id='overlay'></div>
            {adminData ? (
                <div className="admin-container">
                    <div className="content">
                        {currentSection === "overview" && <Overview />}
                        {currentSection === "products" && (
                            <ProductList
                                products={products}
                                onEdit={openEditForm}
                                onDelete={handleDeleteProduct}
                            />
                        )}
                        {currentSection === "users" && <UserDetails />}
                        {currentSection === "orders" && <Orders />}
                        {currentSection === "adminProfile" && <AdminProfile />}
                        {showAddForm && (
                            <div className="modal">
                                <div className="modal-content">
                                    <span className="close-button" onClick={() => setShowAddForm(false)}>&times;</span>
                                    <AddProductForm onAdd={handleAddProduct} categories={categories} />
                                </div>
                            </div>
                        )}
                        {showEditForm && (
                            <div className="modal">
                                <div className="modal-content">
                                    <span className="close-button" onClick={() => setShowEditForm(false)}>&times;</span>
                                    <EditProductForm
                                        product={editingProduct}
                                        onUpdate={handleEditProduct}
                                        categories={categories}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="admin-loader"></div>
            )}
        </div>
    );
};

export default ManageProducts;
