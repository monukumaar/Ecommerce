import React, { Fragment, useEffect, useState } from "react";
import "./orderList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../MetaData";
import Sidebar from "./Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  deleteOrder,
  getAllOrders,
  clearErrors,
} from "../../actions/orderAction";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, orders } = useSelector((state) => state.allOrders);
  const { error: deleteError, isDeleted } = useSelector((state) => state.order);
  const [notification, setNotification] = useState({ message: "", type: "" });

  // console.log(orders);
  // console.log(isDeleted, deleteError);



  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
    console.log(isDeleted, deleteError);

  };

  // Fetch users on mount
  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);


  useEffect(() => {
    if (error) {
      setNotification({ message: `❌ ${error}`, type: "error" });
      dispatch(clearErrors());
    }

    if (deleteError) {
      setNotification({ message: `❌ ${deleteError}`, type: "error" });
      dispatch(clearErrors());
    }

    if (isDeleted) {
      setNotification({ message: "✅ Order Deleted Successfully", type: "success" });
      dispatch(getAllOrders());
      dispatch({ type: DELETE_ORDER_RESET });
    }

  }, [dispatch, error, deleteError, isDeleted]);

  // Notification auto-clear ke liye alag useEffect
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification.message]);

  return (
    <Fragment>
      <MetaData title="ALL ORDERS - Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="orderListContainer">
          {notification.message && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          <h1 id="orderListHeading">ALL ORDERS</h1>
          <table className="orderListTable">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Status</th>
                <th>Items Qty</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td className={item.orderStatus === "Delivered" ? "greenColor" : "redColor"}>
                      {item.orderStatus}
                    </td>
                    <td>{item.orderItems.length}</td>
                    <td>₹{item.totalPrice}</td>
                    <td>
                      <Link to={`/admin/order/${item._id}`} className="action-link">
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => deleteOrderHandler(item._id)}
                        className="action-button delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default OrderList;