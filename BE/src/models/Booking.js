import { getConnection, sql } from '../config/database.js';

export class Booking {
    // Obtener historial de servicios de un cliente
    static async getByClient(cliente_id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('cliente_id', sql.Int, cliente_id)
                .query(`
                    SELECT 
                        c.id,
                        c.titulo_trabajo as servicio,
                        c.fecha_solicitud as fecha,
                        c.monto_acordado as monto,
                        c.estado,
                        c.calificacion,
                        c.comentario_cliente as comentario,
                        u_prof.nombre + ' ' + u_prof.apellido as profesional_nombre,
                        u_prof.id as profesional_usuario_id
                    FROM Contrataciones c
                    INNER JOIN Perfiles_Profesionales pp ON c.profesional_id = pp.id
                    INNER JOIN Usuarios u_prof ON pp.usuario_id = u_prof.id
                    WHERE c.cliente_id = @cliente_id
                    ORDER BY c.fecha_solicitud DESC
                `);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // NUEVO: Crear una contratación (Solicitud de servicio)
    static async create(data) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('cliente_id', sql.Int, data.cliente_id)
                .input('profesional_id', sql.Int, data.profesional_id) // ID del Perfil Profesional
                .input('servicio_id', sql.Int, data.servicio_id || null)
                .input('titulo_trabajo', sql.NVarChar, data.titulo_trabajo)
                .input('monto_acordado', sql.Decimal(10,2), data.monto_acordado || 0)
                .input('comentario_cliente', sql.NVarChar, data.comentario_cliente || '')
                .query(`
                    INSERT INTO Contrataciones (cliente_id, profesional_id, servicio_id, titulo_trabajo, monto_acordado, comentario_cliente, estado)
                    OUTPUT INSERTED.*
                    VALUES (@cliente_id, @profesional_id, @servicio_id, @titulo_trabajo, @monto_acordado, @comentario_cliente, 'pendiente')
                `);
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // NUEVO: Obtener solicitudes para el profesional (Para su Dashboard)
    static async getByProfessional(profesional_id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('profesional_id', sql.Int, profesional_id)
                .query(`
                    SELECT 
                        c.id,
                        c.titulo_trabajo,
                        c.comentario_cliente,
                        c.fecha_solicitud,
                        c.estado,
                        c.monto_acordado,
                        u_cli.nombre + ' ' + u_cli.apellido as cliente_nombre,
                        u_cli.telefono as cliente_telefono,
                        u_cli.email as cliente_email
                    FROM Contrataciones c
                    INNER JOIN Usuarios u_cli ON c.cliente_id = u_cli.id
                    WHERE c.profesional_id = @profesional_id
                    ORDER BY c.fecha_solicitud DESC
                `);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // NUEVO: Actualizar estado (Pendiente -> Completado/Cancelado)
    static async updateStatus(id, estado) {
        try {
            const pool = await getConnection();
            await pool.request()
                .input('id', sql.Int, id)
                .input('estado', sql.NVarChar, estado)
                .query(`UPDATE Contrataciones SET estado = @estado, fecha_finalizacion = GETDATE() WHERE id = @id`);
            return { success: true };
        } catch (error) {
            throw error;
        }
    }
}