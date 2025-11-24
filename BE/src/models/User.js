import { getConnection, sql } from '../config/database.js';

export class User {

    static async create(userData) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('nombre', sql.NVarChar, userData.nombre)
                .input('apellido', sql.NVarChar, userData.apellido)
                .input('email', sql.NVarChar, userData.email)
                .input('password', sql.NVarChar, userData.password)
                .input('telefono', sql.NVarChar, userData.telefono || null)
                .input('rol_id', sql.Int, userData.rol_id)
                .query(`
                    INSERT INTO Usuarios (nombre, apellido, email, password, telefono, rol_id)
                    OUTPUT INSERTED.*
                    VALUES (@nombre, @apellido, @email, @password, @telefono, @rol_id)
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }


    static async findByEmail(email) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('email', sql.NVarChar, email)
                .query(`
                    SELECT u.*, r.nombre as rol_nombre
                    FROM Usuarios u
                    INNER JOIN Roles r ON u.rol_id = r.id
                    WHERE u.email = @email
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }



    static async findById(id) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query(`
                    SELECT u.*, r.nombre as rol_nombre
                    FROM Usuarios u
                    INNER JOIN Roles r ON u.rol_id = r.id
                    WHERE u.id = @id
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }



    static async update(id, userData) {
        try {
            const pool = await getConnection();
            
            let query = 'UPDATE Usuarios SET updatedAt = GETDATE()';
            const request = pool.request().input('id', sql.Int, id);

            if (userData.nombre !== undefined) {
                query += ', nombre = @nombre';
                request.input('nombre', sql.NVarChar, userData.nombre);
            }
            if (userData.apellido !== undefined) {
                query += ', apellido = @apellido';
                request.input('apellido', sql.NVarChar, userData.apellido);
            }
            if (userData.telefono !== undefined) {
                query += ', telefono = @telefono';
                request.input('telefono', sql.NVarChar, userData.telefono);
            }
            if (userData.foto_perfil !== undefined) {
                query += ', foto_perfil = @foto_perfil';
                request.input('foto_perfil', sql.NVarChar, userData.foto_perfil);
            }

            query += ' OUTPUT INSERTED.* WHERE id = @id';

            const result = await request.query(query);
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async verifyEmail(id) {
        try {
            const pool = await getConnection();
            await pool.request()
                .input('id', sql.Int, id)
                .query(`
                    UPDATE Usuarios 
                    SET email_verificado = 1, updatedAt = GETDATE()
                    WHERE id = @id
                `);
            return true;
        } catch (error) {
            throw error;
        }
    }
}