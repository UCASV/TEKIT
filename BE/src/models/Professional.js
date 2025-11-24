import { getConnection, sql } from '../config/database.js';

export class Professional {
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

    static async getFullProfile(usuario_id) {
        try {
            const pool = await getConnection();
            
            const profile = await pool.request()
                .input('usuario_id', sql.Int, usuario_id)
                .query(`
                    SELECT * FROM vw_Profesionales_Completos
                    WHERE usuario_id = @usuario_id
                `);

            if (!profile.recordset[0]) return null;

            const perfil = profile.recordset[0];

            const request = pool.request();
            request.input('profesional_id', sql.Int, perfil.perfil_id);

            const experiencias = await request.query(`SELECT * FROM Experiencias WHERE profesional_id = @profesional_id ORDER BY id DESC`);
            const habilidades = await request.query(`SELECT * FROM Habilidades WHERE profesional_id = @profesional_id`);
            const certificaciones = await request.query(`SELECT * FROM Certificaciones WHERE profesional_id = @profesional_id`);
            const proyectos = await request.query(`SELECT * FROM Proyectos WHERE profesional_id = @profesional_id ORDER BY id DESC`);

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

    static async search(filters = {}) {
        try {
            const pool = await getConnection();
            let query = `
                SELECT * FROM vw_Profesionales_Completos
                WHERE 1=1
            `;
            const request = pool.request();

            if (filters.busqueda) {
                query += ` AND (
                    nombre LIKE @busqueda OR 
                    apellido LIKE @busqueda OR 
                    titulo LIKE @busqueda OR 
                    descripcion LIKE @busqueda
                )`;
                request.input('busqueda', sql.NVarChar, `%${filters.busqueda}%`);
            }

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

    static async update(profesional_id, data) {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();
            const request = new sql.Request(transaction);

            await request
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

            if (data.experiencias) {
                //Usamos un nuevo request para cada query dentro de la transacción
                const reqDelExp = new sql.Request(transaction);
                await reqDelExp.input('pid', sql.Int, profesional_id)
                     .query('DELETE FROM Experiencias WHERE profesional_id = @pid');

                for (const exp of data.experiencias) {
                    const reqInsExp = new sql.Request(transaction);
                    await reqInsExp
                        .input('pid', sql.Int, profesional_id)
                        .input('puesto', sql.NVarChar, exp.puesto)
                        .input('periodo', sql.NVarChar, exp.periodo)
                        .input('descripcion', sql.NVarChar, exp.descripcion)
                        .query(`INSERT INTO Experiencias (profesional_id, puesto, periodo, descripcion) VALUES (@pid, @puesto, @periodo, @descripcion)`);
                }
            }

            if (data.habilidades) {
                const reqDelHab = new sql.Request(transaction);
                await reqDelHab.input('pid', sql.Int, profesional_id)
                     .query('DELETE FROM Habilidades WHERE profesional_id = @pid');

                for (const hab of data.habilidades) {
                    const reqInsHab = new sql.Request(transaction);

                    const nombreHab = typeof hab === 'string' ? hab : hab.nombre;
                    await reqInsHab
                        .input('pid', sql.Int, profesional_id)
                        .input('nombre', sql.NVarChar, nombreHab)
                        .query(`INSERT INTO Habilidades (profesional_id, nombre) VALUES (@pid, @nombre)`);
                }
            }

            if (data.certificaciones) {
                const reqDelCert = new sql.Request(transaction);
                await reqDelCert.input('pid', sql.Int, profesional_id)
                     .query('DELETE FROM Certificaciones WHERE profesional_id = @pid');

                for (const cert of data.certificaciones) {
                    const reqInsCert = new sql.Request(transaction);
                    const nombreCert = typeof cert === 'string' ? cert : cert.nombre;
                    await reqInsCert
                        .input('pid', sql.Int, profesional_id)
                        .input('nombre', sql.NVarChar, nombreCert)
                        .query(`INSERT INTO Certificaciones (profesional_id, nombre) VALUES (@pid, @nombre)`);
                }
            }

            if (data.proyectos) {
                const reqDelProj = new sql.Request(transaction);
                await reqDelProj.input('pid', sql.Int, profesional_id)
                     .query('DELETE FROM Proyectos WHERE profesional_id = @pid');

                for (const proj of data.proyectos) {
                    const reqInsProj = new sql.Request(transaction);
                    await reqInsProj
                        .input('pid', sql.Int, profesional_id)
                        .input('titulo', sql.NVarChar, proj.titulo)
                        .input('fecha', sql.NVarChar, proj.fecha)
                        .input('descripcion', sql.NVarChar, proj.descripcion)
                        .query(`INSERT INTO Proyectos (profesional_id, titulo, fecha, descripcion) VALUES (@pid, @titulo, @fecha, @descripcion)`);
                }
            }

            await transaction.commit();
            return { success: true };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async getGlobalStats() {
        try {
            const pool = await getConnection();
            const result = await pool.request().query(`
                SELECT 
                    COUNT(DISTINCT pp.id) as total_profesionales,
                    COUNT(DISTINCT s.id) as total_servicios,
                    COUNT(DISTINCT c.id) as total_categorias
                FROM Perfiles_Profesionales pp
                LEFT JOIN Servicios s ON pp.id = s.profesional_id AND s.activo = 1
                LEFT JOIN Categorias c ON s.categoria_id = c.id AND c.activo = 1
            `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }
}