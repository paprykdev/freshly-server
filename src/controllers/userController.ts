import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models";
import { AuthenticatedRequest } from "../middlewares/index";
import {
  AuthRequest,
  UpdateRoleRequest,
  AuthResponse,
  RegisterResponse,
  ErrorResponse,
} from "../types";
import { config } from "../config";
import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
} from "../utils/errors";

export const registerUser = async (
  req: Request<{}, RegisterResponse | ErrorResponse, AuthRequest>,
  res: Response<RegisterResponse | ErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const user = new User({ email, password, role });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      id: (user._id as mongoose.Types.ObjectId).toString(),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request<{}, AuthResponse | ErrorResponse, AuthRequest>,
  res: Response<AuthResponse | ErrorResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError("Invalid credentials");
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role, email }: UpdateRoleRequest = req.body;

    if (!email || !role) {
      throw new ValidationError("Email and role are required");
    }

    const rootPassword = req.headers["cupcake"] as string;

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError("User");
    }

    if (user.role === role) {
      throw new ValidationError("User already has this role");
    }

    if (user.role === "admin" && rootPassword !== config.rootPassword) {
      throw new AuthorizationError(
        "Cannot change admin role without proper authorization"
      );
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = (
  req: AuthenticatedRequest,
  res: Response
): void => {
  res.json(req.user);
};

export const getAllUsers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    next(error);
  }
};
