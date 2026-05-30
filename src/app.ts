import express from 'express';
import cors from 'cors';

import studentRouter from './routes/students';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/students', studentRouter);


app.get('/', (_req, res) => {
  res.send('Bienvenue sur ADM Présence 👋');
});

app.get('/test', (_req, res) => {
  res.send('Route test OK');
});


export default app;