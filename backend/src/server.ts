import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import dashboardRoutes from "./routes/dashboard.routes"; // ✅ corrected import
import vehicleRoutes from "./routes/vehicle.routes";


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// --- Middlewares ---
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // optional, for form data

// --- Request logger (optional, for debugging) ---
app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- Routes ---
app.use("/api/users", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/vehicle", vehicleRoutes);


// --- Health Check ---
app.get("/", (_req: Request, res: Response) => {
    res.send("🚦 Autofy Backend API is running...");
});

// --- 404 Handler ---
app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
});

// --- Global Error Handler ---
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Global error:", err);
    res.status(500).json({
        message: "Server Error",
        error: err.message || err,
    });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
