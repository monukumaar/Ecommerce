
import { useState, useEffect } from 'react';
import axios from 'axios';
import { loadUser } from './actions/userAction.js';
import Header from './component/layout/Header/Header';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home.jsx';
import ProductDetails from './component/Product/ProductDetails.jsx';
import Products from './component/Product/Products';
import Search from './component/Product/Search.jsx';
import LoginSignUp from './component/User/LoginSignUp.jsx';
import PublicRoute from './component/Route/PublicRoute.jsx';
import ProtectedRoute from './component/Route/ProtectedRoute.jsx';
import { useDispatch, useSelector } from 'react-redux';
import store from './store.js';
import UserOptions from './component/layout/Header/UserOptions.jsx';
import Profile from './component/User/Profile.jsx';
import UpdateProfile from './component/User/UpdateProfile.jsx';
import Loader from './component/layout/Loader/Loader.jsx';
import UpdatePassword from './component/User/UpdatePassword.jsx';
import ForgotPassword from './component/User/ForgotPassword.jsx';
import ResetPassword from './component/User/ResetPassword.jsx';
import Cart from './component/Cart/Cart.jsx';
import Shipping from './component/Cart/Shipping.jsx';
import MyOrders from './component/Order/MyOrders.jsx';
import ConfirmOrder from './component/Cart/ConfirmOrder.jsx';
import OrderDetails from './component/Order/OrderDetails.jsx';
import Payment from './component/Cart/Payment.jsx';
import OrderSuccess from './component/Cart/OrderSuccess.jsx';
import Dashboard from './component/Admin/Dashboard.jsx';
import ProductList from './component/Admin/ProductList.jsx';
import NewProduct from './component/Admin/NewProduct.jsx';
import UpdateProduct from './component/Admin/UpdateProduct.jsx';
import OrderList from './component/Admin/OrderList.jsx';
import UpdateUser from './component/Admin/UpdateUser.jsx';
import UsersList from './component/Admin/UsersList.jsx';
import ProcessOrder from './component/Admin/ProcessOrder.jsx';
import ProductReviews from './component/Admin/ProductReviews.jsx';
import Contact from './component/layout/Contact/Contact.jsx';
import About from './component/layout/About/About.jsx';
import NotFound from './component/layout/Not Found/NotFound.jsx';


function App() {
  const dispatch = useDispatch();
  const { loading, isAuthenticated, user } = useSelector((state) => state.user); // Add user here

  const [razorpayApiKey, setRazorpayApiKey] = useState("");


  const fetchRazorpayApiKey = async () => {
    try {
      const config = {
        withCredentials: true, // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json', // Optional, but good practice
          // Add Authorization header if using token-based auth (e.g., Bearer token)
          // 'Authorization': `Bearer ${yourToken}`, // Uncomment if token is required
        },
      };

      const { data } = await axios.get(
        'http://localhost:3000/api/v1/payment/razarpayapikey', // Correct endpoint
        config
      );

      console.log('Razorpay API Key:', data);
      setRazorpayApiKey(data.razorpayApiKey)
      // return data.razorpayApiKey;
    } catch (error) {
      console.log('Error fetching Razorpay API key:', error.response?.data?.message || error.message);
      //console.log(error);

    }
  };

  useEffect(() => {
    dispatch(loadUser());

    //   fetchRazorpayApiKey();
  }, [dispatch]);
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Router>
        <Header />

        {isAuthenticated && user && <UserOptions user={user} />}


        <Routes>
          <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route path="/search" element={<Search />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginSignUp />
              </PublicRoute>
            }
          />

          <Route
            path="/account"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />

          <Route
            path="/me/update"
            element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>}
          />
          <Route
            path="/password/update"
            element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>}
          />
          <Route
            path="/password/forgot"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/password/reset/:token"
            element={<ResetPassword />}
          />
          <Route path='/cart' element={<Cart />} />
          <Route
            path='/shipping'
            element={<Shipping />}
          />

          <Route
            path="/orders"
            element={<ProtectedRoute><MyOrders /></ProtectedRoute>}
          />

          <Route
            path="/order/confirm"
            element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>}
          />
          <Route
            path="/order/:id"
            element={<ProtectedRoute><OrderDetails /></ProtectedRoute>}
          />

          <Route
            path="/process/payment"
            element={<ProtectedRoute><Payment /></ProtectedRoute>}
          />

          <Route
            path="/success"
            element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>}
          />
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute isAdmin={true}
            ><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/products"
            element={<ProtectedRoute isAdmin={true}><ProductList /></ProtectedRoute>}
          />
          <Route
            path="/admin/product"
            element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>}
          />

          <Route
            path="/admin/product/:id"
            element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>}
          />
          <Route
            path="/admin/orders"
            element={<ProtectedRoute isAdmin={true}><OrderList /></ProtectedRoute>}
          />
          <Route
            path="/admin/order/:id"
            element={<ProtectedRoute isAdmin={true}><ProcessOrder /></ProtectedRoute>}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute isAdmin={true}><UsersList /></ProtectedRoute>}
          />
          <Route
            path="/admin/reviews"
            element={<ProtectedRoute isAdmin={true}><ProductReviews /></ProtectedRoute>}
          />

          <Route
            path="/admin/user/:id"
            element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>}
          />
        <Route path="*" element={<NotFound />} />

        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;



