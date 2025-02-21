import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import Home from './pages/Home';
import Collection from './pages/Collection';
import Navbar from './components/Navbar';
import Announcement from './components/Announcement';
import ProductPage from './pages/ProductPage';
import Footer from './components/Footer';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import EmptyShoppingCart from './pages/EmptyShoppingCart';
import OrderConfirm from './pages/OrderConfirm';
import ManageProducts from './pages/Admin/ManageProducts';
import AddProductForm from './components/Admin/AddProductForm';
import ProductList from './components/Admin/ProductList';
import EditProductForm from './components/Admin/EditProductForm';
import OrderDetails from './components/User/OrderDetails';
import CheckoutPage from './pages/CheckoutPage';
import { Elements } from '@stripe/react-stripe-js'
import './App.css';

const stripePromise = loadStripe("pk_test_51QrtGbP5FrzJ8dpoM5BXMUm67Ok4uC7yeJqMS2kopohUtaOP5OD72n0yqDsQfpUfD3PU22NTsynXXoMzUhxzTFJU00cBlpZ6em")

const App = () => {

  const checkTokenInLocalStorage = (tokenName) => {
    return localStorage.getItem(tokenName) !== null;
  };

  useEffect(() => {
    const tokenName = 'token';
    const tokenPresent = checkTokenInLocalStorage(tokenName);
    // console.log('Token present in local storage:', tokenPresent);
    if (!tokenPresent) {
      // console.log('Removing userRole and userID from localStorage');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userID');
    } else {
      console.log('UserID in localStorage:', localStorage.getItem('userID'));
    }
  }, []);

  return (

    <Router>
      <AnnouncementWrapper />
      <NavbarWrapper />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/collections/all" element={<Collection />} />
        <Route path="/collections/all/product/:id" element={<ProductPage />} />
        <Route path="/cart/:id" element={<Cart />} />
        <Route path="/cart/" element={<Cart />} />
        <Route path="/emptyCart/" element={<EmptyShoppingCart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/viewOrders" element={<OrderDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orderConfirm/" element={<OrderConfirm />} />
        <Route path="/admin/" element={<ManageProducts />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/add-product" element={<AddProductForm />} />
        <Route path="/admin/edit-product" element={<EditProductForm />} />
        <Route path="/checkout/" element={
          <Elements stripe={stripePromise}>
            <CheckoutPage />
          </Elements>
        } />
      </Routes>
      <FooterWrapper />
    </Router>
  );
};

const AnnouncementWrapper = () => {
  const location = useLocation();
  const checkoutPathMatch = location.pathname.match("checkout");
  return !checkoutPathMatch ? <Announcement /> : null;
};

const NavbarWrapper = () => {
  const location = useLocation();
  const checkoutPathMatch = location.pathname.match("checkout");
  return !checkoutPathMatch ? <Navbar /> : null;
};

const FooterWrapper = () => {
  const location = useLocation();
  const checkoutPathMatch = location.pathname.match("checkout");
  return !checkoutPathMatch ? <Footer /> : null;
};

export default App;
