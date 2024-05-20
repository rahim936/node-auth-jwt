import http from 'http';

import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import ConnectDB from './DB/DataBase.js';

import authRoutes from './Routes/auth.routes.js';
import profileRoutes from './Routes/profile.routes.js';
import refreshTokenRoute from './Routes/refreshToken.routes.js';

dotenv.config();


const app = express();
const server = http.createServer(app);

const HOSTNAME = process.env.APP_HOSTNAME;
const APP_PORT = process.env.APP_PORT;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

ConnectDB()
  .then(() => console.log('Database Connected 👍'))
  .then(() => server.listen(APP_PORT, HOSTNAME, () => console.log('Server is running on http://127.0.0.1:3000/')))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/access/', refreshTokenRoute);
app.use('/api/v1/profile', profileRoutes);

