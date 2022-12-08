import express from 'express';
import 'express-async-errors';
const app = express();

import authRouter from './routes/authRoutes';

import { notFound, catchErrors } from './middleware/errors';

app.use(express.json());

app.get('/', (req, res) => {
  // res.send('API is working...');
  res.send({ id: req.body.id });
});

app.use('/auth', authRouter);

app.use(notFound);
app.use(catchErrors);

export default app;
