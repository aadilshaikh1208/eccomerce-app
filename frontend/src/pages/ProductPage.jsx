import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { fetchOneProduct } from '../services/productServices';
import { updateCartOnServer } from '../services/cartServices';
import '../styles/ProductPage.scss'
const ProductPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null);
    const [count, setCount] = useState(1)
    const navigate = useNavigate()
    const increment = () => setCount(count + 1);
    const decrement = () => count > 1 && setCount(count - 1);
    const [showPopup, setShowPopup] = useState(false);

    const handleTogglePopup = () => {
        setShowPopup(!showPopup);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await fetchOneProduct(id);
            setProduct(data);
        };
        fetchProduct();
    }, [id]);


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


    const handleCartNavigation = async () => {
        setLoading(true)
        let userID = localStorage.getItem("userID") || "guest"
        let currentCart = JSON.parse(localStorage.getItem(`cart_${userID}`)) || [];

        if (!Array.isArray(currentCart)) {
            currentCart = [];
        }
        const productIndex = currentCart.findIndex(item => item.productId === product._id);
        if (productIndex > -1) {
            currentCart[productIndex].quantity += count;
        } else {
            currentCart.push({ productId: product._id, quantity: count });
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

        navigate(`/cart/${product._id}`, { state: { count } });
        setLoading(false)
    };


    if (!product) {
        return <div className='loader'></div>;
    }

    return (
        <div>
            <div className="product-section">
                <div className="productImage">
                    <img src={product.thumbnail} alt={product.title} />
                </div>
                <div className="product_details">
                    <div className="product-breadcrumbs">

                        <a onClick={() => navigate("/")} title="Back to the Homepage">
                            <svg width="20" height="21" viewBox="0 0 21 21">
                                <path d="M14.8367 19.3H5.50337C3.9867 19.3 2.60337 18.1333 2.35337 16.6333L1.24504 10C1.07004 8.96668 1.57004 7.64168 2.39504 6.98335L8.17004 2.35835C9.2867 1.45835 11.045 1.46668 12.17 2.36668L17.945 6.98335C18.7617 7.64168 19.2617 8.96668 19.095 10L17.9867 16.6333C17.7367 18.1083 16.3284 19.3 14.8367 19.3V19.3ZM10.1617 2.95001C9.72004 2.95001 9.27837 3.08335 8.95337 3.34168L3.17837 7.96668C2.70337 8.35001 2.37837 9.20001 2.47837 9.80001L3.5867 16.4333C3.7367 17.3083 4.6117 18.05 5.50337 18.05H14.8367C15.7284 18.05 16.6034 17.3083 16.7534 16.425L17.8617 9.79168C17.9617 9.19168 17.6284 8.33335 17.1617 7.95835L11.3867 3.34168C11.0534 3.08335 10.6117 2.95001 10.1617 2.95001V2.95001Z" fill="white"></path><path d="M10.17 14.0417C8.67834 14.0417 7.46167 12.825 7.46167 11.3333C7.46167 9.84167 8.67834 8.625 10.17 8.625C11.6617 8.625 12.8783 9.84167 12.8783 11.3333C12.8783 12.825 11.6617 14.0417 10.17 14.0417ZM10.17 9.875C9.37 9.875 8.71167 10.5333 8.71167 11.3333C8.71167 12.1333 9.37 12.7917 10.17 12.7917C10.97 12.7917 11.6283 12.1333 11.6283 11.3333C11.6283 10.5333 10.97 9.875 10.17 9.875Z" fill="white"></path>
                            </svg>
                        </a>
                        <a className="product-sep" onClick={() => navigate("/")}>Home /</a>
                        <a onClick={() => navigate("/collections/all?showProducts=true")}><span>Shop</span></a>
                        <span className="breadcrumbs-sep">/</span>
                        <p>{product.title}</p>

                    </div>

                    <h1>{product.title}</h1>
                    <div className='product-info'>
                        <p className='price'>
                            <span>${product.price}</span>
                            <sup>
                                <strike>${product.minimumOrderQuantity}.00
                                </strike>
                                <sub>
                                    <span>($1.64 per cup)</span>
                                </sub>

                            </sup>
                        </p>
                        <p className='product-rating'>
                            {renderStars(product.rating)}
                            <span>
                                {product.rating} ({product.stock})
                            </span>
                        </p>
                    </div>

                    <div className="purchase-discount">
                        <div className="one-time-purchase">
                            One-time purchase <br />
                            <h3>${product.price}</h3>
                        </div>
                        <div className="subscribe">
                            Subscribe: Get Free Shipping & Save {product.discountPercentage}%<br />
                            <h3>${(product.price - (product.price * product.discountPercentage / 100)).toFixed(2)}</h3>
                        </div>
                    </div>

                    <div className="delivery">
                        <h3>Delivery</h3>
                        <select>
                            <option defaultValue="Delivery every 30 Days">Delivery every 30 Days</option>
                            <option >Delivery every 30 Days</option>
                            <option >Delivery every 30 Days</option>
                        </select>
                    </div>

                    <div className="subscription-details">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="reload-icon mr-2" data-v-e69cc34d=""><path fill="currentColor" d="M13.64 2.35C12.19 0.9 10.2 0 7.99 0C3.57 0 0 3.58 0 8C0 12.42 3.57 16 7.99 16C11.72 16 14.83 13.45 15.72 10H13.64C12.82 12.33 10.6 14 7.99 14C4.68 14 1.99 11.31 1.99 8C1.99 4.69 4.68 2 7.99 2C9.65 2 11.13 2.69 12.21 3.78L8.99 7H15.99V0L13.64 2.35Z"></path></svg>
                        <div className='tool-tip'>
                            <span className='sub-text'>Subcription Details</span>
                            <span className="tooltiptext">
                                <h6>How subscriptions work</h6>
                                <p >Products are automatically delivered on your schedule. No obligation, modify or cancel your subscription anytime.
                                    Learn more...</p>
                            </span>
                        </div>
                    </div>

                    <div className="quantity-heading">
                        <h3>Quantity</h3>
                    </div>
                    <div className="counter-container">
                        <label htmlFor="quantity" className="hidden">Quantity selector</label>
                        <button type="button" className="counter-btn dec" onClick={decrement} >-</button>
                        <input type="number" className="counter-input" id="quantity" value={count} readOnly />
                        <button type="button" className="counter-btn inc" onClick={increment} aria-label="Increase">+</button>
                    </div>
                    <div className="product-desc-images">
                        <img src="//gratefulearthcoffee.com/cdn/shop/files/sugar_free.png?v=1671096441" height='50vh' />
                        <img src="//gratefulearthcoffee.com/cdn/shop/files/lab_tested.png?v=1671096454" height='50vh' />
                        <img src="//gratefulearthcoffee.com/cdn/shop/files/gluten_free.png?v=1671096454" height='50vh' />
                        <img src="//gratefulearthcoffee.com/cdn/shop/files/paleo.png?v=1671096454" height='50vh' />
                        <img src="//gratefulearthcoffee.com/cdn/shop/files/vegan.png?v=1671096454" height='50vh' />
                        <img src="//gratefulearthcoffee.com/cdn/shop/files/no_binders.png?v=1671096454" height='50vh' />
                    </div>

                    <button className='addToCart' onClick={() => { handleCartNavigation() }}>
                        {loading ? <span className="button-loader"></span> : 'Add to cart'}
                    </button>

                    <div className="product-share">
                        <div className="share-links"><div className="share-label">Share this Product:</div>
                            <a aria-label="Facebook" title="Facebook" target="_blank" rel="noopener" href="//www.facebook.com/sharer.php?u=https://gratefulearthcoffee.com/products/instant-espresso-dark-roast-coffee-blend" className="share-link" ><svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect y="0.793945" width="25" height="25" rx="12.5" fill="#3B5998"></rect>
                                <path d="M18.5 13.2939C18.5 9.99395 15.8 7.29395 12.5 7.29395C9.2 7.29395 6.5 9.99395 6.5 13.2939C6.5 16.2939 8.675 18.7689 11.525 19.2189V15.0189H10.025V13.2939H11.525V11.9439C11.525 10.4439 12.425 9.61895 13.775 9.61895C14.45 9.61895 15.125 9.76895 15.125 9.76895V11.2689H14.375C13.625 11.2689 13.4 11.7189 13.4 12.1689V13.2939H15.05L14.75 15.0189H13.325V19.2939C16.325 18.8439 18.5 16.2939 18.5 13.2939Z" fill="white"></path>
                            </svg>
                            </a><a aria-label="Twitter" title="Twitter" target="_blank" rel="noopener" href="//twitter.com/intent/tweet?text=Super%20Brain%20Coffee%20%7C%20Dark%20Roast%20%7C%206%20Nootropics%20-%20Grateful%20Earth&amp;url=https://gratefulearthcoffee.com/products/instant-espresso-dark-roast-coffee-blend" className="share-link" ><svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect y="0.793945" width="25" height="25" rx="12.5" fill="#00ACED"></rect>
                                <path d="M18.5 9.54395C18.05 9.76895 17.6 9.84395 17.075 9.91895C17.6 9.61895 17.975 9.16895 18.125 8.56895C17.675 8.86895 17.15 9.01895 16.55 9.16895C16.1 8.71895 15.425 8.41895 14.75 8.41895C13.175 8.41895 11.975 9.91895 12.35 11.4189C10.325 11.3439 8.525 10.3689 7.25 8.86895C6.575 9.99395 6.95 11.4189 8 12.1689C7.625 12.1689 7.25 12.0189 6.875 11.8689C6.875 12.9939 7.7 14.0439 8.825 14.3439C8.45 14.4189 8.075 14.4939 7.7 14.4189C8 15.3939 8.9 16.1439 10.025 16.1439C9.125 16.8189 7.775 17.1939 6.5 17.0439C7.625 17.7189 8.9 18.1689 10.25 18.1689C14.825 18.1689 17.375 14.3439 17.225 10.8189C17.75 10.5189 18.2 10.0689 18.5 9.54395Z" fill="white"></path>
                            </svg>
                            </a><a aria-label="Pinterest" title="Pinterest" target="_blank" rel="noopener" href="//pinterest.com/pin/create/button/?description=Super%20Brain%20Coffee%20%7C%20Dark%20Roast%20%7C%206%20Nootropics%20-%20Grateful%20Earth&amp;url=https://gratefulearthcoffee.com/products/instant-espresso-dark-roast-coffee-blend&amp;media=//gratefulearthcoffee.com/cdn/shop/products/5.jpg?v=1633524185" className="share-link"><svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect y="0.793945" width="25" height="25" rx="12.5" fill="#CB2027"></rect>
                                <path d="M12.537 7.40796C9.21663 7.40796 6.5 10.1246 6.5 13.4449C6.5 15.9352 8.00924 18.0481 10.1222 18.9537C10.1222 18.5009 10.1222 18.0481 10.1976 17.5953C10.3486 17.0671 10.9523 14.275 10.9523 14.275C10.9523 14.275 10.7259 13.8977 10.7259 13.294C10.7259 12.3885 11.2541 11.7093 11.8578 11.7093C12.386 11.7093 12.6879 12.0866 12.6879 12.6148C12.6879 13.1431 12.3106 13.9732 12.1597 14.7278C12.0087 15.3315 12.4615 15.8597 13.1407 15.8597C14.2726 15.8597 15.0272 14.4259 15.0272 12.6148C15.0272 11.2565 14.1217 10.2755 12.537 10.2755C10.7259 10.2755 9.59395 11.6338 9.59395 13.1431C9.59395 13.6713 9.74487 14.0486 9.97126 14.3505C10.0467 14.5014 10.1222 14.5014 10.0467 14.6523C10.0467 14.7278 9.97126 15.0296 9.89579 15.1051C9.82033 15.256 9.74487 15.3315 9.59395 15.256C8.76387 14.8787 8.38655 13.9732 8.38655 12.9167C8.38655 11.1811 9.82033 9.14359 12.6879 9.14359C15.0272 9.14359 16.5364 10.8038 16.5364 12.6148C16.5364 14.9542 15.2536 16.7653 13.2916 16.7653C12.6124 16.7653 12.0087 16.3879 11.7823 16.0106C11.7823 16.0106 11.405 17.369 11.3296 17.6708C11.1786 18.1236 10.9523 18.5763 10.7259 18.9537C11.2541 19.1046 11.8578 19.18 12.4615 19.18C15.7818 19.18 18.4985 16.4634 18.4985 13.1431C18.5739 10.1246 15.8573 7.40796 12.537 7.40796Z" fill="white"></path>
                            </svg>
                            </a>
                        </div>
                    </div>

                    <div className="description-container" onClick={() => handleTogglePopup()}>
                        <div className="header">
                            <h3>Description</h3>
                            {
                                showPopup ?
                                    (
                                        <svg className="icon" width="30" height="15" viewBox="0 0 30 15" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 7.5C6 6.67157 6.50368 6 7.125 6H22.875C23.4963 6 24 6.67157 24 7.5C24 8.32843 23.4963 9 22.875 9H7.125C6.50368 9 6 8.32843 6 7.5Z" fill="white" /> </svg>) :
                                    (
                                        <svg className="icon" width="31" height="31" viewBox="0 0 31 31" xmlns="http://www.w3.org/2000/svg"> <path d="M15.7329 6.1875C15.1116 6.1875 14.6079 6.69118 14.6079 7.3125V14.0625H7.85791C7.23659 14.0625 6.73291 14.5662 6.73291 15.1875C6.73291 15.8088 7.23659 16.3125 7.85791 16.3125H14.6079V23.0625C14.6079 23.6838 15.1116 24.1875 15.7329 24.1875C16.3542 24.1875 16.8579 23.6838 16.8579 23.0625V16.3125H23.6079C24.2292 16.3125 24.7329 15.8088 24.7329 15.1875C24.7329 14.5662 24.2292 14.0625 23.6079 14.0625H16.8579V7.3125C16.8579 6.69118 16.3542 6.1875 15.7329 6.1875Z" fill="#873A8D" stroke="#873A8D" strokeWidth="0.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                        </div>
                        {showPopup &&
                            (
                                <div className="popup"> <p>{product.description}</p></div>
                            )}
                    </div>
                </div>
            </div>

        </div>

    );
};

export default ProductPage;
