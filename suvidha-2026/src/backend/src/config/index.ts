const toNumber = (value: string | undefined, fallback: number): number => {
    if (!value) {
        return fallback;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? fallback : parsed;
};

export const config = {
    postgres: {
        url: process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/suvidha',
        sslEnabled: process.env.POSTGRES_SSL === 'true',
        sslRejectUnauthorized: process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED !== 'false',
        poolMax: toNumber(process.env.POSTGRES_POOL_MAX, 10),
        idleTimeoutMs: toNumber(process.env.POSTGRES_IDLE_TIMEOUT_MS, 30000),
        connectionTimeoutMs: toNumber(process.env.POSTGRES_CONNECTION_TIMEOUT_MS, 2000),
    },
    redis: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        ttlSeconds: toNumber(process.env.REDIS_TTL_SECONDS, 300),
    },
    server: {
        port: process.env.PORT || 3000,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your_jwt_secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
    encryption: {
        key: process.env.DATA_ENCRYPTION_KEY || '',
    },
};

export const twilioConfig = {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    from: process.env.TWILIO_PHONE_NUMBER,
};
