import React, { useState, useEffect } from 'react';
import '../../styles/ProductList.scss';

const ProductList = ({ products, onEdit, onDelete }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (products.length > 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [products]);

    return (
        <>
            {loading ? (
                <div className="content-loader"></div>
            ) : (
                <div className="product-list">
                    <table className="product-table">
                        <thead className="table-head">
                            <tr>
                                <th className="table-header">Title</th>
                                <th className="table-header">Image</th>
                                <th className="table-header">Description</th>
                                <th className="table-header">Price</th>
                                <th className="table-header">Category</th>
                                <th className="table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {products.map((product) => (
                                <tr key={product._id} className="table-row">
                                    <td className="table-cell">{product.title}</td>
                                    <td className="table-cell"><img className="product-image" src={product.thumbnail} alt={product.title} /></td>
                                    <td className="table-cell">{product.description}</td>
                                    <td className="table-cell">${product.price}</td>
                                    <td className="table-cell">{product.category}</td>
                                    <td className="table-cell">
                                        <button className="edit-button" onClick={() => onEdit(product)}>Edit</button>
                                        <button className="delete-button" onClick={() => onDelete(product._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default ProductList;
