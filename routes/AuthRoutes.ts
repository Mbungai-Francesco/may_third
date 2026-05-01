import express from "express";
import {
  createUser,
  loginUser,
  logoutUser
} from "../controller/AuthController";

const AuthRoutes = express.Router();

AuthRoutes.post("/register", createUser);
AuthRoutes.post("/login", loginUser);
AuthRoutes.post("/logout", logoutUser);

export default AuthRoutes;
