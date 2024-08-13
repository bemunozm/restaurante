import express from 'express';
import dotenv from 'dotenv'; //Para manejar las variables de entorno
import { connectDB } from './config/db'; //Para ejecutar la conexion 
import authRoutes from './routes/authRoutes'; //Rutas de autenticacion
import clientRoutes from './routes/clientRoutes'; //Rutas de autenticacion cliente
import sessionRoutes from './routes/sessionRoutes'; //Rutas de sesion

dotenv.config(); //variables de entorno

connectDB(); //Llama la funcion para conectarse a la base de datos

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/session', sessionRoutes);

export default app;