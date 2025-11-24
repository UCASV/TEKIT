import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import professionalRoutes from './routes/professionalRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import locationRoutes from './routes/locationRoutes.js';

dotenv.config();

// Configuración para rutas de archivos en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear carpeta 'uploads' si no existe en la raíz del backend
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('📂 Carpeta uploads creada');
}

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// [SOLUCIÓN]: Aumentar límite a 50mb para subida de imágenes Base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// [SOLUCIÓN]: Servir carpeta estática de uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/locations', locationRoutes);

app.get('/', (req, res) => res.json({ message: 'API TEKIT V2 funcionando 🚀' }));

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error('Error Global:', err);
    res.status(500).json({ success: false, error: err.message });
});

export default app;