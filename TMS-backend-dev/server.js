import express  from 'express';
import dotenv  from 'dotenv';
import cors from 'cors';
import dataBaseConnect from './database/db.js'
import authRouter from './routes/auth.js';
import homeRouter from './routes/homeRoute.js'
import adminRouter from './routes/adminPageRoute.js';
import meRouter from './routes/me.js';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Data Base connection
dataBaseConnect();

// Allow React dev server
app.use(cors({
  origin: "https://task-management-app-sigma-eosin.vercel.app/",
  credentials: true
}));

//express middleware
app.use(express.json());

app.use('/api/TMS/auth', authRouter);
app.use('/api/TMS/user', homeRouter);
app.use('/api/TMS/user', meRouter);
app.use('/api/TMS/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`Server is now running on PORT: ${PORT}`);
});