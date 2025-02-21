import React, { useEffect, useState } from 'react';
import { checkAuth } from '../services/authServices';
import { useNavigate } from 'react-router-dom';
import '../styles/OrderConfirm.scss'

const OrderConfirm = () => {
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [])

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await checkAuth(localStorage.getItem("token"));
                const role = response.role;
                if (role === 'admin') {
                    navigate('/')
                } else {
                    // navigate('/');
                }
            } catch (error) {
                navigate('/login')
            }
        };
        verifyAuth();
    }, [navigate]);

    return (
        <div className='orderConfirm-container'>
            {loading ? (
                <div className="login-loader"></div>
            ) : (
                <>
                    <div className="orderConfirm-image">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 40 40">
                            <path fill="#bae0bd" d="M20,38.5C9.799,38.5,1.5,30.201,1.5,20S9.799,1.5,20,1.5S38.5,9.799,38.5,20S30.201,38.5,20,38.5z"></path>
                            <path fill="#5e9c76" d="M20,2c9.925,0,18,8.075,18,18s-8.075,18-18,18S2,29.925,2,20S10.075,2,20,2 M20,1 C9.507,1,1,9.507,1,20s8.507,19,19,19s19-8.507,19-19S30.493,1,20,1L20,1z"></path>
                            <path fill="none" stroke="#fff" strokeWidth="2" d="M11 20L17 26 30 13"></path>
                        </svg>
                    </div>
                    <div className="orderConfirm-message">
                        <h2>Thank You for Your Purchase!</h2>
                    </div>
                    <button className="continueShopping-button" onClick={() => navigate('/collections/all?showProducts=true')}>Continue Shopping</button>
                </>
            )}
        </div>
    );
}

export default OrderConfirm;
