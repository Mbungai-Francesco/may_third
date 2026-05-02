import express from "express";
import {
  createWish,
  getWishes,
  getWish,
  getMyWishes,
  getReceivedWishes,
  updateWish,
  deleteWish,
  reactToWish
} from "../controller/WishController";

const WishRoutes = express.Router();

WishRoutes.post("/wishes", createWish);
WishRoutes.get("/wishes", getWishes);
WishRoutes.get("/wishes/mine", getMyWishes);
WishRoutes.get("/wishes/received", getReceivedWishes);
WishRoutes.get("/wishes/:id", getWish);
WishRoutes.put("/wishes/react/:id", reactToWish);
WishRoutes.put("/wishes/:id", updateWish);
WishRoutes.delete("/wishes/:id", deleteWish);

export default WishRoutes;
