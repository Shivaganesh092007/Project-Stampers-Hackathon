import cors from "cors";
import cookieParser from "cookie-parser";
import express from 'express';

import userRoutes from './routes/user.routes.js';
import pathwayRoutes from './routes/pathway.routes.js';
import agentRoutes from './routes/agent.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Route Mount points
app.use('/api/users', userRoutes);
app.use('/api/pathway', pathwayRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        errors: err.errors || [],
        data: null
    });
});

export default app;