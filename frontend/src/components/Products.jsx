import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts } from '../redux/ProductSlice'
import { useNavigate } from 'react-router-dom'
import '../styles/Products.scss'

const Products = () => {

  const navigate = useNavigate()
  const { products, loading, error } = useSelector((state) => state.products)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    return (
      <>
        {[...Array(fullStars)].map((_, index) =>
          (<svg style={{ margin: "4px" }} key={`full-${index}`} xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 24 24" fill="#F7AB1E"> <path d="M12 .587l3.668 7.431 8.214 1.192-5.941 5.796 1.402 8.181L12 18.897l-7.343 3.866 1.402-8.181-5.941-5.796 8.214-1.192z" /> </svg>))}
        {halfStars === 1 && (<svg style={{ margin: "4px" }} xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 24 24" fill="#F7AB1E"> <defs> <linearGradient id="halfGrad"> <stop offset="50%" stopColor="#F7AB1E" /> <stop offset="50%" stopColor="#e0e0e0" /> </linearGradient> </defs> <path d="M12 .587l3.668 7.431 8.214 1.192-5.941 5.796 1.402 8.181L12 18.897l-7.343 3.866 1.402-8.181-5.941-5.796 8.214-1.192z" fill="url(#halfGrad)" /> </svg>)}
        {[...Array(emptyStars)].map((_, index) => (<svg key={`empty-${index}`} xmlns="http://www.w3.org/2000/svg" width="17" height="20" viewBox="0 0 24 24" fill="#e0e0e0"> <path d="M12 .587l3.668 7.431 8.214 1.192-5.941 5.796 1.402 8.181L12 18.897l-7.343 3.866 1.402-8.181-5.941-5.796 8.214-1.192z" /> </svg>))} </>);
  };
  const handleShopNow = (id) => {
    navigate(`/collections/all/product/${id}`);
  };

  return (
    <div className='products-section'>
      {loading && <div className='loader'></div>}
      {error && <p>Error: {error}</p>}
      <div className='products-grid'>
        {products.map((product) => (
          <div className='product-card' key={product._id} onClick={() => handleShopNow(product._id)}>
            <div
              className='product-card__image'
              style={{ backgroundImage: `url(${product.thumbnail})` }}
              title={product.title}
            >
              <div className='shop-now-mob'>
                <button className='product-button'>Shop Now</button>
              </div>
            </div>
            <div className='product-card__image-wrapper'>
              <a href={product.link} className='product-card__image__link'>
                <span className='product-status-flag'>Sale {product.discountPercentage}% OFF</span>
              </a>
            </div>

            <div className='product-card__info'>
              <span className='product-card__title'>
                <a href={product.link}>{product.title}</a>
              </span>
              <div className='loox-rating'>
                {renderStars(product.rating)} ({product.stock})
              </div>
              <div className='product-card__price'>
                <strike>${product.minimumOrderQuantity}.00</strike> <strong>${product.price}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products
