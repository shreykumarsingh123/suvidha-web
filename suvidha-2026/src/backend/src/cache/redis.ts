import { createClient } from 'redis';
import { config } from '../config';
import logger from '../utils/logger';

export const redisClient = createClient({
    url: config.redis.url,
});

redisClient.on('error', (error: Error) => {
    logger.error('Redis client error:', error);
});

export const connectRedis = async (): Promise<void> => {
    if (redisClient.isOpen) {
        return;
    }

    await redisClient.connect();
    logger.info('Redis connected');
};

export const getCacheKey = (mobileNumber: string): string =>
    `user:mobile:${mobileNumber}`;

export const getCachedValue = async (key: string): Promise<string | null> => {
    if (!redisClient.isOpen) {
        return null;
    }

    return redisClient.get(key);
};

export const setCachedValue = async (key: string, value: string, ttlSeconds: number) => {
    if (!redisClient.isOpen) {
        return;
    }

    await redisClient.set(key, value, { EX: ttlSeconds });
};

export const deleteCachedValue = async (key: string): Promise<void> => {
    if (!redisClient.isOpen) {
        return;
    }

    await redisClient.del(key);
};
