import express from "express";
import * as dotenv from "dotenv";
import { AppDataSource } from "../ormconfig";
import logger from "../src/config/logger";
import app from "../src/config/express";
dotenv.config();

async function startServer() {
  // ✅ Apply middleware BEFORE routes
  app.use(express.json()); // Ensure JSON body parsing
  app.use(express.urlencoded({ extended: true }));

  // ✅ Enable CORS for localhost and specific domains
  // const allowedOrigins = [
  //   "https://studio.apollographql.com",
  //   "https://www.tripwinding.com",
  // ];

  // app.use(
  //   cors({
  //     origin: (origin, callback) => {
  //       if (
  //         !origin ||
  //         allowedOrigins.includes(origin) ||
  //         origin.startsWith("http://localhost")
  //       ) {
  //         callback(null, true);
  //       } else {
  //         callback(new Error("Not allowed by CORS"));
  //       }
  //     },
  //     credentials: true,
  //   })
  // );

  try {
    // ✅ Initialize the database BEFORE GraphQL Server starts
    logger.info("Connecting to database...");
    await AppDataSource.initialize();
    logger.info("✅ Database connected successfully");

    // ✅ Start Express Server
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.info("❌ Error starting server:", error);
  }
}

startServer();
