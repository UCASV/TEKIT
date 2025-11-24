import { getConnection, sql } from '../config/database.js';

export class Contact {
    static async register(data) {
        try {
            const pool = await getConnection();
            await pool.request()
                .input('cliente_id', sql.Int, data.cliente_id)
                .input('profesional_id', sql.Int, data.profesional_id)
                .query(`
                    INSERT INTO Contactos_WhatsApp (cliente_id, profesional_id)
                    VALUES (@cliente_id, @profesional_id)
                `);
            return { success: true };
        } catch (error) {
            throw error;
        }
    }

    // MODIFICADO: Ahora obtiene estadísticas basadas en CONTRATACIONES (Solicitudes)
    static async getStats(profesional_id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('pid', sql.Int, profesional_id)
                .query(`
                    SELECT 
                        -- Total de solicitudes recibidas (Histórico)
                        (SELECT COUNT(*) FROM Contrataciones WHERE profesional_id = @pid) as total_solicitudes,
                        
                        -- Solicitudes de esta semana
                        (SELECT COUNT(*) FROM Contrataciones 
                         WHERE profesional_id = @pid 
                         AND fecha_solicitud >= DATEADD(day, -7, GETDATE())) as solicitudes_semana,
                         
                        -- Dinero estimado del mes (Solo trabajos COMPLETADOS/ACEPTADOS)
                        (SELECT ISNULL(SUM(monto_acordado), 0) FROM Contrataciones 
                         WHERE profesional_id = @pid 
                         AND estado = 'completado'
                         AND MONTH(fecha_solicitud) = MONTH(GETDATE()) 
                         AND YEAR(fecha_solicitud) = YEAR(GETDATE())) as ganancias_mes
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }
}