import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Cart.scss'
const EmptyShoppingCart = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div className="center-container">
                <div className="cart__empty" data-empty-message="">
                    <span className="cart__title">Shopping Cart</span>
                    <p>Your cart is empty</p>
                    <button className="cart__empty-button continue-shopping-button" onClick={() => navigate(`/collections/all?showProducts=true`)}>Continue Shopping</button>
                </div>
            </div>
        </div>
    )
}

export default EmptyShoppingCart