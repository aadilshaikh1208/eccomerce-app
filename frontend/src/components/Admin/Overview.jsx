import React, { useState, useEffect } from 'react'
import users from '../../assets/users.png'
import products from '../../assets/products.png'
import orders from '../../assets/orders.png'
import { fetchProductsData } from '../../services/productServices'
import { getUsers } from '../../services/userServices'
import { fetchOrders } from '../../services/orderServices'
import '../../styles/Overview.scss'

const Overview = () => {
    const [totalProducts, setTotalProducts] = useState("")
    const [totalUsers, setTotalUsers] = useState('')
    const [totalOrders, setTotalOrders] = useState('')

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await fetchProductsData();
                setTotalProducts(products.length);
            } catch (error) {
                console.error("Error fetching products: ", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setTotalUsers(data.length)
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };


        const loadOrders = async () => {
            try {
                const data = await fetchOrders();
                setTotalOrders(data.orders.length)
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        loadProducts();
        fetchUsers();
        loadOrders()
    }, []);


    return (
        <div className='overview-container'>
            <div className="choices">
                <div className="choice" >
                    <img src={users} alt="" />
                    <h3>{totalUsers} Users</h3>
                </div>
                <div className="choice">
                    <img src={products} alt="" />
                    <h3>{totalProducts} Products</h3>
                </div>
                <div className="choice">
                    <img src={orders} alt="" />
                    <h3>{totalOrders} Orders</h3>
                </div>
            </div>
        </div>
    )
}

export default Overview