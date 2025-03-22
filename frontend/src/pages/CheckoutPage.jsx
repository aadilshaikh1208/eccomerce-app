import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveOrders } from '../services/orderServices';
import { fetchCartFromServer, removeCartFromServer } from '../services/cartServices';
import { checkAuth } from '../services/authServices';
import { useFormik } from 'formik'
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import * as Yup from 'yup'
import logo from '../assets/logo.png'
import '../styles/CheckoutPage.scss';

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0)
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [cardErrors, setCardErrors] = useState({});
    const navigate = useNavigate()
    const userID = localStorage.getItem("userID") || "guest"
    const VITE_BACKEND_BASEURL = 'http://3.92.239.167:4000/api'


    const validationSchema = Yup.object({
        email: Yup.string().required("Email is required"),
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        address: Yup.string().required("Address is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("Choose state ! "),
        zipcode: Yup.number().typeError("Zipcode must be an integer!").positive("It must be positive").required("Zipcode is required !"),
    })

    const formik = useFormik({
        initialValues: {
            email: "",
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            state: "",
            zipcode: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            await handlePayment();
            setSubmitting(false);
        }
    })

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [])


    const handlePayment = async () => {
        const isValid = await formik.validateForm();

        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpiryElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);

        const cardErrors = {};
        if (!cardNumberElement._complete) {
            setPaymentLoading(false)
            cardErrors.cardNumber = 'Card number is required';
        }
        if (!cardExpiryElement._complete) {
            setPaymentLoading(false)
            cardErrors.cardExpiry = 'Expiration date is required';
        }
        if (!cardCvcElement._complete) {
            setPaymentLoading(false)
            cardErrors.cardCvc = 'CVV is required';
        }

        setCardErrors(cardErrors)

        if (Object.keys(isValid).length !== 0) {
            formik.setTouched(isValid);
            return;
        }

        if (!stripe || !elements) {
            return;
        }

        try {
            setPaymentLoading(true)
            const { data } = await axios.post(`${VITE_BACKEND_BASEURL}/payment/create-payment-intent`, {
                amount: Math.round(parseFloat((totalPrice - totalPrice * 0.1) * 100)),
                currency: 'usd',
            });

            const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                },
            });

            if (error) {
                setPaymentLoading(false)
                console.log('[error]', error);
            } else {
                console.log('[PaymentIntent]', paymentIntent);
                try {
                    const userId = localStorage.getItem("userID");
                    await saveOrders(userId, cartItems, (totalPrice - totalPrice * 0.1));
                    localStorage.removeItem(`cart_${userId}`);
                    await removeCartFromServer(userId);
                    navigate('/orderConfirm');
                } catch (error) {
                    console.log("Error while purchase:", error);
                }
            }
        } catch (error) {
            console.error("Error processing payment:", error);
        }
    };

    const cardStyle = {
        style: {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
    };
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
            navigate("/cart/")
            console.error('Error fetching cart products:', error);
        }
    };


    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await checkAuth(localStorage.getItem("token"))
            } catch (error) {
                navigate("/login")
            }
        }
        verifyAuth()
        fetchCartProducts();
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        calculateTotal(cartItems);
    }, [cartItems]);


    const calculateTotal = (cartItems) => {
        const price = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(price?.toFixed(2));
    };


    return (
        <div className='checkout-container'>
            <div className="logo-container">
                <img src={logo} alt="" onClick={() => navigate('/')} />
            </div>
            {loading ? (
                <div className="login-loader"></div>
            ) : (
                <div className="checkout-content">
                    <div className="userInfo">
                        <form action="" onSubmit={formik.handleSubmit}>
                            <div className="contact-section">
                                <div className="contact">
                                    <label htmlFor="Contact">Contact</label>
                                    <div className="field">
                                        <input type="email" name='email' className='full-width' placeholder='Email'
                                            onChange={formik.handleChange} value={formik.values.email}
                                            style={{ borderColor: (formik.touched.email && formik.errors.email ? "red" : "") }}
                                        />
                                        {formik.touched.email && formik.errors.email && <div className='error'>{formik.errors.email}</div>}
                                    </div>
                                </div>

                                <div className='email-checkbox'>
                                    <input type="checkbox" defaultChecked />
                                    <span>Email me with news and offers</span>
                                </div>

                                <div className="name-row">
                                    <div className="field">
                                        <input type="text" name='firstName' placeholder='First name' className="first-name"
                                            onChange={formik.handleChange} value={formik.values.firstName}
                                            style={{ borderColor: (formik.touched.firstName && formik.errors.firstName ? "red" : "") }}
                                        />
                                        {formik.touched.firstName && formik.errors.firstName && <div className='name-error'>{formik.errors.firstName}</div>}
                                    </div>

                                    <div className="field">

                                        <input type="text" name='lastName' placeholder='Last name' className="last-name"
                                            onChange={formik.handleChange} value={formik.values.lastName}
                                            style={{ borderColor: (formik.touched.lastName && formik.errors.lastName ? "red" : "") }}
                                        />
                                        {formik.touched.lastName && formik.errors.lastName && <div className='name-error'>{formik.errors.lastName}</div>}
                                    </div>
                                </div>

                                <div className="field">
                                    <input type="text" placeholder='Address' className="full-width" name='address'
                                        onChange={formik.handleChange} value={formik.values.address}
                                        style={{ borderColor: (formik.touched.address && formik.errors.address ? "red" : "") }} />
                                    {formik.touched.address && formik.errors.address && <div className='address-error'>{formik.errors.address}</div>}
                                </div>

                                <div className="address-row">
                                    <div className="field">
                                        <input type="text" placeholder='City' className="city" name='city'
                                            onChange={formik.handleChange} value={formik.values.city}
                                            style={{ borderColor: (formik.touched.city && formik.errors.city ? "red" : "") }}
                                        />
                                        {formik.touched.city && formik.errors.city && <div className='address-error'>{formik.errors.city}</div>}
                                    </div>
                                    <div className="field">
                                        <select
                                            className="state"
                                            name="state"
                                            value={formik.values.state}
                                            onChange={formik.handleChange}
                                            style={{ borderColor: (formik.touched.state && formik.errors.state ? "red" : "") }}
                                        >
                                            <option value="" label="Select" disabled />
                                            <option value="Gujrat" label="Gujrat" />
                                            <option value="Delhi" label="Delhi" />
                                            <option value="Surat" label="Surat" />
                                        </select>
                                        {formik.touched.state && formik.errors.state ? (
                                            <div className='address-error'>{formik.errors.state}</div>
                                        ) : null}
                                    </div>
                                    <div className="field">
                                        <input type="text" placeholder='Zip code' className="zipcode" name='zipcode'
                                            onChange={formik.handleChange} value={formik.values.zipcode}
                                            style={{ borderColor: (formik.touched.zipcode && formik.errors.zipcode ? "red" : "") }}
                                        />
                                        {formik.touched.zipcode && formik.errors.zipcode && <div className='address-error'>{formik.errors.zipcode}</div>}
                                    </div>
                                </div>


                            </div>

                            <div className="paynow-section">
                                <div className="paynow-btn-container">
                                    <div className="checkout-form-content">
                                        <div className="field">
                                            <label htmlFor="cardNumber">Card Number</label>
                                            <CardNumberElement id="cardNumber" options={cardStyle} className="input-element" />
                                            {cardErrors.cardNumber && <div className="payment-error">{cardErrors.cardNumber}</div>}
                                        </div>
                                        <div className="field">
                                            <label htmlFor="cardExpiry">Expiration Date</label>
                                            <CardExpiryElement id="cardExpiry" options={cardStyle} className="input-element" />
                                            {cardErrors.cardExpiry && <div className="payment-error">{cardErrors.cardExpiry}</div>}

                                        </div>
                                        <div className="field">
                                            <label htmlFor="cardCvc">CVV</label>
                                            <CardCvcElement id="cardCvc" options={cardStyle} className="input-element" />
                                            {cardErrors.cardCvc && <div className="payment-error">{cardErrors.cardCvc}</div>}

                                        </div>
                                        <div className="total-amount">
                                            <h3>Total: ${(totalPrice - totalPrice * 0.1).toFixed(2)}</h3>
                                        </div>
                                        <button className='paynow-button' type="submit" disabled={!stripe}>
                                            {paymentLoading ? <span className="button-loader"></span> : `Pay ${(totalPrice - totalPrice * 0.1).toFixed(2)}`}
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>

                    <div className="product-summary" >
                        {cartItems.map((product) => (
                            <div className="product-sum-container" key={product._id}>
                                <div className="checkout-product-details">
                                    <div className="checkout-product-img">
                                        <img src={product.thumbnail} alt="loading" />
                                        <span className="checkout-product-quantity">{product.quantity}</span>
                                    </div>
                                    <div className="checkout-product-info">
                                        <div className="checkout-product-title">
                                            <span>{product.title}</span>
                                        </div>
                                        <div className="checkout-product-price">
                                            <span>${(product.price * product.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="checkout-product-total-container">
                            <div className="subtotal">
                                <span>Subtotal</span>
                                <span className="subtotal-price">${totalPrice}</span>
                            </div>
                            <div className="checkout-total-content">
                                <span>Total</span>
                                <span className="checkout-total-price">
                                    <span className="USD">USD</span> {(totalPrice - totalPrice * 0.1).toFixed(2)}
                                </span>
                            </div>
                            <div className="checkout-border"></div>
                        </div>
                    </div>
                </div>
            )}


        </div >
    );
}


export default CheckoutPage;
