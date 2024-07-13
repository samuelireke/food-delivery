import React from "react";
import "./List.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const List = () => {
  const url = "http://localhost:4000";

  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/all`);
    console.log(response.data);
    if (response.data.success) {
      setList(response.data);
    } else {
      toast.error("Error getting food list");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return <div>List</div>;
};

export default List;
