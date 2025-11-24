import { getConnection, sql } from '../config/database.js';

export class Review {
    static async create(reviewData) {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();
            const request = new sql.Request(transaction);

            // 1. Insertar la reseña pública (Tabla Resenas)
            await request
                .input('calificador_id', sql.Int, reviewData.calificador_id)
                .input('calificado_id', sql.Int, reviewData.calificado_id)
                .input('calificacion', sql.Int, reviewData.calificacion)
                .input('comentario', sql.NVarChar, reviewData.comentario)
                .query(`
                    INSERT INTO Resenas (calificador_id, calificado_id, calificacion, comentario)
                    VALUES (@calificador_id, @calificado_id, @calificacion, @comentario);
                `);

            // 2. Actualizar la contratación específica (Tabla Contrataciones)
            // ESTO ES LO QUE FALTABA: Guardar la calificación en el historial del servicio
            if (reviewData.contratacion_id) {
                const requestBooking = new sql.Request(transaction);
                await requestBooking
                    .input('id', sql.Int, reviewData.contratacion_id)
                    .input('calificacion', sql.Int, reviewData.calificacion)
                    .query(`
                        UPDATE Contrataciones 
                        SET calificacion = @calificacion 
                        WHERE id = @id
                    `);
            }

            await transaction.commit();
            return { success: true };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    // ... (el método getByProfessional queda igual)
    static async getByProfessional(profesional_usuario_id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('calificado_id', sql.Int, profesional_usuario_id)
                .query(`
                    SELECT 
                        r.*,
                        u.nombre as calificador_nombre,
                        u.apellido as calificador_apellido,
                        u.foto_perfil as calificador_foto
                    FROM Resenas r
                    INNER JOIN Usuarios u ON r.calificador_id = u.id
                    WHERE r.calificado_id = @calificado_id
                    ORDER BY r.createdAt DESC
                `);
            
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }
}