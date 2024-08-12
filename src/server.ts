import express from 'express';
import dotenv from 'dotenv'; //Para manejar las variables de entorno
import { connectDB } from './config/db'; //Para ejecutar la conexion 

dotenv.config(); //variables de entorno

connectDB(); //Llama la funcion para conectarse a la base de datos

const app = express();

export default app;