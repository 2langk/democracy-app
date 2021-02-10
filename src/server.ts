import * as express from 'express';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';
import * as xss from 'xss-clean';
import { sequelize, redisClient } from './models';
import globalErrorHandler from './utils/globalErrorHandler';
import AppError from './utils/AppError';
import logger from './utils/logger';

// import Routes
import {
	applyRouter,
	authRouter,
	pledgeRouter,
	evalRouter,
	postRouter,
	userRouter
} from './routes';

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION!  Shutting down...');
	console.log(err.name, err.message);
	process.exit(1);
});

const app = express();

app.enable('trust proxy');
app.use(cors());
app.use(helmet());

// Limit requests from same API
app.use(
	rateLimit({
		max: 10000,
		windowMs: 60 * 60 * 1000,
		message: 'Too many requests!'
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(xss());
app.use(compression());

// custom logger
app.use((req, res, next) => {
	logger.info({ message: `Req is to ${req.method} ${req.originalUrl} ` });
	next();
});

// routes
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/auth', authRouter);
app.use('/api/apply', applyRouter);
app.use('/api/pledge', pledgeRouter);
app.use('/api/evaluation', evalRouter);
app.use('/api/post', postRouter);
app.use('/api/user', userRouter);

app.all('*', (req, res, next) => {
	return next(new AppError(`Can't find URL on this server!`, 404));
});

// Error Hanlder
app.use(globalErrorHandler);

// DB connection
sequelize
	.sync({ force: false })
	.then(() => console.log('DB Connected! :: TABLE SYNC'))
	.catch(() => console.log('ERROR: DB Connect'));

redisClient.on('connect', () => console.log('Redis Connected!'));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>
	console.log(`Server is running on ${PORT}`)
);

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION! Shutting down...');
	console.log(err);
	server.close(() => {
		process.exit(1);
	});
});
