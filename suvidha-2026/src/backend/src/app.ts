import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from './config';
import routes from './routes';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || config.db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as any)
    .then(() => logger.info('MongoDB connected'))
    .catch(err => logger.error('MongoDB connection error:', err));

// Routes
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});