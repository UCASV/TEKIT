import { getConnection } from '../config/database.js';

export class Location {
    static async getAll() {
        try {
            const pool = await getConnection();
            const result = await pool.request().query('SELECT * FROM Ubicaciones WHERE activo = 1 ORDER BY nombre');
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }
}