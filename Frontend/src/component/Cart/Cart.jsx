import React, { useState, useEffect } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard.jsx";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);


  useEffect(() => {
    if (cartItems.length > 0) {
      cartItems.forEach((item) => {
        // backend se product exist check
        fetch(`http://localhost:3000/api/v1/product/${item.product}`)
          .then((res) => res.json())
          .then((data) => {            
            if (!data.product) {
              dispatch(removeItemsFromCart(item.product));
            }
          })
          .catch(() => {
            dispatch(removeItemsFromCart(item.product));
          });
      });
    }
  }, [cartItems, dispatch]);


  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      setAlertMessage("Cannot add more items; stock limit reached");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (quantity <= 1) {
      setAlertMessage("Quantity cannot be less than 1");
      setAlertType("error");
      setTimeout(() => {
        setAlertMessage(null);
        setAlertType(null);
      }, 3000);
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemsFromCart(id));
    setAlertMessage("Item removed from cart");
    setAlertType("success");
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 3000);
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  return (
    <>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <span>🛒</span>
          <p>No Product in Your Cart</p>
          <Link to="/products">View Products</Link>
        </div>
      ) : (
        <>
          {alertMessage && (
            <div
              className={`alert ${alertType === "error" ? "alert-error" : "alert-success"
                }`}
            >
              {alertMessage}
            </div>
          )}
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>
            {cartItems &&
              cartItems.map((item) => (
                <div className="cartContainer" key={item.product}>
                  <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                  <div className="cartInput">
                    <button
                      onClick={() => decreaseQuantity(item.product, item.quantity)}
                    >
                      -
                    </button>
                    <input type="number" value={item.quantity} readOnly />
                    <button
                      onClick={() =>
                        increaseQuantity(item.product, item.quantity, item.stock)
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="cartSubtotal">{`₹${item.price * item.quantity
                    }`}</p>
                </div>
              ))}
            <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Gross Total</p>
                <p>{`₹${cartItems.reduce(
                  (acc, item) => acc + item.quantity * item.price,
                  0
                )}`}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkoutHandler}>Check Out</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;