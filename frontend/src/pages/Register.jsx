import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userSignUp } from '../services/authServices';
import { mergeCarts } from '../services/cartServices';
import '../styles/Register.scss';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const credentials = {
            firstName,
            lastName,
            email,
            password,
        };

        try {
            const response = await userSignUp(credentials);
            if (response && response.token) {
                const userId = response.newUser._id
                console.log(userId)
                localStorage.setItem("userID", userId)
                localStorage.setItem("userRole", response.role);
                localStorage.setItem("token", response.token)
                // const role = response.role
                await updateCartForUser(userId)
                navigate('/');
            } else {
                setErrorMessage('Registration failed. Please try again.');
            }
        } catch (error) {
            setErrorMessage('An error occurred during registration. Please try again.');
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
    }



    return (
        <div className='register-container'>
            <div className="register-content">
                <div className="register-heading">
                    <p>Register your account</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="register-inputs">
                        <div>
                            <label htmlFor="Firstname">First Name</label><br />
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="Lastname">Last Name</label><br />
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="Email">Email</label><br />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="Password">Password</label><br />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <div className="register-buttons">
                        <button className='register-signUp-button' type='submit'>SUBMIT</button>
                        <a onClick={() => navigate("/")}>Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
