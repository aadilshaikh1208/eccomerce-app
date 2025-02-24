import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../services/authServices'
import { fetchCartFromServer, updateCartOnServer } from '../services/cartServices';
import EmptyShoppingCart from './EmptyShoppingCart';
import axios from 'axios';
import '../styles/Cart.scss';

const Cart = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [checkoutBtnLoading, setCheckoutBtnLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const userID = localStorage.getItem("userID") || "guest"
    const VITE_BACKEND_BASEURL = 'http://54.221.82.201:4000/api'


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

            setCartItems(productDetails);
        } catch (error) {
            console.error('Error fetching cart products:', error);
        }
    };

    useEffect(() => {
        fetchCartProducts();
        window.scrollTo(0, 0);
    }, [userID]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [])


    const handleQuantityChange = async (id, newQuantity) => {
        if (newQuantity < 1) return handleRemoveItem(id);

        const updatedProducts = cartItems.map((product) =>
            product._id === id ? { ...product, quantity: newQuantity } : product
        );
        setCartItems(updatedProducts);

        const updatedProductIds = updatedProducts.map((product) => ({
            productId: product._id,
            quantity: product.quantity
        }));
        localStorage.setItem(`cart_${userID}`, JSON.stringify(updatedProductIds));
        if (userID !== "guest") {
            try {
                await updateCartOnServer(userID, updatedProductIds);
            } catch (error) {
                console.error('Error updating cart on server:', error);
            }
        }
    };

    const handleRemoveItem = async (id) => {
        const updatedProducts = cartItems.filter((product) => product._id !== id);
        setCartItems(updatedProducts);

        const updatedProductIds = updatedProducts.map((product) => ({
            productId: product._id,
            quantity: product.quantity
        }));
        localStorage.setItem(`cart_${userID}`, JSON.stringify(updatedProductIds));

        if (userID !== "guest") {
            try {
                await updateCartOnServer(userID, updatedProductIds);
            } catch (error) {
                console.error('Error updating cart on server:', error);
            }
        }
        fetchCartProducts();
    };

    const handleCheckOut = async () => {
        setCheckoutBtnLoading(true)
        try {
            await checkAuth(localStorage.getItem("token"))
            navigate(`/checkout`, { state: { cartItems } })
        }
        catch (error) {
            navigate('/login')
            setCheckoutBtnLoading(false)
        }
    }

    if (cartItems.length === 0 && !loading) {
        return <EmptyShoppingCart />;
    }

    return (
        <div className="cart-container">
            {loading ? (
                <div className='login-loader'></div>
            ) : (
                <div className="cart-grid">
                    <div className="cart-details">
                        <div className="cart-form">
                            <div className="cart-table-header">
                                <div className="cart-table-row">
                                    <div className="cart-table-cell--product">Product</div>
                                    <div className="cart-table-cell--price">Price</div>
                                    <div className="cart-table-cell--quantity">Quantity</div>
                                    <div className="cart-table-cell--total">Total</div>
                                </div>
                            </div>
                            <div className="cart-table-body">
                                {cartItems.map(item => {
                                    const total = item.price * item.quantity;
                                    return (
                                        <div className="cart-table-row" key={item._id}>
                                            <div className="cart-table-cell--product">
                                                <div className="cart-product">
                                                    <img src={item.thumbnail} alt="/loading" />
                                                    <div className="cart-product__desc">
                                                        <span>{item.title}</span>
                                                        <div className="cart-product__selling-plan-name">Delivery every 30 Days</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="cart-table-cell--price">
                                                <span>${item.price}</span>
                                            </div>
                                            <div className="cart-table-cell--quantity">
                                                <div className="counter">
                                                    <button className="inputCounter__btn inputCounter__btn--down" type="button" aria-label="Decrease" onClick={() => handleQuantityChange(item._id, item.quantity - 1)}> <span>-</span> </button>
                                                    <input type="text" className="inputCounter" value={item.quantity} readOnly />
                                                    <button className="inputCounter__btn inputCounter__btn--up" type="button" aria-label="Increase" onClick={() => handleQuantityChange(item._id, item.quantity + 1)}> <span>+</span> </button>
                                                </div>
                                                <span className='remove-item' onClick={() => handleRemoveItem(item._id)}>Remove</span>
                                            </div>
                                            <div className="cart-table-cell--total">${total.toFixed(2)}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="cart-summary">
                        <div className="buttons-container">
                            <button className="checkout-button" onClick={() => handleCheckOut()}>
                                {checkoutBtnLoading ? <span className="button-loader"></span> : 'SAFE CHECKOUT'}
                            </button>
                            <button className="continue-shopping-button" onClick={() => navigate(`/collections/all`)}>CONTINUE SHOPPING</button>
                        </div>
                    </div>
                </div>
            )}

        </div >
    );
}

export default Cart;
