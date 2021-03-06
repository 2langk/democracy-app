"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const xss = require("xss-clean");
const models_1 = require("./models");
const globalErrorHandler_1 = require("./utils/globalErrorHandler");
const AppError_1 = require("./utils/AppError");
const logger_1 = require("./utils/logger");
// import Routes
const routes_1 = require("./routes");
dotenv.config({ path: './config.env' });
const app = express();
app.enable('trust proxy');
app.use(cors());
app.use(helmet());
// Limit requests from same API
app.use(rateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests!'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(xss());
app.use(compression());
// custom logger
app.use((req, res, next) => {
    logger_1.default.info({ message: `Req is to ${req.method} ${req.originalUrl} ` });
    next();
});
// routes
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/auth', routes_1.authRouter);
app.use('/api/apply', routes_1.applyRouter);
app.use('/api/pledge', routes_1.pledgeRouter);
app.use('/api/evaluation', routes_1.evalRouter);
app.use('/api/post', routes_1.postRouter);
app.use('/api/user', routes_1.userRouter);
app.all('*', (req, res, next) => {
    return next(new AppError_1.default(`Can't find URL on this server!`, 404));
});
// Error Hanlder
app.use(globalErrorHandler_1.default);
// DB connection
models_1.sequelize
    .sync({ force: false })
    .then(() => console.log('DB Connected! :: TABLE SYNC'))
    .catch(() => console.log('ERROR: DB Connect'));
models_1.redisClient.on('connect', () => console.log('Redis Connected!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