/*
import { useEffect } from 'react';
import { loadUser } from './actions/userAction.js';
import Header from './component/layout/Header/Header';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home.jsx';
import ProductDetails from './component/Product/ProductDetails.jsx';
import Products from './component/Product/Products';
import Search from './component/Product/Search.jsx';
import LoginSignUp from './component/User/LoginSignUp.jsx';
import PublicRoute from './component/Route/PublicRoute.jsx';
import ProtectedRoute from './component/Route/ProtectedRoute.jsx';
import { useDispatch, useSelector } from 'react-redux';
import store from './store.js';
import UserOptions from './component/layout/Header/UserOptions.jsx';
import Profile from './component/User/Profile.jsx';
import UpdateProfile from './component/User/UpdateProfile.jsx';
import Loader from './component/layout/Loader/Loader.jsx';
import UpdatePassword from './component/User/UpdatePassword.jsx';
import ForgotPassword from './component/User/ForgotPassword.jsx';
import ResetPassword from './component/User/ResetPassword.jsx';

// Layout component for routes that should include Header and Footer
const MainLayout = ({ children, isAuthenticated, user }) => (
  <>
    <Header />
    {isAuthenticated && user && <UserOptions user={user} />}
    {children}
    <Footer />
  </>
);

function App() {
  const dispatch = useDispatch();
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    store.dispatch(loadUser());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout isAuthenticated={isAuthenticated} user={user}>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <MainLayout isAuthenticated={isAuthenticated} user={user}>
              <ProductDetails />
            </MainLayout>
          }
        />
        <Route
          path="/products"
          element={
            <MainLayout isAuthenticated={isAuthenticated} user={user}>
              <Products />
            </MainLayout>
          }
        />
        <Route
          path="/products/:keyword"
          element={
            <MainLayout isAuthenticated={isAuthenticated} user={user}>
              <Products />
            </MainLayout>
          }
        />
        <Route
          path="/search"
          element={
            <MainLayout isAuthenticated={isAuthenticated} user={user}>
              <Search />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginSignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/password/forgot"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/password/reset/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <MainLayout isAuthenticated={isAuthenticated} user={user}>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/me/update"
          element={
            <ProtectedRoute>
              <MainLayout isAuthenticated={isAuthenticated} user={user}>
                <UpdateProfile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/password/update"
          element={
            <ProtectedRoute>
              <MainLayout isAuthenticated={isAuthenticated} user={user}>
                <UpdatePassword />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App; */