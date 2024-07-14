import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    api_url,
    sessionStatus,
  } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    county: "",
    postCode: "",
    country: "",
    mobilePhoneNumber: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData({ ...data, [name]: value });
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id],
        });
      }
    });
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };
    try {
      const response = await axios.post(
        api_url + "/api/order/place",
        orderData,
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        toast.dismiss();
        toast.error("Failed to place order");
      }
    } catch (error) {
      console.error("Failed to proceed to payment: ", error);
      toast.dismiss();
      toast.error("Failed to place order");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStatus.isExpired) {
      // Dismiss all toasts before showing a new one
      toast.dismiss();
      toast.error(sessionStatus.message);
    }
    if (!token) {
      navigate("/cart");
      toast.dismiss();
      toast.error("Login to proceed to checkout");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, sessionStatus]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
            required
          />
          <input
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
            required
          />
        </div>
        <input
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email Address"
          required
        />
        <input
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
          required
        />
        <div className="multi-fields">
          <input
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
            required
          />
          <input
            name="county"
            onChange={onChangeHandler}
            value={data.county}
            type="text"
            placeholder="County"
            required
          />
        </div>
        <div className="multi-fields">
          <input
            name="postCode"
            onChange={onChangeHandler}
            value={data.postCode}
            type="text"
            placeholder="Post code"
            required
          />
          <input
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
            required
          />
        </div>
        <input
          name="mobilePhoneNumber"
          onChange={onChangeHandler}
          value={data.mobilePhoneNumber}
          type="text"
          placeholder="Mobile Phone Number"
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-details">
              <p>Subtotal</p>
              <p>
                {getTotalCartAmount() === 0 ? "-" : "£" + getTotalCartAmount()}
              </p>
            </div>
            <hr />
            <div className="cart-details">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount() === 0 ? "-" : "£2"}</p>
            </div>
            <hr />
            <div className="cart-details">
              <b>Total</b>
              <b>
                {getTotalCartAmount() === 0
                  ? "-"
                  : "£" + (getTotalCartAmount() + 2)}
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
