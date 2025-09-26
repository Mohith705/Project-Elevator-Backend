import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { errorConverter, errorHandler, notFound } from './middlewares/error.js';
import { swaggerDocs } from './config/swagger.js';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

swaggerDocs(app);

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api', limiter);

// static for uploaded media
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', routes);

app.use(notFound);
app.use(errorConverter);
app.use(errorHandler);

export default app;