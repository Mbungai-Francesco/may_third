import express from "express";
import {
	getMe,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from "../controller/UserController";

const UserRoutes = express.Router();

UserRoutes.get("/me", getMe);
UserRoutes.get("/users", getUsers);
UserRoutes.get("/users/:id", getUser);
UserRoutes.put("/users/:id", updateUser);
UserRoutes.delete("/users/:id", deleteUser);

export default UserRoutes;
