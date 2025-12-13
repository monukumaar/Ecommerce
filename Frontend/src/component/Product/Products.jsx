import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import { Link } from "react-router-dom";

import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useParams } from "react-router-dom";


const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = () => {
  const dispatch = useDispatch();
  const { keyword = "" } = useParams(); // ✅ fixed this line

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 500000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  
  //  console.log("filteredProductsCount",filteredProductsCount,products.length,productsCount,resultPerPage);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, price, category, ratings]);


  const priceHandler = (e) => {
    const value = Number(e.target.value);
    setPrice([0, value]);
  };

  useEffect(() => {
    if (error) {
      console.log(error);
      dispatch(clearErrors());
    }

    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, error]);

  const totalpage = resultPerPage
    ? Math.ceil((filteredProductsCount || 0) / resultPerPage)
    : 0;




  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h2 className="productsHeading">Products</h2>
          
          {products.length === 0 ? (
            <div className="emptyProducts">
              <span>📦</span>
              <p>No Products Found</p>
                     <Link to="/">Go Home</Link>
            </div>
          ) : (
            <div className="products">
              {products &&
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>
          )}



          {/* 
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div> */}

          <div className="filterBox">
            <h3>Price</h3>
            <input
              type="range"
              min={0}
              max={500000}
              value={price[1]}
              onChange={priceHandler}
            />
            <p>₹0 - ₹{price[1]}</p>

            <h3>Categories</h3>
            <ul className="categoryBox">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={`category-link ${category === cat ? "active-category" : ""
                    }`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>

            <fieldset>
              <legend>Ratings Above</legend>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={ratings}
                onChange={(e) => setRatings(Number(e.target.value))}
              />
              <p>{ratings}⭐ and up</p>
            </fieldset>
          </div>

          {resultPerPage < filteredProductsCount && (
            <div className="paginationBox">
              {Array.from({ length: totalpage }, (_, index) => index + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPageNo(pageNum)}
                    className={`page-button ${pageNum === currentPage ? "active" : ""
                      }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
