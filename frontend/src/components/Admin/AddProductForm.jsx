import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ProductForm.scss';

const AddProductForm = ({ onAdd, categories }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [rating, setRating] = useState('');
  const [stock, setStock] = useState('');
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const navigate = useNavigate();

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory === 'new') {
      setIsAddingNewCategory(true);
      setCategory('');
    } else {
      setIsAddingNewCategory(false);
      setCategory(selectedCategory);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      title,
      description,
      price: parseFloat(price),
      discountPercentage: parseFloat(discountPercentage),
      rating: parseFloat(rating),
      stock: parseInt(stock, 10),
      minimumOrderQuantity: parseInt(minimumOrderQuantity, 10),
      category: isAddingNewCategory ? newCategory : category,
      thumbnail,
    };
    onAdd(newProduct);

    setTitle('');
    setDescription('');
    setPrice('');
    setDiscountPercentage('');
    setRating('');
    setStock('');
    setMinimumOrderQuantity('');
    setCategory('');
    setThumbnail('');
    setNewCategory('');
    setIsAddingNewCategory(false);
    navigate('/admin');
  };

  return (
    <div className="product-container">
      <h2 className="product-heading">Add Product</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Discount Percentage:</label>
          <input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Minimum Order Quantity:</label>
          <input
            type="number"
            value={minimumOrderQuantity}
            onChange={(e) => setMinimumOrderQuantity(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select
            value={isAddingNewCategory ? 'new' : category}
            onChange={handleCategoryChange}
            required
          >
            <option value="" disabled>Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="new">Add New</option>
          </select>
          {isAddingNewCategory && (
            <div className="form-group">
              <label>New Category:</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Thumbnail URL:</label>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="product-button">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;
