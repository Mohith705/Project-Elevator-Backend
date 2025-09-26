import app from './app.js';
import { connectDB } from './config/db.js';
import logger from './config/logger.js';

const port = process.env.PORT || 8080;

console.log("SID:", process.env.TWILIO_SID);
console.log("TOKEN:", process.env.TWILIO_AUTH_TOKEN);
console.log("PHONE:", process.env.TWILIO_PHONE_NUMBER);

connectDB()
    .then(() => {
        app.listen(port, () => logger.info(`🚀 Server running on port ${port}`));
    })
    .catch((err) => {
        logger.error('DB connection failed', err);
        process.exit(1);
    });
