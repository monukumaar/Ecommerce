import React, { useEffect, useState, Fragment } from "react";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getProductDetails,
  newReview,
} from "../../actions/productAction";
import { addItemsToCart } from "../../actions/cartAction";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import ReviewCard from "./ReviewCard";
import Loader from "../layout/Loader/Loader";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
    const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const increaseQuantity = () => {
    if (product?.Stock <= quantity){
      setNotification({ message: "❌ Out of stock", type: "error" });
      return
    };
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };

  const addToCartHandler = () => {
    if (!isAuthenticated) {
      // Agar login nahi hai to login page pe redirect
      // setNotification({ message: "⚠️ Please login first", type: "error" });
      navigate("/login");
      return;
    }
    dispatch(addItemsToCart(id, quantity));
    setNotification({ message: "Item added to cart ✅", type: "success" });
  };

  const submitReviewToggle = () => {
    if (!isAuthenticated) {
      // Agar login nahi hai to login page pe redirect
      navigate("/login");
      return;
    }
    setOpen(!open);
  };

  const reviewSubmitHandler = () => {

      if (rating < 1 || rating > 5) {
    setNotification({ message: "❌ Rating must be between 1 and 5", type: "error" });
    return;
  }
    const myForm = new FormData();
    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));
    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      setNotification({ message: `❌ ${error}`, type: "error" });
      dispatch(clearErrors());
    }

    if (reviewError) {
      setNotification({ message: `❌ ${reviewError}`, type: "error" });
      dispatch(clearErrors());
    }

    if (success) {
      setNotification({ message: "✅ Review Submitted Successfully", type: "success" });
      dispatch({ type: NEW_REVIEW_RESET });
    }

    // Auto-dismiss notification after 3 seconds
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }

    dispatch(getProductDetails(id));
  }, [dispatch, id, error, reviewError, success, notification.message]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {/* Notification UI */}
          {notification.message && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}

          <div className="ProductDetails">
            <div>
              {Array.isArray(product?.images) && product.images.length > 0 ? (
                product.images.map((item, i) => (
                  <img
                    className="CarouselImage"
                    key={i}
                    src={item.url}
                    alt={`Product ${i}`}
                  />
                ))
              ) : (
                <img
                  className="CarouselImage"
                  src="/fallback-image.jpg"
                  alt="No Image Available"
                />
              )}
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product?.name || "Product Name"}</h2>
                <p>Product # {product?._id || "N/A"}</p>
              </div>

              <div className="detailsBlock-2">
                <span>⭐ {product?.ratings || 0}/5</span>
                <span className="detailsBlock-2-span">
                  ({product?.numOfReviews || 0} Reviews)
                </span>
              </div>

              <div className="detailsBlock-3">
                <h1>₹{product?.price || 0}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button
                    disabled={product?.Stock < 1}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={product?.Stock < 1 ? "redColor" : "greenColor"}>
                    {product?.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description: <p>{product?.description || "No description available"}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitReview">
                Submit Review
              </button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          {open && (
            <div className="dialog">
              <h4>Submit Review</h4>
              <div className="submitDialog">
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value="">Choose Rating</option>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <option key={star} value={star}>
                      {star}
                    </option>
                  ))}
                </select>

                <textarea
                  className="submitDialogTextArea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="5"
                  placeholder="Write your review..."
                />
                <div style={{ marginTop: "10px" }}>
                  <button onClick={submitReviewToggle}>Cancel</button>
                  <button onClick={reviewSubmitHandler}>Submit</button>
                </div>
              </div>
            </div>
          )}

          {Array.isArray(product?.reviews) && product.reviews.length > 0 ? (
            <div className="reviews">
              {product.reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;