import express from 'express';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import rateLimit from 'express-rate-limit'; // Limit requests from same API (prevent from DDOS)
import helmet from 'helmet'; // Set security HTTP headers
import mongoSanitize from 'express-mongo-sanitize'; // Data sanitization against NoSQL query injection
import xss from 'xss-clean'; // Data sanitization against XSS

import boardRouter from './routes/boardRoutes.js';
import accountRouter from './routes/accountRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
app.use(cors());
const __dirname = dirname(fileURLToPath(import.meta.url));

// 1) GLOBAL MIDDLEWARES
app.use(helmet()); // Set security HTTP headers

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API (prevent from DDOS)
const limiter = rateLimit({
  max: 100, // 100 requests from same IP
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter); // apply to all routes that start with /api

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
// clear all the query string from malicious characters
// {email: $gt: ""}, {password: "12345678"}
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Serving static files
app.use(express.static(`${__dirname}/static`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/boards', boardRouter);
app.use('/api/v1/account', accountRouter);
app.use('/api/v1/users', userRouter);

export default app;
