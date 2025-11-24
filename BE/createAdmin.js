import { User } from './src/models/User.js';
import { hashPassword } from './src/utils/helpers.js';
import { ROLES } from './src/config/constants.js';

const createAdminUser = async () => {
    try {
        console.log('🔧 Creando usuario administrador...');

        const adminData = {
            nombre: 'Jeremias',
            apellido: 'Artiga',
            email: 'Jartiga@tekit.com',
            password: 'contraSegura',
            telefono: '7000-0000',
            rol_id: 3
        };

        const existingAdmin = await User.findByEmail(adminData.email);
        if (existingAdmin) {
            console.log('❌ Ya existe un usuario con el email:', adminData.email);
            console.log('👤 Usuario existente ID:', existingAdmin.id);
            return;
        }

        console.log('🔐 Hasheando contraseña...');
        const hashedPassword = await hashPassword(adminData.password);

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


createAdminUser();