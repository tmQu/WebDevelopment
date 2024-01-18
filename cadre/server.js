import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {server} from './app.js';

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB)
  .then(() => console.log('Connected!'));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
