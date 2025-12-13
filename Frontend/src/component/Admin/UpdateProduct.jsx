  import React, { Fragment, useEffect, useState } from "react";
  import "./updateProduct.css";
  import { useSelector, useDispatch } from "react-redux";
  import {
    clearErrors,
    updateProduct,
    getProductDetails,
  } from "../../actions/productAction";
  import { useNavigate, useParams } from "react-router-dom";
  import MetaData from "../MetaData";
  import Sidebar from "./Sidebar";
  import { FaPen, FaDollarSign, FaFileAlt, FaList, FaBoxOpen } from "react-icons/fa";
  import { UPDATE_PRODUCT_RESET } from "../../constants/productConstants";

  const UpdateProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: productId } = useParams();
    const { error, product } = useSelector((state) => state.productDetails);
    const { loading, error: updateError, isUpdated } = useSelector((state) => state.product);
    const [notification, setNotification] = useState({ message: "", type: "" });

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);

    

    // New images
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    // Old images (already saved on DB)
    const [oldImages, setOldImages] = useState([]);

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
      if (product && product._id !== productId) {
        dispatch(getProductDetails(productId));
      } else if (product) {
        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(product.price || 0);
        setCategory(product.category || "");
        setStock(product.Stock || 0);
        setOldImages(product.images || []);
      }

      if (error) {
        setNotification({ message: `❌ ${error}`, type: "error" });
        dispatch(clearErrors());
      }

      if (updateError) {
        setNotification({ message: `❌ ${updateError}`, type: "error" });
        dispatch(clearErrors());
      }

      if (isUpdated) {
      //  console.log(notification);
        
        setNotification({ message: "✅ Product Updated Successfully", type: "success" });
      //  navigate("/admin/products");
        dispatch({ type: UPDATE_PRODUCT_RESET });
      }

      if (notification.message) {
        const timer = setTimeout(() => {
          setNotification({ message: "", type: "" });
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [dispatch, error, updateError, isUpdated, navigate, productId, product, notification.message]);

    // ✅ Submit Handler
    const updateProductSubmitHandler = (e) => {
      e.preventDefault();

      if (!name || !price || !description || !category || !stock) {
        setNotification({ message: "❌ Please fill all fields", type: "error" });
        return;
      }

      const myForm = new FormData();
      myForm.set("name", name);
      myForm.set("price", price);
      myForm.set("description", description);
      myForm.set("category", category);
      myForm.set("Stock", stock);

      // Sirf tabhi images bhejna agar user ne nayi select ki hain
      if (images.length > 0) {
        images.forEach((image) => {
          myForm.append("images", image); // original File object bhejna
        });
      }
     // console.log(images);
      

      dispatch(updateProduct(productId, myForm));
    };

    // ✅ Image Change Handler
    const updateProductImagesChange = (e) => {
      const files = Array.from(e.target.files);

      if (files.length > 5) {
        setNotification({ message: "❌ You can upload maximum 5 images", type: "error" });
        return;
      }

      setImages([]);          // reset new images
      setImagesPreview([]);   // reset previews

      files.forEach((file) => {
        if (!file.type.startsWith("image/")) {
          setNotification({ message: "❌ Please upload only image files", type: "error" });
          return;
        }

      

        // ✅ Also generate preview using Base64
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setImagesPreview((old) => [...old, reader.result]);
            // ✅ Save original file for upload
          setImages((old) => [...old, file]);
          }
        };
        reader.readAsDataURL(file); // Base64 only for preview
      });
    };

    return (
      <Fragment>
        <MetaData title="Update Product - Admin" />
        <div className="dashboard">
          <Sidebar />
          <div className="updateProductContainer">
            {notification.message && (
              <div className={`notification ${notification.type}`}>
                {notification.message}
              </div>
            )}
            <form
              className="updateProductForm"
              encType="multipart/form-data"
              onSubmit={updateProductSubmitHandler}
            >
              <h1>Update Product</h1>

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

              <div id="updateProductFormFile" className="input-group">
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  onChange={updateProductImagesChange}
                  multiple
                />
              </div>

              {/* Old Images */}
              <div id="updateProductFormImage">
                {oldImages && oldImages.length > 0 && (
                  <>
                    <h3>Current Images</h3>
                    {oldImages.map((image, index) => (
                      <img key={index} src={image.url} alt="Current Product" />
                    ))}
                  </>
                )}
              </div>

              {/* New Previews */}
              <div id="updateProductFormImage">
                {imagesPreview.length > 0 && (
                  <>
                    <h3>New Images Preview</h3>
                    {imagesPreview.map((image, index) => (
                      <img key={index} src={image} alt="New Preview" />
                    ))}
                  </>
                )}
              </div>

              <button
                id="updateProductBtn"
                type="submit"
                disabled={loading}
                className={loading ? "disabled" : ""}
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </Fragment>
    );
  };

  export default UpdateProduct;
