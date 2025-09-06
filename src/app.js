import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// Simplified CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:5173", // Local development
      "https://iatrosense.vercel.app", // Your production frontend
      process.env.CLIENT_DEV_URL,
      process.env.CLIENT_PROD_URL
    ].filter(Boolean); // Remove any undefined values

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(cookieParser());

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
      process.env.CLIENT_PROD_URL
    ].filter(Boolean)
  });
});

export default app;
