import express from 'express';
import 'express-async-errors';
const app = express();

import { notFound, catchErrors } from './middleware/errors';

app.get('/', (req, res) => {
  res.send('API is working...');
});

app.use(notFound);
app.use(catchErrors);

export default app;
