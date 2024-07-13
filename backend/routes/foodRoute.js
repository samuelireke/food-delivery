import express from "express";
import {
  addFood,
  getAllFood,
  removeAllFood,
  removeFood,
} from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

foodRouter.post("/add", upload.single("image"), addFood);

foodRouter.get("/all", getAllFood);

foodRouter.post("/remove", removeFood);

foodRouter.delete("/remove/all", removeAllFood);

export default foodRouter;
