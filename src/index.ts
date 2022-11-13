import app from './app';
import dbConnect from './config/database';
import configVariables from './config/variables';

const { port, mongoUrl } = configVariables;

try {
  await dbConnect(mongoUrl);

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
  });
} catch (error) {
  console.log(error);
}
