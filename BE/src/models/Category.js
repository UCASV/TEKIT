// =============================================
// BE/src/models/Category.js
// =============================================
import { getConnection, sql } from '../config/database.js';

export class Category {
    // Obtener todas las categorías con estadísticas reales
    static async getAll() {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .query(`
                    SELECT 
                        c.id,
                        c.nombre,
                        c.descripcion,
                        c.icono,
                        (SELECT COUNT(*) FROM Servicios s WHERE s.categoria_id = c.id AND s.activo = 1) as total_servicios,
                        (SELECT COUNT(DISTINCT s.profesional_id) 
                         FROM Servicios s 
                         WHERE s.categoria_id = c.id AND s.activo = 1) as total_profesionales
                    FROM Categorias c
                    WHERE c.activo = 1
                    ORDER BY c.nombre
                `);
            
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Obtener por ID con estadísticas
    static async getById(id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query(`
                    SELECT c.*,
                        (SELECT COUNT(*) FROM Servicios s WHERE s.categoria_id = c.id AND s.activo = 1) as total_servicios,
                        (SELECT COUNT(DISTINCT s.profesional_id) 
                         FROM Servicios s 
                         WHERE s.categoria_id = c.id AND s.activo = 1) as total_profesionales
                    FROM Categorias c
                    WHERE c.id = @id AND c.activo = 1
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Obtener estadísticas detalladas de una categoría
    static async getStats(id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query(`
                    SELECT 
                        (SELECT COUNT(*) FROM Servicios s WHERE s.categoria_id = @id AND s.activo = 1) as total_servicios,
                        (SELECT COUNT(DISTINCT s.profesional_id) 
                         FROM Servicios s 
                         WHERE s.categoria_id = @id AND s.activo = 1) as total_profesionales,
                        (SELECT AVG(pp.calificacion_promedio)
                         FROM Servicios s
                         INNER JOIN Perfiles_Profesionales pp ON s.profesional_id = pp.id
                         WHERE s.categoria_id = @id AND s.activo = 1) as calificacion_promedio,
                        (SELECT AVG(s.precio)
                         FROM Servicios s
                         WHERE s.categoria_id = @id AND s.activo = 1 AND s.precio IS NOT NULL) as precio_promedio
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }
}