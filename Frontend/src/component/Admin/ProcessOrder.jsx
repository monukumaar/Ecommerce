import React, { Fragment, useEffect, useState } from "react";
import "./processOrder.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../MetaData.jsx";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader/Loader";
import { Link } from "react-router-dom";
import { FaList } from "react-icons/fa";
import { getOrderDetails, clearErrors, updateOrder } from "../../actions/orderAction";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";

const ProcessOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { error: updateError, isUpdated } = useSelector((state) => state.order);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (error) {
      setNotification({ message: `❌ ${error}`, type: "error" });
      dispatch(clearErrors());
    }

    if (updateError) {
      setNotification({ message: `❌ ${updateError}`, type: "error" });
      dispatch(clearErrors());
    }

    if (isUpdated) {
      setNotification({ message: "✅ Order Updated Successfully", type: "success" });
      dispatch({ type: UPDATE_ORDER_RESET });
      navigate("/admin/orders");
    }

    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }

    dispatch(getOrderDetails(orderId));
  }, [dispatch, error, updateError, isUpdated, navigate, orderId, notification.message]);

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault();

    if (!status) {
      setNotification({ message: "❌ Please select a status", type: "error" });
      return;
    }

    const myForm = new FormData();
    myForm.set("status", status);
    dispatch(updateOrder(orderId, myForm));
  };

  return (
    <Fragment>
      <MetaData title="Process Order - Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="processOrderContainer">
          {notification.message && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          {loading ? (
            <Loader />
          ) : (
            <div
              className={`processOrderPage ${
                order?.orderStatus === "Delivered" ? "delivered" : ""
              }`}
            >
              <div className="orderDetailsSection">
                <h2>Shipping Info</h2>
                <div className="orderDetailsContainerBox">
                  <div>
                    <p>Name:</p>
                    <span>{order?.user?.name || "N/A"}</span>
                  </div>
                  <div>
                    <p>Phone:</p>
                    <span>{order?.shippingInfo?.phoneNo || "N/A"}</span>
                  </div>
                  <div>
                    <p>Address:</p>
                    <span>
                      {order?.shippingInfo
                        ? `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <h2>Payment</h2>
                <div className="orderDetailsContainerBox">
                  <div>
                    <p
                      className={
                        order?.paymentInfo?.status === "succeeded"
                          ? "greenColor"
                          : "redColor"
                      }
                    >
                      {order?.paymentInfo?.status === "succeeded" ? "PAID" : "NOT PAID"}
                    </p>
                  </div>
                  <div>
                    <p>Amount:</p>
                    <span>₹{order?.totalPrice || "0"}</span>
                  </div>
                </div>

                <h2>Order Status</h2>
                <div className="orderDetailsContainerBox">
                  <div>
                    <p
                      className={
                        order?.orderStatus === "Delivered" ? "greenColor" : "redColor"
                      }
                    >
                      {order?.orderStatus || "N/A"}
                    </p>
                  </div>
                </div>

                <h2>Your Cart Items</h2>
                <div className="orderItemsContainer">
                  {order?.orderItems?.length > 0 ? (
                    order.orderItems.map((item) => (
                      <div key={item.product}>
                        <img src={item.image} alt="Product" />
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                        <span>
                          {item.quantity} X ₹{item.price} ={" "}
                          <b>₹{item.price * item.quantity}</b>
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>No items in cart</p>
                  )}
                </div>
              </div>
              <div
                className={`updateOrderSection ${
                  order?.orderStatus === "Delivered" ? "hidden" : ""
                }`}
              >
                <form
                  className="updateOrderForm"
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h1>Process Order</h1>
                  <div className="input-group">
                    <FaList />
                    <select onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Choose Status</option>
                      {order?.orderStatus === "Processing" && (
                        <option value="Shipped">Shipped</option>
                      )}
                      {order?.orderStatus === "Shipped" && (
                        <option value="Delivered">Delivered</option>
                      )}
                    </select>
                  </div>
                  <button
                    id="updateOrderBtn"
                    type="submit"
                    disabled={loading || !status}
                    className={loading  || !status ? "disabled" : ""}
                  >
                    Process
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;