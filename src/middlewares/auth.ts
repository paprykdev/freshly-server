import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { JWTPayload, IUser } from "../types";
import { config } from "../config";
import { AuthenticationError } from "../utils/errors";

export interface AuthenticatedRequest extends Request {
  user?: Omit<IUser, "password">;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      throw new AuthenticationError("No token provided");
    }

    const token = auth.split(" ")[1];
    if (!token) {
      throw new AuthenticationError("Invalid token format");
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw new AuthenticationError("User not found");
    }

    const { password, ...userData } = user.toObject();
    req.user = userData as Omit<IUser, "password">;

    next();
  } catch (error) {
    next(error);
  }
};
