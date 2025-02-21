import React, { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import EnjoySection from '../components/EnjoySection'
import HomeProduct from '../components/HomeProduct'
const Home = () => {
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
          window.scrollTo(0, 0);
      }, []);
  

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
    <div className='home'>
      <HeroSection />
      <EnjoySection />
      {userRole !== "admin" &&
        <HomeProduct />
      }
    </div>
  )
}

export default Home