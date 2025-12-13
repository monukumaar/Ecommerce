import React, { Fragment, useEffect, useState } from "react";
import "./productList.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAdminProduct,
  deleteProduct,
} from "../../actions/productAction";
import MetaData from "../MetaData.jsx";
import Sidebar from "./Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, products } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector((state) => state.product);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const deleteProductHandler = (id) => {
    
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    if (error) {
      console.log(error);
      
      setNotification({ message: `❌ ${error}`, type: "error" });
      dispatch(clearErrors());
    }

    if (deleteError) {
      setNotification({ message: `❌ ${deleteError}`, type: "error" });
      dispatch(clearErrors());
    }

    if (isDeleted) {
      setNotification({ message: "✅ Product Deleted Successfully", type: "success" });
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }

    dispatch(getAdminProduct());
  }, [dispatch, error, deleteError, isDeleted, navigate, notification.message]);

  return (
    <Fragment>
      <MetaData title="ALL PRODUCTS - Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          {notification.message && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          <h1 id="productListHeading">ALL PRODUCTS</h1>
          <table className="productListTable">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item.Stock}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <Link to={`/admin/product/${item._id}`} className="action-link">
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => deleteProductHandler(item._id)}
                        className="action-button delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductList;