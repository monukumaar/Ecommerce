import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Profile.css";
import MetaData from "../MetaData.jsx";

const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }

    // Check if navigated from UpdateProfile with success state
    if (location.state?.profileUpdated) {
      setNotification({ message: location.state?.message, type: location.state?.type });
      setTimeout(() => {
        setNotification({ message: '', type: '' });
        // Clear location state to prevent re-showing message on refresh
        navigate('/account', { replace: true, state: {} });
      }, 3000);
    }
  }, [navigate, isAuthenticated, location.state]);

  return (
    <Fragment>

      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Profile" />
          {notification.message && (
                <div className={`notification ${notification.type}`}>
                  {notification.message}
                </div>
              )}
          {isAuthenticated && user ? (


            <div className="profileContainer">
            
              <div>
                <h1>My Profile</h1>
                <img src={user.avatar?.url || '/Profile.png'} alt={user.name} />
                <Link to="/me/update">Edit Profile</Link>
              </div>
              <div>
                <div>
                  <h4>Full Name</h4>
                  <p>{user.name}</p>
                </div>
                <div>
                  <h4>Email</h4>
                  <p>{user.email}</p>
                </div>
                <div>
                  <h4>Joined On</h4>
                  <p>{String(user.createdAt).slice(0, 10)}</p>
                </div>
                <div>
                  <Link to="/orders">My Orders</Link>
                  <Link to="/password/update">Change Password</Link>
                </div>
              </div>
            </div>
          ) : (
            <div>Not authenticated. Redirecting to login...</div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;