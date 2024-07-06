import React from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";

const FoodItem = ({ id, name, price, description, image }) => {
  return (
    <div className="food-item">
      <div className="food-item-image-container">
        <img className="food-item-image" src={image} alt="" />
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          {/* TODO: Image a dynamic rating system -> https://dev.to/kartikbudhraja/creating-a-dynamic-star-rating-system-in-react-2c8 */}
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="foot-item-desc">{description}</p>
        <p className="food-item-price">£{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
