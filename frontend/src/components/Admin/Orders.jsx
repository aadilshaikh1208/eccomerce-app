import React, { useEffect, useState } from 'react';
import { fetchOrders } from '../../services/orderServices';
import { getUserById } from '../../services/userServices';
import '../../styles/Orders.scss';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const response = await fetchOrders();
                const orders = response.orders;

                const userPromises = orders.map(order => getUserById(order.userId));
                const userResults = await Promise.all(userPromises);
                const users = userResults.reduce((acc, user) => {
                    acc[user._id] = {
                        firstName: user.firstName,
                        email: user.email
                    };
                    return acc;
                }, {});

                setOrders(orders);
                setUsers(users);
            } catch (error) {
                console.log("Error while fetching orders: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllOrders();
    }, []);

    return (
        <div>
            {loading ? (
                <div className="content-loader"></div>
            ) : (
                <>
                    <h1>Order Details</h1>
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>User Email</th>
                                <th>Order Date</th>
                                <th>Category</th>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Thumbnail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => {
                                return order.products.map((product, index) => (
                                    <tr key={`${order._id}-${product.title}-${index}`}>
                                        {index === 0 && (
                                            <>
                                                <td rowSpan={order.products.length}>{users[order.userId]?.firstName}</td>
                                                <td rowSpan={order.products.length}>{users[order.userId]?.email}</td>
                                                <td rowSpan={order.products.length}>{new Date(order.orderDate).toLocaleDateString()}</td>
                                            </>
                                        )}
                                        <td>{product.category}</td>
                                        <td>{product.title}</td>
                                        <td>{product.price}</td>
                                        <td>{product.quantity}</td>
                                        <td>
                                            <img src={product.thumbnail} alt={product.title} width="50" />
                                        </td>
                                    </tr>
                                ));
                            })}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default Orders;
