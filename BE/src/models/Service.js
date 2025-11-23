// =============================================
// BE/src/models/Service.js
// =============================================
import { getConnection, sql } from '../config/database.js';

export class Service {
    // Crear servicio
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
                    INSERT INTO Servicios 
                    (profesional_id, categoria_id, titulo, descripcion, precio, tipo_precio)
                    OUTPUT INSERTED.*
                    VALUES (@profesional_id, @categoria_id, @titulo, @descripcion, @precio, @tipo_precio)
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Obtener servicios de un profesional
    static async getByProfessional(profesional_id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('profesional_id', sql.Int, profesional_id)
                .query(`
                    SELECT s.*, c.nombre as categoria_nombre, c.icono as categoria_icono
                    FROM Servicios s
                    INNER JOIN Categorias c ON s.categoria_id = c.id
                    WHERE s.profesional_id = @profesional_id AND s.activo = 1
                    ORDER BY s.createdAt DESC
                `);
            
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Obtener servicios por categoría
    static async getByCategory(categoria_id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('categoria_id', sql.Int, categoria_id)
                .query(`
                    SELECT s.*, 
                        pp.id as perfil_id,
                        u.nombre + ' ' + u.apellido as profesional_nombre,
                        u.foto_perfil,
                        pp.calificacion_promedio,
                        pp.total_resenas,
                        pp.ubicacion
                    FROM Servicios s
                    INNER JOIN Perfiles_Profesionales pp ON s.profesional_id = pp.id
                    INNER JOIN Usuarios u ON pp.usuario_id = u.id
                    WHERE s.categoria_id = @categoria_id 
                    AND s.activo = 1 
                    AND pp.disponible = 1
                    ORDER BY pp.calificacion_promedio DESC, pp.total_resenas DESC
                `);
            
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar servicio
    static async update(id, serviceData) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('titulo', sql.NVarChar, serviceData.titulo)
                .input('descripcion', sql.NVarChar, serviceData.descripcion)
                .input('precio', sql.Decimal(10,2), serviceData.precio)
                .input('tipo_precio', sql.NVarChar, serviceData.tipo_precio)
                .query(`
                    UPDATE Servicios 
                    SET titulo = @titulo,
                        descripcion = @descripcion,
                        precio = @precio,
                        tipo_precio = @tipo_precio,
                        updatedAt = GETDATE()
                    OUTPUT INSERTED.*
                    WHERE id = @id
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Eliminar servicio
    static async delete(id) {
        try {
            const pool = await getConnection();
            await pool.request()
                .input('id', sql.Int, id)
                .query(`
                    UPDATE Servicios 
                    SET activo = 0,
                        updatedAt = GETDATE()
                    WHERE id = @id
                `);
            
            return true;
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
                    SELECT s.*, c.nombre as categoria_nombre
                    FROM Servicios s
                    INNER JOIN Categorias c ON s.categoria_id = c.id
                    WHERE s.id = @id
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }
}