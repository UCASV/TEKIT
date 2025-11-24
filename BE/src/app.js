import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import professionalRoutes from './routes/professionalRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import locationRoutes from './routes/locationRoutes.js'; 

dotenv.config();

const app = express();

//Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes); 
app.use('/api/locations', locationRoutes);

app.get('/', (req, res) => res.json({ message: 'API TEKIT V2 funcionando 🚀' }));

//Manejo global de errores
app.use((err, req, res, next) => {
    console.error('Error Global:', err);
    res.status(500).json({ success: false, error: err.message });
});

export default app;