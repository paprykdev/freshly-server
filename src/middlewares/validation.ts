import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types";

const USER_ROLES: readonly UserRole[] = [
  "admin",
  "deliveryGuy",
  "user",
] as const;

export const validateRole = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body.role) {
    req.body.role = "user";
  }

  if (!USER_ROLES.includes(req.body.role)) {
    res.status(400).json({
      message: `Invalid role. Available roles: ${USER_ROLES.join(", ")}`,
    });
    return;
  }

  next();
};

export const validateEmail = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  next();
};

export const validatePassword = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ message: "Password is required" });
    return;
  }

  if (password.length < 6) {
    res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
    return;
  }

  next();
};

export const validateUserRegistration = [
  validateEmail,
  validatePassword,
  validateRole,
];

export const validateUserLogin = [validateEmail, validatePassword];
