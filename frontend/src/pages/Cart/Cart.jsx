import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    api_url,
    sessionStatus,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStatus.isExpired) {
      // Dismiss all toasts before showing a new one
      toast.dismiss();
      toast.error(sessionStatus.message);
    }
  }, [sessionStatus]);
  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Qunatity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div>
                <div className="cart-items-title cart-items-item">
                  <img
                    src={api_url + "/images/" + item.image}
                    alt={item.name}
                  />
                  <p>{item.name}</p>
                  <p>£{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>£{item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
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
          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
