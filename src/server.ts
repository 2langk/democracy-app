import * as express from 'express';
import * as dotenv from 'dotenv';
import User from './models/User';
import sequelize from './models/sequelize';

dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json());

app.post('/create', async (req, res) => {
	const newUser = await User.create(req.body);

	res.json({
		newUser
	});
});

sequelize
	.sync({ force: false })
	.then(() => console.log('DB Connected! :: TABLE SYNC'))
	.catch(() => console.log('ERROR: DB Connect'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
