
// =============================================
// BE/src/models/Contact.js
// =============================================
import { getConnection, sql } from '../config/database.js';

export class Contact {
    // Registrar contacto via WhatsApp
    static async register(contactData) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('cliente_id', sql.Int, contactData.cliente_id)
                .input('profesional_id', sql.Int, contactData.profesional_id)
                .query(`
                    INSERT INTO Contactos_WhatsApp (cliente_id, profesional_id)
                    OUTPUT INSERTED.*
                    VALUES (@cliente_id, @profesional_id)
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Obtener estadísticas de contactos de un profesional
    static async getStats(profesional_id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('profesional_id', sql.Int, profesional_id)
                .query(`
                    SELECT 
                        COUNT(*) as total_contactos,
                        COUNT(DISTINCT cliente_id) as clientes_unicos,
                        COUNT(CASE WHEN DATEDIFF(day, createdAt, GETDATE()) <= 7 THEN 1 END) as contactos_semana,
                        COUNT(CASE WHEN DATEDIFF(day, createdAt, GETDATE()) <= 30 THEN 1 END) as contactos_mes
                    FROM Contactos_WhatsApp
                    WHERE profesional_id = @profesional_id
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Verificar si un cliente ya contactó a un profesional
    static async hasContacted(cliente_id, profesional_id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('cliente_id', sql.Int, cliente_id)
                .input('profesional_id', sql.Int, profesional_id)
                .query(`
                    SELECT COUNT(*) as total
                    FROM Contactos_WhatsApp
                    WHERE cliente_id = @cliente_id 
                    AND profesional_id = @profesional_id
                `);
            
            return result.recordset[0].total > 0;
        } catch (error) {
            throw error;
        }
    }
}