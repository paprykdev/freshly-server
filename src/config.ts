export const validateEnvironment = (): void => {
  const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error(
      "❌ Missing required environment variables:",
      missingVars.join(", ")
    );
    process.exit(1);
  }
};

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET as string,
  mongoUri: process.env.MONGO_URI as string,
  rootPassword: process.env.ROOT_PASSWORD,
  nodeEnv: process.env.NODE_ENV || "development",
} as const;
