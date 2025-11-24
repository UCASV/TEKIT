import { getConnection, sql } from '../config/database.js';

export class Service {
    static async create(serviceData) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('profesional_id', sql.Int, serviceData.profesional_id)
                .input('categoria_id', sql.Int, serviceData.categoria_id)
                .input('titulo', sql.NVarChar, serviceData.titulo)
                .input('descripcion', sql.NVarChar, serviceData.descripcion)
                .input('precio', sql.Decimal(10,2), serviceData.precio)
                .input('tipo_precio', sql.NVarChar, serviceData.tipo_precio)
                .query(`
                    INSERT INTO Servicios (profesional_id, categoria_id, titulo, descripcion, precio, tipo_precio, activo)
                    OUTPUT INSERTED.*
                    VALUES (@profesional_id, @categoria_id, @titulo, @descripcion, @precio, @tipo_precio, 1)
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async getByProfessionalId(profesionalId) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('profesional_id', sql.Int, profesionalId)
                .query(`
                    SELECT 
                        s.*,
                        c.nombre as categoria_nombre,
                        c.icono as categoria_icono
                    FROM Servicios s
                    INNER JOIN Categorias c ON s.categoria_id = c.id
                    WHERE s.profesional_id = @profesional_id
                    ORDER BY s.createdAt DESC
                `);
            
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // NUEVO: Eliminar servicio (baja lógica o física)
    static async delete(id, profesionalId) {
        try {
            const pool = await getConnection();
            // Solo permitimos borrar si el servicio pertenece al profesional que lo solicita
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('profesional_id', sql.Int, profesionalId)
                .query(`
                    DELETE FROM Servicios 
                    WHERE id = @id AND profesional_id = @profesional_id
                `);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw error;
        }
    }
}