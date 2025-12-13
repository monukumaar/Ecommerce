import React from "react";

const ReviewCard = ({ review }) => {
  return (
    <div className="reviewCard">
      <img src="https://media.istockphoto.com/id/465485415/photo/blue-t-shirt-clipping-path.jpg?b=1&s=170667a&w=0&k=20&c=5CFvNa8H6Fj51FvOOTCvILXcfiYuP0xd2EY-XkKX13M=" alt="User" />
      <p>{review.name}</p>
      <span>⭐ {review.rating}/5</span>
      <span className="reviewCardComment">{review.comment}</span>
    </div>
  );
};

export default ReviewCard;
