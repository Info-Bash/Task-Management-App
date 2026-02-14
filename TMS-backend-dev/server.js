import express  from 'express';
import dotenv  from 'dotenv';
import cors from 'cors';
import dataBaseConnect from './database/db.js'
import authRouter from './routes/auth.js';
import homeRouter from './routes/homeRoute.js'
import meRouter from './routes/me.js';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Data Base connection
dataBaseConnect();

// Allow React dev server
app.use(cors({
  origin: 'http://localhost:5173'
}));

//express middleware
app.use(express.json());

app.use('/api/TMS', authRouter);
app.use('/api/TMS', homeRouter);
app.use('/api/TMS', meRouter);

app.listen(PORT, () => {
  console.log(`Server is now running on PORT: ${PORT}`);
});