import dotenv from 'dotenv';
dotenv.config();

import app from '../src/app';
import { connectToDatabase } from '../src/mongodb';

const uri = process.env.CONNECTION_STRING || '';

const handler = async (req: any, res: any) => {
  try {
    console.time('mongo');

    await connectToDatabase(uri);

    console.timeEnd('mongo');


    console.time('request');

    const result = await app(req, res);

    console.timeEnd('request');

    return result;

  } catch (error) {
    console.error('❌ Erreur lors de la connexion à la DB dans Vercel', error);

    return res.status(500).send('Erreur serveur');
  }
};

export default handler;