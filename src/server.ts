import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import morgan from 'morgan';
import cors from 'cors';


// Configurar variables de entorno y conectar a la base de datos
dotenv.config();
connectDB();

const app = express();
app.use(cors());

// Logging
app.use(morgan('dev'));

// Leer datos de formularios
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);

export default app;
