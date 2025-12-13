import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../MetaData.jsx";
import axios from "axios";
import "./payment.css";
import { createOrder, clearErrors } from "../../actions/orderAction";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payBtn = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);
  //console.log(user, error,shippingInfo,cartItems);
  

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice), // Amount in rupees
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;
    setErrorMessage(null);

    try {
      // Validate order amount
      if (!paymentData.amount || paymentData.amount < 1) {
        throw new Error("Amount must be at least ₹1");
      }
      //console.log("Order Info:", orderInfo);

      // Fetch Razorpay API key
      const config = {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      };
      const { data: keyData } = await axios.get(
        "http://localhost:3000/api/v1/razarpayapikey",
        config
      );
      //console.log("keyData:", keyData);
      const razorpayKey = keyData.razorpayApiKey;

      // Create Razorpay order
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/payment/process",
        paymentData,
        config
      );
     // console.log("orderData:", data);
      const razorpayOrder = data.order;

      // Minimal prefill data
      const prefill = {
        name: user.name,
        email: user.email,
        contact: shippingInfo.phoneNo,
      };
     // console.log("Prefill data:", prefill);

      // Load Razorpay checkout script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onerror = () => {
        setErrorMessage("Failed to load Razorpay SDK");
        alert("Failed to load Razorpay SDK");
        payBtn.current.disabled = false;
      };
      script.onload = () => {
        const options = {
          key: razorpayKey,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          order_id: razorpayOrder.id,
          handler: async function (response) {
            try {
              console.log("Payment response:", response);
              const verifyResponse = await axios.post(
                "http://localhost:3000/api/v1/payment/verify",
                {
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                },
                config
              );

              if (verifyResponse.data.success) {
                order.paymentInfo = {
                  id: response.razorpay_payment_id,
                  status: "succeeded",
                };
                dispatch(createOrder(order));
                navigate("/success");
              } else {
                setErrorMessage("Payment verification failed");
                alert("Payment verification failed");
                payBtn.current.disabled = false;
              }
            } catch (error) {
              const message = error.response?.data?.message || "Payment verification failed";
              console.log("Verification error:", error.response?.data || error);
              setErrorMessage(message);
              alert(message);
              payBtn.current.disabled = false;
            }
          },
          prefill,
        };
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", async function (response) {
          // Fetch the error response from /validate/account
          try {
            const errorResponse = await fetch(
              "https://api.razorpay.com/v1/standard_checkout/payments/validate/account?key_id=" + razorpayKey,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response.error),
              }
            );
            const errorData = await errorResponse.json();
            console.log("Razorpay validate/account error:", errorData);
            setErrorMessage(
              `Payment failed: ${errorData.error?.description || response.error.description} (Code: ${errorData.error?.code || response.error.code}, Reason: ${errorData.error?.reason || response.error.reason})`
            );
            alert(`Payment failed: ${errorData.error?.description || response.error.description}`);
          } catch (err) {
            console.log("Razorpay error details:", response.error);
            setErrorMessage(
              `Payment failed: ${response.error.description || "Unknown error"} (Code: ${response.error.code}, Reason: ${response.error.reason})`
            );
            alert(`Payment failed: ${response.error.description || "Unknown error"}`);
          }
          payBtn.current.disabled = false;
        });
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (error) {
      const message = error.message || "Payment processing failed";
      console.log("Processing error:", error);
      setErrorMessage(message);
      alert(message);
      payBtn.current.disabled = false;
    }
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      alert(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={submitHandler}>
          <h2>Proceed to Payment</h2>
          {errorMessage && <div className="errorMessage">{errorMessage}</div>}
          <input
            type="submit"
            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;