import express from 'express';
import cors from 'cors';

import studentRouter from './routes/students';
import authRouter from './routes/auths';
import attendancesRouter from './routes/attendances';

import { startSubscriptionCron } from "./jobs/subscriptionCron";
import { hashPassword } from "./utils/generatePswd";

hashPassword("admin123");

const app = express();

startSubscriptionCron(); 

app.use(cors());
app.use(express.json());

app.use('/auths', authRouter);
app.use('/students', studentRouter);
app.use('/attendances', attendancesRouter);


app.get('/', (_req, res) => {
  res.send('Bienvenue sur ADM Présence 👋');
});

app.get('/test', (_req, res) => {
  res.send('Route test OK');
});


export default app;