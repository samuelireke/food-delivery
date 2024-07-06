import React, { useState } from "react";
import "./FoodRating.css";

const FoodRating = () => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [totalStars, setTotalStars] = useState(5);

  const handleChange = (e) => {
    setRating(null);
    setTotalStars(parseInt(Boolean(e.target.value, null) ? e.target.value : 0));
  };

  return (
    <div className="star-rating">
      <h1>Star rating</h1>
      {[...Array(totalStars)].map((star, index) => {
        const currentRating = index + 1;

        return (
          <label key={index}>
            <input
              key={star}
              type="radio"
              name="rating"
              value={currentRating}
              onChange={() => setRating(currentRating)}
            />
            <span
              className="star"
              style={{
                color:
                  currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9",
              }}
              onMouseEnter={() => setHover(currentRating)}
              onMouseLeave={() => setHover(null)}
            >
              &#9733;
            </span>
          </label>
        );
      })}

      <br />
      <br />

      <p>Your rating is: {rating}</p>
      <br />
      <label style={{ fontWeight: 400 }}>
        {" "}
        Number of stars:
        <input
          type="number"
          onChange={handleChange}
          value={totalStars === 0 ? "" : totalStars}
          min={1}
          style={{ marginLeft: "12px", maxWidth: "50px" }}
        />
      </label>
    </div>
  );
};

export default FoodRating;
