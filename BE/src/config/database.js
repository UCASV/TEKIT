import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: 'TEKIT2',
    port: parseInt(process.env.DB_PORT || '1433'),
    options: {
        encrypt: true, 
        trustServerCertificate: true,
        enableArithAbort: true
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
        // Si ya existe el pool, verificamos si está conectado
        if (pool) {
            if (pool.connected) {
                return pool;
            }
            // Si existe pero no está conectado, intentamos cerrarlo para limpiar
            try {
                await pool.close();
            } catch (e) {
                console.warn('Aviso: Error cerrando pool antiguo:', e.message);
            }
            pool = null;
        }

        console.log('🔄 Intentando conectar a SQL Server...');
        pool = await sql.connect(config);
        console.log('✅ Conectado a SQL Server (TEKIT2)');
        return pool;

    } catch (error) {
        console.error('❌ Error FATAL de conexión a BD:', error.message);
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