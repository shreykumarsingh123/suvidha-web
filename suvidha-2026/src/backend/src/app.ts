import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';
import logger from './utils/logger';
import { config } from './config';
import { connectPostgres } from './db/postgres';
import { initializeDatabase } from './db/init';
import { connectRedis } from './cache/redis';

const app = express();
const PORT = process.env.PORT || 5000;

const requireEncryptionKey = () => {
    if (!config.encryption.key) {
        throw new Error('DATA_ENCRYPTION_KEY must be configured');
    }
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to PostgreSQL & Redis
(async () => {
    try {
        requireEncryptionKey();
        await connectPostgres();
        await initializeDatabase();
        await connectRedis();
    } catch (err) {
        logger.error('Startup failure:', err);
        process.exit(1);
    }
})();

// Routes
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
