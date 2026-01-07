import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import dashboardRoutes from "./routes/dashboard";
import { metricsMiddleware } from "./middleware/metrics";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de base
app.use(cors());
app.use(express.json());

// Middleware de métriques (doit être après express.json)
app.use(metricsMiddleware);

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/dashboard", dashboardRoutes);

// Route de santé
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
