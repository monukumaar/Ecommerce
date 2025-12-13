import React, { useEffect, useState } from "react";
import "./orderDetails.css";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../MetaData";
import { Link, useParams } from "react-router-dom";
import { getOrderDetails, clearErrors } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";

const OrderDetails = () => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  console.log(order);
  
  const dispatch = useDispatch();
  const { id } = useParams();
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
      dispatch(clearErrors());
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, error, id]);

  return (
    <>
      <MetaData title="Order Details" />
      {loading ? (
        <Loader />
      ) : (
        <div className="orderDetailsPage">
          {alertMessage && (
            <div
              className={`alert ${alertType === "error" ? "alert-error" : "alert-success"}`}
              style={{
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: alertType === "error" ? "#f8d7da" : "#d4edda",
                color: alertType === "error" ? "#721c24" : "#155724",
                borderRadius: "4px",
                textAlign: "center",
              }}
            >
              {alertMessage}
            </div>
          )}
          <div className="orderDetailsContainer">
            <h1 style={{ marginBottom: "10px" }}>
              Order #{order && order._id}
            </h1>
            <h2 style={{ marginBottom: "10px" }}>Shipping Info</h2>
            <div className="orderDetailsContainerBox">
              <div>
                <p>Name:</p>
                <span>{order.user && order.user.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>
                  {order.shippingInfo && order.shippingInfo.phoneNo}
                </span>
              </div>
              <div>
                <p>Address:</p>
                <span>
                  {order.shippingInfo &&
                    `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                </span>
              </div>
            </div>
            <h2 style={{ marginBottom: "10px" }}>Payment</h2>
            <div className="orderDetailsContainerBox">
              <div>
                <p
                  className={
                    order.paymentInfo &&
                    order.paymentInfo.status === "succeeded"
                      ? "greenColor"
                      : "redColor"
                  }
                >
                  {order.paymentInfo &&
                  order.paymentInfo.status === "succeeded"
                    ? "PAID"
                    : "NOT PAID"}
                </p>
              </div>
              <div>
                <p>Amount:</p>
                <span>{order.totalPrice && order.totalPrice}</span>
              </div>
            </div>
            <h2 style={{ marginBottom: "10px" }}>Order Status</h2>
            <div className="orderDetailsContainerBox">
              <div>
                <p
                  className={
                    order.orderStatus && order.orderStatus === "Delivered"
                      ? "greenColor"
                      : "redColor"
                  }
                >
                  {order.orderStatus && order.orderStatus}
                </p>
              </div>
            </div>
          </div>
          <div className="orderDetailsCartItems">
            <h2 style={{ marginBottom: "10px" }}>Order Items:</h2>
            <div className="orderDetailsCartItemsContainer">
              {order.orderItems &&
                order.orderItems.map((item) => (
                  <div key={item.product}>
                    <img src="https://media.istockphoto.com/id/465485415/photo/blue-t-shirt-clipping-path.jpg?b=1&s=170667a&w=0&k=20&c=5CFvNa8H6Fj51FvOOTCvILXcfiYuP0xd2EY-XkKX13M=" alt={item.name || "Product"} />
                    <Link to={`/product/${item.product}`}>
                      {item.name}
                    </Link>{" "}
                    <span>
                      {item.quantity} X ₹{item.price} ={" "}
                      <b>₹{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetails;