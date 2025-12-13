import React, { useEffect, useState, Fragment } from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct, clearErrors } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction";
import { getAllUsers } from "../../actions/userAction";
import MetaData from "../MetaData.jsx";
import Sidebar from "./Sidebar";
import { useNavigate,Navigate } from "react-router-dom";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend
);

// Dynamic import for react-chartjs-2 to avoid Vite issues
const loadCharts = async () => {
  const { Doughnut, Line } = await import("react-chartjs-2");
  return { Doughnut, Line };
};

const Dashboard = ({isAdmin=false}) => {
  const dispatch = useDispatch();
  const { products, error: productsError } = useSelector((state) => state.products);
  const { orders, error: ordersError } = useSelector((state) => state.allOrders);
  const { users, error: usersError } = useSelector((state) => state.allUsers);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [charts, setCharts] = useState({ Doughnut: null, Line: null });
  // const navigate=useNavigate()
//  console.log(notification);
  

  let outOfStock = 0;
  if (Array.isArray(products)) {
    products.forEach((item) => {
      if (item.Stock === 0) {
        outOfStock += 1;
      }
    });
  }

  let totalAmount = 0;
  if (Array.isArray(orders)) {
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });
  }

  // useEffect(()=>{
  //   console.log(isAdmin);
  //   if (!isAdmin) {
  //     //console.log('Redirecting to / because not admin');
  //     return <Navigate to="/" replace />;
  //   }
  // },[])

  useEffect(() => {
    // Load charts dynamically
    loadCharts().then(({ Doughnut, Line }) => {
      setCharts({ Doughnut, Line });
    }).catch((err) => {
      setNotification({ message: `❌ Failed to load charts: ${err.message}`, type: "error" });
    });

    if (productsError) {
      setNotification({ message: `❌ ${productsError}`, type: "error" });
      dispatch(clearErrors());
    }
    if (ordersError) {
      setNotification({ message: `❌ ${ordersError}`, type: "error" });
      dispatch(clearErrors());
    }
    if (usersError) {
      setNotification({ message: `❌ ${usersError}`, type: "error" });
      dispatch(clearErrors());
    }

    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }

    dispatch(getAdminProduct());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch, productsError, ordersError, usersError, notification.message]);

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount || 0],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, (products?.length || 0) - outOfStock],
      },
    ],
  };

  const { Doughnut, Line } = charts;

  return (
    <Fragment>
      <MetaData title="Dashboard - Admin Panel" />
      <div className="dashboard">
        <Sidebar />
        <div className="dashboardContainer">
          {notification.message && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          <h1>Dashboard</h1>
          <div className="dashboardSummary">
            <div>
              <p>
                Total Amount <br /> ₹{totalAmount || 0}
              </p>
            </div>
            <div className="dashboardSummaryBox2">
              <Link to="/admin/products">
                <p>Products</p>
                <p>{products?.length || 0}</p>
              </Link>
              <Link to="/admin/orders">
                <p>Orders</p>
                <p>{orders?.length || 0}</p>
              </Link>
              <Link to="/admin/users">
                <p>Users</p>
                <p>{users?.length || 0}</p>
              </Link>
            </div>
          </div>
          {Line ? (
            <div className="lineChart">
              <Line data={lineState} />
            </div>
          ) : (
            <p>Loading Line Chart...</p>
          )}
          {Doughnut ? (
            <div className="doughnutChart">
              <Doughnut data={doughnutState} />
            </div>
          ) : (
            <p>Loading Doughnut Chart...</p>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;