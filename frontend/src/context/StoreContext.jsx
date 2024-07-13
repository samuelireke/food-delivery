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
        if (!sessionStatus.isExpired & (error_name === "TokenExpiredError")) {
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
    const response = await axios.get(api_url + "/api/food/all");
    setFoodList(response.data.data);
  };

  const loadCart = async (token) => {
    const reponse = await axios.get(api_url + "/api/cart/get", {
      headers: { token: token },
    });
    if (reponse.data.success) {
      setCartItems(reponse.data.cart);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      const userToken = localStorage.getItem("token");
      if (userToken) {
        setToken(userToken);
        await loadCart(userToken);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (sessionStatus.isExpired) {
      setCartItems({});
      setSessionStatus({ isExpired: false, message: "" });
      navigate("/"); // Navigate to the home page upon session expiry
      localStorage.removeItem("token");
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
