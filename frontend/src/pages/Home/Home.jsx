import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
// import FoodRating from "../../components/FoodRating/FoodRating";

const Home = () => {
  const [category, setCategory] = useState("all");

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      {/*TODO: implement <FoodRating />  */}
    </div>
  );
};

export default Home;
