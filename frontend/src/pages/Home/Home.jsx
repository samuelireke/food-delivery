import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
// import FoodRating from "../../components/FoodRating/FoodRating";

const Home = () => {
  const [category, setCategory] = useState("all");

  const { sessionStatus } = useContext(StoreContext);
  useEffect(() => {
    if (sessionStatus.isExpired) {
      // Dismiss all toasts before showing a new one
      toast.dismiss();
      toast.error(sessionStatus.message);
    }
  }, [sessionStatus]);
  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      {/*TODO: implement <FoodRating />  */}
      <AppDownload />
    </div>
  );
};

export default Home;
