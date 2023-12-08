import express from 'express';
import morgan from 'morgan';
import boardRouter from './routes/boardRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors'


const app = express();
app.use(cors());
const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/boards', boardRouter);

export default app;
