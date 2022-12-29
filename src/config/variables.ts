import dotenv from 'dotenv';
dotenv.config();
import { V4 as paseto } from 'paseto';

const variables = {
  port: Number(process.env.PORT) || 5000,
  mongoUrl: process.env.MONGO_URL || '',
  saltWorkFactor: 10,
  tokenSecret: await paseto.generateKey('public'),
  accessTokenExp: 1000 * 60 * 10, // 10 min
  refreshTokenExp: 1000 * 60 * 60 * 24, // 1 day
  isDevelopment: process.env.NODE_ENV === 'development',
};

export default variables;
