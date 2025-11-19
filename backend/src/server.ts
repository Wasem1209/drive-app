import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db"; // your MongoDB connection
import authRoutes from "./routes/auth.routes"; // your auth routes

// Load environment variables at the very top
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // auth endpoints (register, login, verify email, etc.)

// Basic health check
app.get("/", (req: Request, res: Response) => {
    res.send("🚦 Autofy Backend API is running...");
});

// Catch-all for unknown routes
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handler (optional)
app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error("Global error:", err);
    res.status(500).json({ message: "Server Error", error: err.message || err });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
