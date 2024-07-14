import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets.js";

const MyOrders = () => {
  const { api_url, token, sessionStatus } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        api_url + "/api/order/userorders",
        {},
        {
          headers: { token },
        }
      );
      console.log("about to set order....");
      setOrders(response.data.orders);
      console.log(response.data.orders);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (sessionStatus.isExpired === false && token) {
      console.log(sessionStatus);
      fetchOrders();
    } else if (sessionStatus.isExpired) {
      console.log("Fetching order");
      console.log(sessionStatus);
      console.log("token: ", token);
      // Dismiss all toasts before showing a new one
      toast.dismiss();
      toast.error(sessionStatus.message);
    }
  }, [token, sessionStatus.isExpired]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {orders.map((order, index) => {
          return (
            <div key={index} className="my-order">
              <img src={assets.parcel_icon} alt="parcel_icon" />
              <p>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p>£{order.amount}</p>
              <p>Items: {order.items.length}</p>
              <p>
                <span>&#x25cf;</span> <b>{order.status}</b>
              </p>
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
