import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileIcon from '../assets/profile.svg';
import SearchIcon from '../assets/search.svg';
import ShoppingCartIcon from '../assets/shoppingCart.svg';
import logo from '../assets/logo.png';
import '../styles/Navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    const handleAuthChange = () => {
      const updatedRole = localStorage.getItem("userRole");
      setUserRole(updatedRole);
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  return (
    <div className='navbar'>
      <div className="container">
        <h2>
          <a onClick={() => navigate("/")}>
            <img className='navLogo' src={logo} alt="Logo" />
          </a>
        </h2>
        <div className="header">
          <nav>
            <ul>
              <li>
                <a className='navLink' onClick={() => navigate("/")}>Home</a>
              </li>
              <li>
                <a className='navLink' onClick={() => navigate("/")}>About</a>
              </li>
              {userRole !== 'admin' && <>
                <li>
                  <a className='navLink' onClick={() => navigate("/collections/all?showProducts=true")}  >Shop Now</a>
                </li>
                <div className="down_icon">
                  <svg
                    aria-hidden="false"
                    focusable="false"
                    role="presentation"
                    className="icon icon-arrow"
                    viewBox="0 0 1024 1024"
                    width="12"
                    height="12"
                  >
                    <path d="M926.553 256.428c25.96-23.409 62.316-19.611 83.605 7.033 20.439 25.582 18.251 61.132-6.623 83.562l-467.01 421.128c-22.547 20.331-56.39 19.789-78.311-1.237L19.143 345.786c-24.181-23.193-25.331-58.79-4.144-83.721 22.077-25.978 58.543-28.612 83.785-4.402l400.458 384.094 427.311-385.33z"></path>
                  </svg>
                </div>
              </>}
              <li>
                <a className='navLink' href="/">Blogs</a>
              </li>
            </ul>
          </nav>

          <div className="header-icons">
            <img src={ProfileIcon} alt="Profile" width="24" height="24" onClick={() => navigate('/login')} />
            {userRole !== 'admin' && <>
              <img src={SearchIcon} alt="Search" width="24" height="24" />
              <img src={ShoppingCartIcon} alt="Shopping Cart" width="24" height="24" onClick={() => navigate(`/cart`)} />
            </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
