import * as express from 'express';
import * as dotenv from 'dotenv';
import { sequelize } from './models';
import authRouter from './routes/authRouter';

dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);

sequelize
	.sync({ force: false })
	.then(() => console.log('DB Connected! :: TABLE SYNC'))
	.catch(() => console.log('ERROR: DB Connect'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
