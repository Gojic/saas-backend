import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import orgRoutes from "./routes/org.routes";
const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://127.0.0.1:8080",
      "http://localhost:8080",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
const API_PREFIX = "/api";
app.get("/health", (req, res) => res.json({ ok: true }));
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/org`, orgRoutes);

app.use((_req, res) =>
  res.status(404).json({ error: { message: "Not found" } }),
);
app.use(errorHandler);

export default app;
