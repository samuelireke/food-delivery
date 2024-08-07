import React, { useState, useEffect } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
const List = ({ api_url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${api_url}/api/food/all`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.dismiss();
        toast.error("Error getting food list");
      }
    } catch (error) {
      console.error("Error fetting food list", error);
      toast.dismiss();
      toast.error(error.response.data.message);
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${api_url}/api/food/remove`, {
        id: foodId,
      });
      if (response.data.success) {
        await fetchList();
        toast.success(response.data.message);
      } else {
        toast.dismiss();
        toast.error("Error removing food");
      }
    } catch (error) {
      console.error("Error removing item", error);
      toast.dismiss();
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${api_url}/images/` + item.image} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>£{item.price}</p>
              <p onClick={() => removeFood(item._id)} className="cursor">
                x
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
