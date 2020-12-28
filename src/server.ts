import * as express from 'express';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { sequelize } from './models';
import globalErrorHandler from './utils/globalErrorHandler';
import AppError from './utils/AppError';

// routes import
import authRouter from './routes/authRouter';
import applyRouter from './routes/applyRouter';

dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/auth', authRouter);
app.use('/api/apply', applyRouter);
app.all('*', (req, res, next) => {
	return next(new AppError(`Can't find URL on this server!`, 404));
});

app.use(globalErrorHandler);

// DB connection
sequelize
	.sync({ force: false })
	.then(() => console.log('DB Connected! :: TABLE SYNC'))
	.catch(() => console.log('ERROR: DB Connect'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
