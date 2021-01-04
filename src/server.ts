import * as express from 'express';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';
import * as xss from 'xss-clean';

import { sequelize } from './models';
import globalErrorHandler from './utils/globalErrorHandler';
import AppError from './utils/AppError';

// import Routes
import {
	applyRouter,
	authRouter,
	pledgeRouter,
	evalRouter,
	questionRouter
} from './routes';

dotenv.config({ path: './config.env' });

const app = express();

app.enable('trust proxy');
app.use(cors());
app.use(helmet());

// Limit requests from same API
app.use(
	rateLimit({
		max: 100,
		windowMs: 60 * 60 * 1000,
		message: 'Too many requests!'
	})
);

app.use(express.static('uploads'));
app.use(express.json());
app.use(cookieParser());
// After body-parser
app.use(xss());
app.use(compression());

// routes
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/auth', authRouter);
app.use('/api/apply', applyRouter);
app.use('/api/pledge', pledgeRouter);
app.use('/api/evaluation', evalRouter);
app.use('/api/question', questionRouter);

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
