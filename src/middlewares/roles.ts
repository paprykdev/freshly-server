import { Response, NextFunction } from "express";
import { UserRole } from "../types";
import { AuthenticatedRequest } from "./auth";
import { AuthenticationError, AuthorizationError } from "../utils/errors";

export const USER_ROLES: readonly UserRole[] = [
  "admin",
  "deliveryGuy",
  "user",
] as const;

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      throw new AuthenticationError("Authentication required");
    }

    if (req.user.role !== "admin") {
      throw new AuthorizationError("Access denied - Admin role required");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireDeliveryGuyOrHigher = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const allowedRoles: UserRole[] = ["admin", "deliveryGuy"];
  if (!allowedRoles.includes(req.user.role)) {
    res.status(403).json({
      message: "Access denied - Delivery Guy role or higher required",
    });
    return;
  }

  next();
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: `Access denied - Required roles: ${allowedRoles.join(", ")}`,
      });
      return;
    }

    next();
  };
};
