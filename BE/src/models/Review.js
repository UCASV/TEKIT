
// =============================================
// BE/src/models/Review.js
// =============================================
import { getConnection, sql } from '../config/database.js';

export class Review {
    // Crear reseña (sin necesidad de reserva)
    static async create(reviewData) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('calificador_id', sql.Int, reviewData.calificador_id)
                .input('calificado_id', sql.Int, reviewData.calificado_id)
                .input('calificacion', sql.Int, reviewData.calificacion)
                .input('comentario', sql.NVarChar, reviewData.comentario)
                .query(`
                    INSERT INTO Resenas 
                    (calificador_id, calificado_id, calificacion, comentario)
                    OUTPUT INSERTED.*
                    VALUES (@calificador_id, @calificado_id, @calificacion, @comentario)
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Obtener reseñas de un profesional
    static async getByProfessional(usuario_id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('usuario_id', sql.Int, usuario_id)
                .query(`
                    SELECT r.*,
                        u_calificador.nombre as calificador_nombre,
                        u_calificador.apellido as calificador_apellido,
                        u_calificador.foto_perfil as calificador_foto
                    FROM Resenas r
                    INNER JOIN Usuarios u_calificador ON r.calificador_id = u_calificador.id
                    WHERE r.calificado_id = @usuario_id
                    ORDER BY r.createdAt DESC
                `);
            
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Verificar si un usuario ya dejó reseña a un profesional
    static async checkExisting(calificador_id, calificado_id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('calificador_id', sql.Int, calificador_id)
                .input('calificado_id', sql.Int, calificado_id)
                .query(`
                    SELECT COUNT(*) as total
                    FROM Resenas
                    WHERE calificador_id = @calificador_id 
                    AND calificado_id = @calificado_id
                `);
            
            return result.recordset[0].total > 0;
        } catch (error) {
            throw error;
        }
    }
}