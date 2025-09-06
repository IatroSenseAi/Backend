import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_DEV_URL,
  process.env.CLIENT_PROD_URL,
].filter(Boolean); 

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
