import express from 'express';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import variables from './config/variables';
const app = express();

import authRouter from './routes/authRoutes';
import groupRouter from './routes/groupRouter';

import { notFound, catchErrors } from './middleware/errors';

app.use(express.json());
app.use(cookieParser(variables.tokenSecret.toString()));

app.get('/ping', (req, res) => {
  res.send('API is working...');
});

app.use('/auth', authRouter);
app.use('/group', groupRouter);

app.use(notFound);
app.use(catchErrors);

export default app;
