import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://iatrosense.vercel.app",
    process.env.CLIENT_DEV_URL,
    process.env.CLIENT_PROD_URL,
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    allowedOrigins: [
      "http://localhost:5173",
      "https://iatrosense.vercel.app",
      process.env.CLIENT_DEV_URL,
      process.env.CLIENT_PROD_URL,
    ].filter(Boolean),
  });
});

export default app;
