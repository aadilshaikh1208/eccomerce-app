import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../../services/orderServices';
import { getUserById } from '../../services/userServices';
import noOrders from '../../assets/noOrders.png';
import '../../styles/OrderDetails.scss';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OrderDetails = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userID");


    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const userData = await getUserById(userId);
                setUser({
                    firstName: userData.firstName,
                    email: userData.email
                });

                const response = await fetchOrders();
                const userOrders = response.orders.filter(order => order.userId === userId);

                setOrders(userOrders);
            } catch (error) {
                console.log("Error while fetching orders: ", error);
            }
        };
        fetchUserOrders();
    }, [userId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [])


    const downloadOrderAsPDF = (order, user) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setTextColor('#873a8d');
        doc.text('Order Details', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

        const orderDate = new Date(order.orderDate);
        const formattedDate = `${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}`;
        doc.setFontSize(12);
        doc.text(`Order Date: ${formattedDate}`, 14, 30)
        doc.setFontSize(12);
        doc.text(`Name: ${user.firstName}`, 14, 40);
        doc.text(`Email: ${user.email}`, 14, 50);
        doc.text(`Order ID: ${order._id}`, 14, 60);

        const products = order.products.map(product => [
            product.category,
            product.title,
            product.price,
            product.quantity
        ]);

        doc.autoTable({
            head: [['Category', 'Title', 'Price', 'Quantity']],
            body: products,
            startY: 70,
            headStyles: { fillColor: [135, 58, 141] }
        });

        const finalY = doc.autoTable.previous.finalY;
        doc.text(`Total: $${order.totalPrice.toFixed(2)}`, 14, finalY + 20);

        doc.save(`order_${order._id}.pdf`);
    };

    return (


        <div className="order-details-container">
            <h1>Order Details</h1>
            {loading ? (
                <div className="order-loader"></div>
            ) : orders.length === 0 ? (
                <div>
                    <img src={noOrders} alt="" />
                    <p className="no-orders-message">No orders found for the user.</p>
                    <button className="order-shopNow" onClick={() => navigate("/collections/all?showProducts=true")}>Shop Now</button>
                </div>
            ) : (
                <table className="user-orders-table">
                    <thead>
                        <tr className="user-orders-table-header">
                            <th className="user-orders-table-header-cell">Order Date</th>
                            <th className="user-orders-table-header-cell">Category</th>
                            <th className="user-orders-table-header-cell">Title</th>
                            <th className="user-orders-table-header-cell">Quantity</th>
                            <th className="user-orders-table-header-cell">Thumbnail</th>
                            <th className="user-orders-table-header-cell">Total</th>
                            <th className="user-orders-table-header-cell">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <React.Fragment key={order._id}>
                                {order.products.map((product, index) => (
                                    <tr key={`${order._id}-${product.title}-${index}`} className="user-orders-table-row">
                                        {index === 0 && (
                                            <td rowSpan={order.products.length} className="user-orders-table-cell user-orders-table-date">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </td>
                                        )}
                                        <td className="user-orders-table-cell user-orders-table-category">{product.category}</td>
                                        <td className="user-orders-table-cell user-orders-table-title">{product.title}</td>
                                        <td className="user-orders-table-cell user-orders-table-quantity">{product.quantity}</td>
                                        <td className="user-orders-table-cell user-orders-table-thumbnail">
                                            <img src={product.thumbnail} alt={product.title} width="50" className="product-thumbnail" />
                                        </td>
                                        {index === 0 && (
                                            <>
                                                <td rowSpan={order.products.length} className="user-orders-table-cell user-orders-table-actions">${order.totalPrice.toFixed(2)}</td>
                                                <td rowSpan={order.products.length} className="user-orders-table-cell user-orders-table-actions">
                                                    <button className='downloadOrder' onClick={() => downloadOrderAsPDF(order, user)}>Download PDF</button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderDetails;
