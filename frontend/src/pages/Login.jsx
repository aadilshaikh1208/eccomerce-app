import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth, logout } from '../services/authServices';
import { mergeCarts } from '../services/cartServices';
import { getUserById } from '../services/userServices';
import adminImg from '../assets/adminImg.png'
import axios from 'axios';
import '../styles/Login.scss';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [heading, setHeading] = useState("")
    const navigate = useNavigate();
    const VITE_BACKEND_BASEURL = 'http://3.91.47.62:4000/api'

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await checkAuth(localStorage.getItem("token"));
                const userDetails = await getUserById(localStorage.getItem("userID"))
                setModalIsOpen(true);
                setUserDetails(userDetails);
                setHeading(userDetails.role)

            } catch (error) {
                navigate('/login')
            }
        };
        verifyAuth();
    }, [navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [])

    const handleModalClose = () => {
        setModalIsOpen(false);
        if (userDetails && userDetails.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await axios.post(`${VITE_BACKEND_BASEURL}/auth/login`, credentials, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200 && response.data.token) {
                const userId = response.data.user._id;
                localStorage.setItem("userID", userId);
                localStorage.setItem("userRole", response.data.role);
                localStorage.setItem("token", response.data.token);

                window.dispatchEvent(new Event("authChange"))
                await updateCartForUser(userId);

                setTimeout(() => {
                    navigate(response.data.role === 'admin' ? '/admin' : '/');
                }, 100);

            } else {
                console.error('Token not received');
                setLoading(false)
            }
        } catch (error) {
            alert("Invalid Credentials!")
            console.error('Login failed', error);
            setLoading(false)
        }
    };


    const updateCartForUser = async (userId) => {
        const guestCart = JSON.parse(localStorage.getItem('cart_guest')) || [];
        console.log("GUEST: ", guestCart);

        if (guestCart.length > 0) {
            try {
                const formattedGuestCart = guestCart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }));

                await mergeCarts(userId, formattedGuestCart);

                let currentCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];

                guestCart.forEach((guestItem) => {
                    const userItemIndex = currentCart.findIndex((item) => item.productId === guestItem.productId);
                    if (userItemIndex > -1) {
                        currentCart[userItemIndex].quantity += guestItem.quantity;
                    } else {
                        currentCart.push(guestItem);
                    }
                });

                localStorage.setItem(`cart_${userId}`, JSON.stringify(currentCart));
                localStorage.removeItem('cart_guest');
            } catch (error) {
                console.error('Error merging guest cart with user cart:', error);
            }
        }
    };

    useEffect(() => {
        const overlay = document.getElementById('overlay');

        if (modalIsOpen) {
            overlay.style.display = "block";
            document.body.style.overflow = 'hidden';
        } else {
            overlay.style.display = "none";
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [modalIsOpen]);

    const handleUserLogout = async () => {
        setLogoutLoading(true)
        try {
            const response = await logout();
            if (response.status === 200) {
                localStorage.removeItem("userID")
                localStorage.removeItem("userRole")
                localStorage.removeItem("token")
                window.dispatchEvent(new Event("authChange"))
                navigate("/");
            }
        } catch (error) {
            console.error("Error while logging out: ", error);
        }
        finally {
            setLogoutLoading(false)
        }

    }



    return (
        <div className='login-container'>
            <div id="overlay"></div>
            {modalIsOpen && (
                <div className="modal-container">
                    <div className="modal-content">
                        <button className='close-button' onClick={() => handleModalClose()}>×</button>
                        <img src={adminImg} alt="" className='user-img' />
                        <h2>{heading === "admin" ? "Admin Details" : "User Details"}</h2>
                        <p>First Name: {userDetails.firstName}</p>
                        <p>Last Name: {userDetails.lastName}</p>
                        <p>Email: {userDetails.email}</p>
                        {localStorage.getItem("userRole") !== "admin" &&

                            <button className='see-orders' onClick={() => { navigate('/viewOrders') }}>Orders</button>
                        }
                        <button className='user-logout' onClick={() => { handleUserLogout() }}>
                            {logoutLoading ? <span className="button-loader"></span> : 'Logout'}
                        </button>
                    </div>
                </div>
            )}
            {loading ? (
                <div className='login-loader'></div>
            ) : (
                <div className="login-content">
                    <div className="login-heading">
                        <h1>Login</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="login-inputs">
                            <div>
                                <label htmlFor="Email">Email</label><br />
                                <input type="email" id="Email" name="email" value={credentials.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <label htmlFor="Password">Password</label> <br />
                                <input type="password" id="Password" name="password" value={credentials.password} onChange={handleChange} required />
                            </div>
                            <a onClick={() => navigate("/login")}>Recover Password</a>
                        </div>
                        <div className="login-buttons">
                            <button className='login-signIn-button' type='submit'>
                                SIGN IN
                            </button>
                            <a onClick={() => navigate("/register")}>Create account</a>
                        </div>
                    </form>
                </div>
            )}

        </div>
    );
};

export default Login;
