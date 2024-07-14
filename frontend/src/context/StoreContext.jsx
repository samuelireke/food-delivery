import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const api_url = import.meta.env.VITE_API_URL;

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [sessionStatus, setSessionStatus] = useState({
    isExpired: false,
    message: "",
  });
  const navigate = useNavigate();

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems({ ...cartItems, [itemId]: 1 });
    } else {
      setCartItems({ ...cartItems, [itemId]: cartItems[itemId] + 1 });
    }
    if (token) {
      try {
        await axios.post(
          api_url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        let error_name = error.response.data.error_name;
        let error_message = error.response.data.message;
        // check if session is expired
        if (
          sessionStatus.isExpired === false &&
          error_name === "TokenExpiredError"
        ) {
          setSessionStatus((data) => ({
            ...data,
            isExpired: true,
            message: error_message,
          }));
          console.log("session expired!");
          return;
        }
        console.error("Failed to add item to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    if (cartItems[itemId] > 1) {
      setCartItems((prev) => ({ ...prev, [itemId]: cartItems[itemId] - 1 }));
    } else {
      delete cartItems[itemId];
      setCartItems({ ...cartItems });
    }
    if (token) {
      await axios.post(
        api_url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(api_url + "/api/food/all", {
        headers: { token },
      });
      setFoodList(response.data.data);
    } catch (error) {
      let error_name = error.response.data.error_name;
      let error_message = error.response.data.message;
      // check if session is expired
      if (
        sessionStatus.isExpired === false &&
        error_name === "TokenExpiredError"
      ) {
        setSessionStatus((data) => ({
          ...data,
          isExpired: true,
          message: error_message,
        }));
        console.log("session expired!");
        return;
      }
      console.error("Failed to fetch food list:", error);
    }
  };

  const loadCart = async (token) => {
    try {
      const reponse = await axios.get(api_url + "/api/cart/get", {
        headers: { token },
      });
      if (reponse.data.success) {
        setCartItems(reponse.data.cart);
      }
    } catch (error) {
      let error_name = error.response.data.error_name;
      let error_message = error.response.data.message;
      // check if session is expired
      if (
        sessionStatus.isExpired === false &&
        error_name === "TokenExpiredError"
      ) {
        setSessionStatus((data) => ({
          ...data,
          isExpired: true,
          message: error_message,
        }));
        console.log("session expired!");
        return;
      }
      console.error("Failed to load cart:", error);
    }
  };

  const handleSessionExpiration = () => {
    console.log("isSession expired?: " + sessionStatus.isExpired);
    if (sessionStatus.isExpired) {
      setToken("");
      setCartItems({});
      setSessionStatus({ isExpired: false, message: "" });
      navigate("/"); // Navigate to the home page upon session expiry
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const userToken = localStorage.getItem("token");
      if (userToken) {
        if (sessionStatus.isExpired) {
          handleSessionExpiration();
        } else {
          setToken(userToken);
          await loadCart(userToken);
        }
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (sessionStatus.isExpired) {
      handleSessionExpiration();
      console.log("Session");
    }
  }, [sessionStatus.isExpired]);

  const contextValue = {
    food_list,
    setFoodList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    api_url,
    token,
    setToken,
    sessionStatus,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
