import React, { Fragment, useEffect, useState } from "react";
import "./productReviews.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MetaData from "../MetaData.jsx";
import Sidebar from "./Sidebar";
import { FaStar, FaTrash } from "react-icons/fa";
import {
  clearErrors,
  getAllReviews,
  deleteReviews,
} from "../../actions/productAction";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";

const ProductReviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: deleteError, isDeleted } = useSelector((state) => state.review);
  const { error, reviews, loading } = useSelector((state) => state.productReviews);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [productId, setProductId] = useState("");

  const deleteReviewHandler = (reviewId) => {
    if (!productId) {
      setNotification({ message: "❌ Please enter a valid Product ID", type: "error" });
      return;
    }
    dispatch(deleteReviews(reviewId, productId));
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    if (productId.length !== 24) {
      setNotification({ message: "❌ Product ID must be 24 characters", type: "error" });
      return;
    }
    dispatch(getAllReviews(productId));
  };

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
      setNotification({ message: "✅ Review Deleted Successfully", type: "success" });
      navigate("/admin/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
    }

    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (productId.length === 24) {
      dispatch(getAllReviews(productId));
    }
  }, [dispatch, error, deleteError, isDeleted, navigate, notification.message, productId]);

  return (
    <Fragment>
      <MetaData title="ALL REVIEWS - Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="productReviewsContainer">
          {notification.message && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          <form
            className="productReviewsForm"
            onSubmit={productReviewsSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>
            <div className="input-group">
              <FaStar />
              <input
                type="text"
                placeholder="Product ID"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>
            <button
              id="searchReviewsBtn"
              type="submit"
              disabled={loading || !productId}
              className={loading || !productId ? "disabled" : ""}
            >
              Search
            </button>
          </form>
          {reviews && reviews.length > 0 ? (
            <table className="productReviewsTable">
              <thead>
                <tr>
                  <th>Review ID</th>
                  <th>User</th>
                  <th>Comment</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item.comment}</td>
                    <td className={item.rating >= 3 ? "greenColor" : "redColor"}>
                      {item.rating}
                    </td>
                    <td>
                      <button
                        onClick={() => deleteReviewHandler(item._id)}
                        className="action-button delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h1 className="productReviewsFormHeading">No Reviews Found</h1>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;