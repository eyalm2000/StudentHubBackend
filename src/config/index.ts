import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
    port: process.env.PORT || 8080,
    mongoURI: process.env.MONGO_URI as string,
    jwtSecret: process.env.JWT_SECRET || 'supersecret',
    encryptionKey: process.env.ENCRYPTION_KEY,
    nodeEnv: process.env.NODE_ENV || 'development',
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_REDIRECT_URI || `http://localhost:${process.env.PORT || 8080}/api/auth/google/callback`
    }
};

if (!config.mongoURI) {
    console.error('FATAL ERROR: MONGO_URI is not defined.');
    process.exit(1);
}

if (!config.jwtSecret) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    process.exit(1);
}

export default config;