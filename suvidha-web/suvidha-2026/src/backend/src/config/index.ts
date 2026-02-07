export const config = {
    db: {
        uri: process.env.DB_URI || 'mongodb://localhost:27017/suvidha',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    server: {
        port: process.env.PORT || 3000,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your_jwt_secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
    // Add other configuration settings as needed
};
export const twilioConfig = {
  accountSid: process.env.TWILIO_SID,
  authToken: process.env.TWILIO_TOKEN,
  from: process.env.TWILIO_PHONE,
};