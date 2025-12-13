import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const imageUrls="https://ecommercephotographyindia.com/assets/img/gallery/cosmetics-products-photography1.jpg"
    
    const imageUrl =product.images[0] ? product.images[0].url : imageUrls

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} color="#FFD700" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
      } else {
        stars.push(<FaRegStar key={i} color="#FFD700" />);
      }
    }
    return stars;
  };

  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img 
        src={imageUrl}
        alt={product.name}
      />
      <p>{product.name}</p>
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        {renderStars(product.ratings)}
        <span className="productCardSpan">
          ({product.numOfReviews} Reviews)
        </span>
      </div>
      <span>{`₹${product.price}`}</span>
    </Link>
  );
};

export default ProductCard;
