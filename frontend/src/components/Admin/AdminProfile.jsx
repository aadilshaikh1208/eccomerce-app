import React, { useEffect, useState } from 'react';
import adminImg from '../../assets/adminImg.png';
import { fetchAdminDetails } from '../../services/authServices';
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminProfile.scss';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const data = await fetchAdminDetails(localStorage.getItem("userID"));
        setAdminData(data);
      } catch (error) {
        navigate('/login');
      } finally {
        setLoading(false)
      }
    };

    fetchAdminData();
  }, [navigate]);

  return (
    <>
      {loading ? (
        <div className="content-loader"></div>
      ) : (
        <div className="admin-profile">
          <div className="admin-profile-header">Admin Profile</div>
          <img src={adminImg} alt="Admin" />
          <p><strong>First Name:</strong> {adminData.firstName}</p>
          <p><strong>Last Name:</strong> {adminData.lastName}</p>
          <p><strong>Email:</strong> {adminData.email}</p>
        </div>
      )}
    </>
  );
};

export default AdminProfile;
