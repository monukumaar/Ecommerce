



import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../actions/userAction';
import Loader from '../layout/Loader/Loader';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Logout component mounted: Dispatching logout action.');
      dispatch(logout());
    } else if (!loading && !isAuthenticated) {
      console.log('Logout successful. Redirecting to /login.');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 500);
    }
  }, [dispatch, loading, isAuthenticated, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {loading ? (
        <Loader />
      ) : (
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Logging Out...</h2>
          <p className="text-gray-600">Please wait while we log you out.</p>
        </div>
      )}
    </div>
  );
};

export default Logout;