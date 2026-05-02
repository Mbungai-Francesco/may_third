import express from "express";
import multer from "multer";
import {
	getMe,
  getUsers,
  getUser,
  updateUser,
  uploadImage,
  deleteUser,
  updatePassword
} from "../controller/UserController";

const upload = multer({ storage: multer.memoryStorage() });
const UserRoutes = express.Router();

UserRoutes.get("/users", getUsers);
UserRoutes.get("/users/me", getMe);
UserRoutes.get("/users/:id", getUser);
UserRoutes.put("/users/image/:id", upload.single("image"), uploadImage);
UserRoutes.put("/users/password/:id", updatePassword);
UserRoutes.put("/users/:id", updateUser);
UserRoutes.delete("/users/:id", deleteUser);

export default UserRoutes;
