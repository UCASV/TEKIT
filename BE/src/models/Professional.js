
// =============================================
// BE/src/models/Professional.js
// =============================================
import { getConnection, sql } from '../config/database.js';

export class Professional {
    // Crear perfil profesional
    static async create(professionalData) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('usuario_id', sql.Int, professionalData.usuario_id)
                .input('titulo', sql.NVarChar, professionalData.titulo)
                .input('descripcion', sql.NVarChar, professionalData.descripcion)
                .input('ubicacion', sql.NVarChar, professionalData.ubicacion)
                .input('tarifa_por_hora', sql.Decimal(10,2), professionalData.tarifa_por_hora)
                .input('años_experiencia', sql.Int, professionalData.años_experiencia)
                .query(`
                    INSERT INTO Perfiles_Profesionales 
                    (usuario_id, titulo, descripcion, ubicacion, tarifa_por_hora, años_experiencia)
                    OUTPUT INSERTED.*
                    VALUES (@usuario_id, @titulo, @descripcion, @ubicacion, @tarifa_por_hora, @años_experiencia)
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Obtener perfil completo
    static async getFullProfile(usuario_id) {
        try {
            const pool = await getConnection();
            
            // Perfil base
            const profile = await pool.request()
                .input('usuario_id', sql.Int, usuario_id)
                .query(`
                    SELECT * FROM vw_Profesionales_Completos
                    WHERE usuario_id = @usuario_id
                `);

            if (!profile.recordset[0]) return null;

            const perfil = profile.recordset[0];

            // Experiencias
            const experiencias = await pool.request()
                .input('profesional_id', sql.Int, perfil.perfil_id)
                .query(`SELECT * FROM Experiencias WHERE profesional_id = @profesional_id ORDER BY id DESC`);

            // Habilidades
            const habilidades = await pool.request()
                .input('profesional_id', sql.Int, perfil.perfil_id)
                .query(`SELECT * FROM Habilidades WHERE profesional_id = @profesional_id`);

            // Certificaciones
            const certificaciones = await pool.request()
                .input('profesional_id', sql.Int, perfil.perfil_id)
                .query(`SELECT * FROM Certificaciones WHERE profesional_id = @profesional_id`);

            // Proyectos
            const proyectos = await pool.request()
                .input('profesional_id', sql.Int, perfil.perfil_id)
                .query(`SELECT * FROM Proyectos WHERE profesional_id = @profesional_id ORDER BY id DESC`);

            return {
                ...perfil,
                experiencias: experiencias.recordset,
                habilidades: habilidades.recordset,
                certificaciones: certificaciones.recordset,
                proyectos: proyectos.recordset
            };
        } catch (error) {
            throw error;
        }
    }

    // Buscar profesionales con filtros
    static async search(filters = {}) {
        try {
            const pool = await getConnection();
            let query = `
                SELECT * FROM vw_Profesionales_Completos
                WHERE 1=1
            `;
            const request = pool.request();

            if (filters.categoria_id) {
                query += ` AND perfil_id IN (
                    SELECT DISTINCT profesional_id 
                    FROM Servicios 
                    WHERE categoria_id = @categoria_id AND activo = 1
                )`;
                request.input('categoria_id', sql.Int, filters.categoria_id);
            }

            if (filters.ubicacion) {
                query += ` AND ubicacion LIKE @ubicacion`;
                request.input('ubicacion', sql.NVarChar, `%${filters.ubicacion}%`);
            }

            if (filters.tarifa_min) {
                query += ` AND tarifa_por_hora >= @tarifa_min`;
                request.input('tarifa_min', sql.Decimal(10,2), filters.tarifa_min);
            }

            if (filters.tarifa_max) {
                query += ` AND tarifa_por_hora <= @tarifa_max`;
                request.input('tarifa_max', sql.Decimal(10,2), filters.tarifa_max);
            }

            if (filters.calificacion_min) {
                query += ` AND calificacion_promedio >= @calificacion_min`;
                request.input('calificacion_min', sql.Decimal(3,2), filters.calificacion_min);
            }

            query += ` ORDER BY calificacion_promedio DESC, total_resenas DESC`;

            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }

    // Actualizar perfil
    static async update(profesional_id, data) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('id', sql.Int, profesional_id)
                .input('titulo', sql.NVarChar, data.titulo)
                .input('descripcion', sql.NVarChar, data.descripcion)
                .input('ubicacion', sql.NVarChar, data.ubicacion)
                .input('tarifa_por_hora', sql.Decimal(10,2), data.tarifa_por_hora)
                .query(`
                    UPDATE Perfiles_Profesionales 
                    SET titulo = @titulo,
                        descripcion = @descripcion,
                        ubicacion = @ubicacion,
                        tarifa_por_hora = @tarifa_por_hora,
                        updatedAt = GETDATE()
                    OUTPUT INSERTED.*
                    WHERE id = @id
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }
}