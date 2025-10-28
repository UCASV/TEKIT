// =============================================
// BE/server.js - Punto de entrada
// =============================================
import dotenv from 'dotenv';
import app from './src/app.js';
import { getConnection } from './src/config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Iniciar servidor
const startServer = async () => {
    try {
        // Probar conexión a BD
        await getConnection();
        console.log('✅ Conexión a base de datos establecida');
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`📍 Ambiente: ${process.env.NODE_ENV}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error iniciando servidor:', error.message);
        process.exit(1);
    }
};

startServer();

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM recibido, cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT recibido, cerrando servidor...');
    process.exit(0);
});