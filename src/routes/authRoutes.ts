import { loginUser, registerUser } from "@/controllers/userController";
import express from "express";
import {
  validateUserLogin,
  validateUserRegistration,
} from "../middlewares/index";

const authRoutes = express.Router();

authRoutes.post("/register", validateUserRegistration, registerUser);
authRoutes.post("/login", validateUserLogin, loginUser);

export default authRoutes;
