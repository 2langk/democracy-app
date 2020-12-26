import * as express from 'express';
import * as dotenv from 'dotenv';
import sequelize from './models';

dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json());

sequelize
	.sync({ force: false })
	.then(() => console.log('DB Connected! :: TABLE SYNC'))
	.catch(() => console.log('ERROR: DB Connect'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
