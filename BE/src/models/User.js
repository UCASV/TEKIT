import { getConnection, sql } from '../config/database.js';

export class User {
    // Crear usuario
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

    // Buscar por email
    static async findByEmail(email) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('email', sql.NVarChar, email)
                .query(`
                    SELECT u.*, r.nombre as rol_nombre
                    FROM Usuarios u
                    INNER JOIN Roles r ON u.rol_id = r.id
                    WHERE u.email = @email AND u.activo = 1
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Buscar por ID
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

    // Actualizar usuario
    static async update(id, userData) {
        try {
            const pool = await getConnection();
            const result = await pool.request()
                .input('id', sql.Int, id)
                .input('nombre', sql.NVarChar, userData.nombre)
                .input('apellido', sql.NVarChar, userData.apellido)
                .input('telefono', sql.NVarChar, userData.telefono)
                .input('foto_perfil', sql.NVarChar, userData.foto_perfil || null)
                .query(`
                    UPDATE Usuarios 
                    SET nombre = @nombre,
                        apellido = @apellido,
                        telefono = @telefono,
                        foto_perfil = @foto_perfil,
                        updatedAt = GETDATE()
                    OUTPUT INSERTED.*
                    WHERE id = @id
                `);
            
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    // Verificar email
    static async verifyEmail(id) {
        try {
            const pool = await getConnection();
            await pool.request()
                .input('id', sql.Int, id)
                .query(`
                    UPDATE Usuarios 
                    SET email_verificado = 1,
                        updatedAt = GETDATE()
                    WHERE id = @id
                `);
            
            return true;
        } catch (error) {
            throw error;
        }
    }
}