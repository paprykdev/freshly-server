import express from "express";
import {
  authMiddleware,
  requireAdmin,
  validateRole,
} from "../middlewares/index";
import {
  updateUserRole,
  getCurrentUser,
  getAllUsers,
} from "../controllers/userController";

const userRoutes = express.Router();

userRoutes.get("/me", authMiddleware, getCurrentUser);
userRoutes.get("/", authMiddleware, requireAdmin, getAllUsers);

userRoutes.put(
  "/updateRole",
  authMiddleware,
  requireAdmin,
  validateRole,
  updateUserRole
);

export default userRoutes;
