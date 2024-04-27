import app from './app';
import mongoose from 'mongoose';

const port = process.env.PORT || 5000;
const uri = process.env.DB_URI as string;

console.log('uri', uri);
console.log('port', port);

mongoose
  .connect(uri, {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB', err);
  });

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
