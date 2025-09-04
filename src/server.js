import app from './app.js';
import { connectDB } from './config/db.js';
import logger from './config/logger.js';

const port = process.env.PORT || 8080;

connectDB()
    .then(() => {
        app.listen(port, () => logger.info(`🚀 Server running on port ${port}`));
    })
    .catch((err) => {
        logger.error('DB connection failed', err);
        process.exit(1);
    });
