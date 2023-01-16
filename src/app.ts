import express from 'express';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import variables from './config/variables';

import authRouter from './routes/authRoutes';
import groupRouter from './routes/groupRoutes';
import eventRouter from './routes/eventRoutes';
import wishlistRouter from './routes/wishlistRoutes';

import { notFound, catchErrors } from './middleware/errors';

const app = express();

app.use(express.json());
app.use(cookieParser(variables.tokenSecret.toString()));

app.get('/ping', (req, res) => {
  res.send('API is working...');
});

app.use('/auth', authRouter);
app.use('/group', groupRouter);
app.use('/event', eventRouter);
app.use('/wishlist', wishlistRouter);

app.use(notFound);
app.use(catchErrors);

export default app;
