import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import ingredientRoutes from './routes/ingredientRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import tableRoutes from './routes/tableRoutes';
import sessionRoutes from './routes/sessionRoutes';
import roleRoutes from './routes/roleRoutes';
import orderRoutes from './routes/orderRoutes';
import transbankRoutes from './routes/transbankRoutes';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';


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
app.use('/api/ingredient', ingredientRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/table', tableRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/transbank', transbankRoutes);
// Servir las imágenes estáticas
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

export default app;
