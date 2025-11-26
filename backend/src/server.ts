import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db"; // MongoDB connection
import authRoutes from "./routes/auth.routes"; // auth routes
import helmet from "helmet";
import dashboardRoutes from "./routes/dashboardRoutes";

// Load environment variables
dotenv.config();

// Initialize Express
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ------------------
// Middlewares
// ------------------
app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse JSON bodies
app.use(helmet()); // Security headers

// ------------------
// Routes
// ------------------
app.use("/api/auth", authRoutes); // Register/Login endpoints
app.use("/api/dashboard", dashboardRoutes);

// Basic health check
app.get("/", (req: Request, res: Response) => {
    res.send("🚦 Autofy Backend API is running...");
});

// ------------------
// Catch-all for unknown routes
// ------------------
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
});

// ------------------
// Global error handler
// ------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Global error:", err);
    res.status(500).json({
        message: "Server Error",
        error: err.message || err,
    });
});

// ------------------
// Start server
// ------------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
