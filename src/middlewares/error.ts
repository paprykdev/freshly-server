import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error occurred:", {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    timestamp: new Date().toISOString(),
  });

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  if (
    error.name === "MongoServerError" &&
    "code" in error &&
    error.code === 11000
  ) {
    res.status(409).json({
      message: "Resource already exists",
    });
    return;
  }

  if (error.name === "JsonWebTokenError") {
    res.status(401).json({
      message: "Invalid token",
    });
    return;
  }

  if (error.name === "TokenExpiredError") {
    res.status(401).json({
      message: "Token expired",
    });
    return;
  }

  if (error.name === "ValidationError") {
    res.status(400).json({
      message: "Validation failed",
    });
    return;
  }

  if (error.name === "CastError") {
    res.status(400).json({
      message: "Invalid data format",
    });
    return;
  }

  res.status(500).json({
    message: "Internal server error",
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
};

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  console.log(
    `📥 ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`
  );

  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? "🔴" : "🟢";
    console.log(
      `📤 ${statusColor} ${res.statusCode} ${req.method} ${req.originalUrl} - ${duration}ms`
    );
  });

  next();
};
