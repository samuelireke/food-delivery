import React, { useContext, useEffect } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { api_url, sessionStatus } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    const response = await axios.post(api_url + "/api/order/verify", {
      success,
      orderId,
    });
    try {
      if (response.data.success) {
        // Redirect to order details page
        navigate("/myorders");
      } else {
        // Redirect to homepage
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Verify the payment status and redirect to appropriate page
    const checkPayment = async () => {
      verifyPayment();
    };

    checkPayment();
  }, []);

  useEffect(() => {
    if (sessionStatus.isExpired) {
      // Dismiss all toasts before showing a new one
      toast.dismiss();
      toast.error(sessionStatus.message);
    }
  }, [sessionStatus]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
