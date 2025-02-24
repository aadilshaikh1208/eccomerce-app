import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchOneProduct } from '../services/productServices'
import { updateCartOnServer, fetchCartFromServer } from '../services/cartServices'
import axios from 'axios'
import '../styles/HomeProduct.scss'

const HomeProduct = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const userID = localStorage.getItem("userID") || "guest"
    const id = "67a5e7d6cc97f9ac16ee35df"
    const quantity = 1
    const navigate = useNavigate()
    const VITE_BACKEND_BASEURL = 'http://54.221.82.201/api'


    useEffect(() => {
        const fetchProduct = async () => {
            const data = await fetchOneProduct(id);
            setProduct(data);
        };
        fetchProduct();
    }, [id]);

    const fetchCartProducts = async () => {
        try {
            let savedProducts;
            if (userID !== "guest") {
                savedProducts = await fetchCartFromServer(userID);
            } else {
                savedProducts = JSON.parse(localStorage.getItem(`cart_${userID}`)) || [];
            }
            const productDetails = await Promise.all(
                savedProducts.map(async (item) => {
                    const productId = item.productId || item._id || item.id;
                    const response = await axios.get(`${VITE_BACKEND_BASEURL}/products/${productId}`);
                    return { ...response.data, quantity: item.quantity };
                })
            );

        } catch (error) {
            console.error('Error fetching cart products:', error);
        }
    };

    const handleCart = async () => {
        setLoading(true)
        let userID = localStorage.getItem("userID") || "guest";
        let currentCart = JSON.parse(localStorage.getItem(`cart_${userID}`)) || [];

        if (!Array.isArray(currentCart)) {
            currentCart = [];
        }

        const productIndex = currentCart.findIndex(item => item.productId === product._id);
        if (productIndex > -1) {
            currentCart[productIndex].quantity += quantity;
        } else {
            currentCart.push({ productId: product._id, quantity });
        }
        localStorage.setItem(`cart_${userID}`, JSON.stringify(currentCart));

        const formattedCart = currentCart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        if (userID !== "guest") {
            try {
                await updateCartOnServer(userID, formattedCart);
            } catch (error) {
                console.error('Error updating cart on server:', error);
            }
        }
        navigate(`/cart/${id}`, { state: { quantity } });
        setLoading(false)
    }

    useEffect(() => {
        fetchCartProducts();
    }, []);


    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStars = rating % 1 !== 0 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;
        return (
            <>
                {[...Array(fullStars)].map((_, index) =>
                    (<svg style={{ margin: "0 4px" }} key={`full-${index}`} xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 24 24" fill="#ffc629"> <path d="M12 .587l3.668 7.431 8.214 1.192-5.941 5.796 1.402 8.181L12 18.897l-7.343 3.866 1.402-8.181-5.941-5.796 8.214-1.192z" /> </svg>))}
                {halfStars === 1 && (<svg style={{ margin: "0 4px" }} xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 24 24" fill="#F7AB1E"> <defs> <linearGradient id="halfGrad"> <stop offset="50%" stopColor="#ffc629" /> <stop offset="50%" stopColor="#e0e0e0" /> </linearGradient> </defs> <path d="M12 .587l3.668 7.431 8.214 1.192-5.941 5.796 1.402 8.181L12 18.897l-7.343 3.866 1.402-8.181-5.941-5.796 8.214-1.192z" fill="url(#halfGrad)" /> </svg>)}
                {[...Array(emptyStars)].map((_, index) => (<svg style={{ margin: "0 4px" }} key={`empty-${index}`} xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 24 24" fill="#e0e0e0"> <path d="M12 .587l3.668 7.431 8.214 1.192-5.941 5.796 1.402 8.181L12 18.897l-7.343 3.866 1.402-8.181-5.941-5.796 8.214-1.192z" /> </svg>))} </>);
    };

    if (!product) {
        return <div className='loader'></div>;
    }

    return (
        <div className='home-product-container'>
            <div className="heading">
                <h2>Featured Product</h2>
            </div>
            <div className="home-product-content">
                <div className="home-product-image">
                    <img src={product.thumbnail} alt="" />
                </div>
                <div className="home-product-details">
                    <div className="home-product-title">
                        <h3>{product.title}</h3>
                    </div>
                    <div className='product-rating'>
                        {renderStars(product.rating)}
                        <span>
                            ({product.stock})
                        </span>
                    </div>

                    <div className='home-product-price'>
                        <span>${product.price}</span>
                        <strike>${product.minimumOrderQuantity}</strike>
                    </div>

                    <div className="home-product-benefits">
                        <div className="home-product-benefits-title">
                            BENEFITS
                        </div>
                        <div className="home-product-benefits-points">
                            <p>  Mental Focus &amp; Energy</p>
                            <p>  Immune Support</p>
                            <p>  Non-GMO &amp; Gluten Free</p>
                            <p>  No anxiety, crash, or jitters</p>
                            <p>  Save Time &amp; Money</p>
                        </div>
                    </div>

                    <div className="home-product-meta-label">
                        SUGAR-FREE | NON-GMO | GLUTEN-FREE | PALEO | VEGAN
                    </div>


                    <div className="home-product-btn">
                        <button className='home-product-button' onClick={() => handleCart()}>
                            {loading ? <span className="button-loader"></span> : 'ADD TO CART'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default HomeProduct