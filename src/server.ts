import express from 'express';
import dotenv from 'dotenv'; //Para manejar las variables de entorno
import { connectDB } from './config/db'; //Para ejecutar la conexion 
import authRoutes from './routes/authRoutes'; //Rutas de autenticacion

dotenv.config(); //variables de entorno

connectDB(); //Llama la funcion para conectarse a la base de datos

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

export default app;