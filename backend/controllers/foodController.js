import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    image: image_filename,
    category: req.body.category,
  });
  try {
    await food.save();
    res.status(201).json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// get all food items

const getAllFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food)
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    return res.json({ success: true, message: "Food removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// remove all food items
const removeAllFood = async (req, res) => {
  try {
    await foodModel.deleteMany({});
    for (const file of fs.readdirSync(`uploads/`, () => {})) {
      console.log(file);
      fs.unlink(`uploads/${file}`, () => {});
    }
    return res.json({ success: true, message: "All food removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { addFood, getAllFood, removeFood, removeAllFood };
