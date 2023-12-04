import express from 'express';
import morgan from 'morgan';
import boardRouter from './routes/boardRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/boards', boardRouter);
app.post('/test', (req, res) => {
  console.log(req.body);
})
export default app;
