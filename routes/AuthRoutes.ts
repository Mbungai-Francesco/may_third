import express from "express";
import {
  createUser,
  loginUser,
  logoutUser
} from "../controller/AuthController";

const AuthRoutes = express.Router();

AuthRoutes.post("/auth/register", createUser);
AuthRoutes.post("/auth/login", loginUser);
AuthRoutes.post("/auth/logout", logoutUser);

export default AuthRoutes;
