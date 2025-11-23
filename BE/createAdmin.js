// =============================================
// Script para crear usuario administrador
// =============================================
import { User } from './src/models/User.js';
import { hashPassword } from './src/utils/helpers.js';
import { ROLES } from './src/config/constants.js';

const createAdminUser = async () => {
    try {
        console.log('🔧 Creando usuario administrador...');

        // Datos del administrador
        const adminData = {
            nombre: 'Jeremias',
            apellido: 'Artiga',
            email: 'Jartiga@tekit.com',
            password: 'contraSegura', // Cambia esta contraseña por una más segura
            telefono: '7000-0000',
            rol_id: 3
        };

        // Verificar si ya existe un admin con este email
        const existingAdmin = await User.findByEmail(adminData.email);
        if (existingAdmin) {
            console.log('❌ Ya existe un usuario con el email:', adminData.email);
            console.log('👤 Usuario existente ID:', existingAdmin.id);
            return;
        }

        // Hashear la contraseña
        console.log('🔐 Hasheando contraseña...');
        const hashedPassword = await hashPassword(adminData.password);

        // Crear el usuario administrador
        const userData = {
            nombre: adminData.nombre,
            apellido: adminData.apellido,
            email: adminData.email,
            password: hashedPassword,
            telefono: adminData.telefono,
            rol_id: adminData.rol_id
        };

        const newAdmin = await User.create(userData);
        
        console.log('✅ Usuario administrador creado exitosamente!');
        console.log('📧 Email:', adminData.email);
        console.log('🔑 Contraseña:', adminData.password);
        console.log('👤 ID de usuario:', newAdmin.id);
        console.log('🔐 Rol ID:', ROLES.ADMIN);
        console.log('');
        console.log('⚠️  IMPORTANTE: Guarda estas credenciales en un lugar seguro y cambia la contraseña después del primer login.');

    } catch (error) {
        console.error('❌ Error creando administrador:', error.message);
        console.error('📋 Stack trace:', error.stack);
    } finally {
        process.exit(0);
    }
};

// Ejecutar el script
createAdminUser();