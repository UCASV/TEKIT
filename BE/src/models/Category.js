
// =============================================
// BE/src/models/Category.js
// =============================================
import { getConnection, sql } from '../config/database.js';

export class Category {
    // Obtener todas las categorías
    static async getAll() {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .query(`
                    SELECT c.*,
                        (SELECT COUNT(*) FROM Servicios s WHERE s.categoria_id = c.id AND s.activo = 1) as total_servicios
                    FROM Categorias c
                    WHERE c.activo = 1
                    ORDER BY c.nombre
                `);
            
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Obtener por ID
    static async getById(id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query(`
                    SELECT * FROM Categorias
                    WHERE id = @id AND activo = 1
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }
}