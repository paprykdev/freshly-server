import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectToMongoDB, disconnectFromMongoDB } from "./database";
import { validateEnvironment, config } from "./config";
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
} from "./middlewares/index";
import { userRoutes, authRoutes } from "./routes";

validateEnvironment();

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

app.use(notFoundHandler);

app.use(errorHandler);

const gracefulShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  await disconnectFromMongoDB();
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

const startServer = async (): Promise<void> => {
  try {
    await connectToMongoDB();

    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
      console.log(`🔗 Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer().catch(console.error);
