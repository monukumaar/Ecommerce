import React, { Fragment, useEffect, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createProduct } from "../../actions/productAction";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../MetaData";
import Sidebar from "./Sidebar";
import { FaPen, FaDollarSign, FaFileAlt, FaList, FaBoxOpen } from "react-icons/fa";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";

const NewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.newProduct);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
  ];

  useEffect(() => {
    if (error) {
      setNotification({ message: `❌ ${error}`, type: "error" });
      dispatch(clearErrors());
    }

    if (success) {
      setNotification({ message: "✅ Product Created Successfully", type: "success" });
     // navigate("/admin/dashboard");
      dispatch({ type: NEW_PRODUCT_RESET });
    }

    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, error, success, navigate, notification.message]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();

    if (!name || !price || !description || !category || !stock ) {
      setNotification({ message: "❌ Please fill all fields and upload at least one image", type: "error" });
      return;
    }

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("Stock", stock);
  //  console.log(images);
    
    images.forEach((image) => {
      myForm.append("images", image);
    });
    
    dispatch(createProduct(myForm));
  };

 const createProductImagesChange = (e) => {
  const files = Array.from(e.target.files);

    if (files.length > 5) {
    setNotification({ message: "❌ You can upload maximum 5 images", type: "error" });
    return;
  }

  setImages([]);
  setImagesPreview([]);

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) {
      setNotification({ message: "❌ Please upload only image files", type: "error" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagesPreview((old) => [...old, reader.result]);  // ✅ Preview ke liye
        setImages((old) => [...old, reader.result]);         // ✅ Base64 string bhejna
      }
    };
    reader.readAsDataURL(file);
  });
};

  return (
    <Fragment>
      <MetaData title="Create Product - Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="newProductContainer">
          {notification.message && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createProductSubmitHandler}
          >
            <h1>Create Product</h1>
            <div className="input-group">
              <FaPen />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <FaDollarSign />
              <input
                type="number"
                placeholder="Price"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div className="input-group">
              <FaFileAlt />
              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="4"
              />
            </div>
            <div className="input-group">
              <FaList />
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <FaBoxOpen />
              <input
                type="number"
                placeholder="Stock"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
            <div id="createProductFormFile" className="input-group">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={createProductImagesChange}
                multiple
              />
            </div>
            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>
            <button
              id="createProductBtn"
              type="submit"
              disabled={loading}
              className={loading ? "disabled" : ""}
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default NewProduct;