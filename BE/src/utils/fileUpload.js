import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveProfilePicture = (base64String, userId) => {
    try {
        // 1. Verificar si es una cadena Base64 válida de imagen
        // Si ya es una URL (http...) o está vacío, devolver tal cual
        if (!base64String || !base64String.match(/^data:image\/\w+;base64,/)) {
            return base64String;
        }

        // 2. Extraer la extensión y los datos
        const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
        const extension = matches[1]; // ej: 'jpeg', 'png'
        const data = matches[2];
        
        // 3. Crear nombre único para el archivo
        const fileName = `user_${userId}_${Date.now()}.${extension}`;
        // Asegúrate de que la ruta relativa suba hasta la raíz del backend para encontrar 'uploads'
        const uploadPath = path.join(__dirname, '../../uploads', fileName);

        // 4. Guardar el archivo en disco
        const buffer = Buffer.from(data, 'base64');
        fs.writeFileSync(uploadPath, buffer);

        // 5. Devolver la URL relativa para guardar en BD
        // Usamos la variable de entorno o un fallback a localhost
        const baseUrl = process.env.API_URL || 'http://localhost:5000';
        return `${baseUrl}/uploads/${fileName}`;

    } catch (error) {
        console.error('Error guardando imagen:', error);
        // Si falla, devolver null o la cadena original para no romper el flujo
        return null;
    }
};