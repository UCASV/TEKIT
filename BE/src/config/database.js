// =============================================
// BE/src/config/database.js
// =============================================
import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();


const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT || '1433'),
    options: {
        encrypt: true, // Para Azure
        trustServerCertificate: true // Para desarrollo local
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

export const getConnection = async () => {
    try {
        if (!pool) {
            pool = await sql.connect(config);
            console.log('✅ Conectado a SQL Server');
        }
        return pool;
    } catch (error) {
        console.error('❌ Error conectando a la BD:', error.message);
        throw error;
    }
};

export const closeConnection = async () => {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            console.log('✅ Conexión cerrada');
        }
    } catch (error) {
        console.error('❌ Error cerrando conexión:', error.message);
    }
};

export { sql };












