import express, {type Application} from "express";
import cors from "cors";
import cookiesParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// import authRoutes from "./modules"
// import authRoutes from "./modules"
// import userRoutes from "./modules"

import { env } from './config/env.config';

// middleware
// import {NotFoundErrorMiddleware} from "./shared"
// import {errorMiddleware} from "./shared"

const app:Application  = express();

app.use(helmet());
app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true
    })
)


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookiesParser());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15m
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message:{
        success: false,
        message: "Too many request from this IP, please try again after 15 minutes."
    }
})

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);  // global error handler

export default app;



