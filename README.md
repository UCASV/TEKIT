TEKIT
Plataforma web que conecta clientes con profesionales verificados en áreas como fontanería, electricidad, carpintería, diseño y más.

📋 Tabla de Contenidos
Instalación
Configuración
Ejecución
Uso del sistema
Créditos
Instalación
Clona el repositorio:

git clone https://github.com/UCASV/TEKIT.git
Configuración
Requisitos Previos
Node.js >= 18.0.0
PostgreSQL >= 14.0
npm >= 8.0.0
Backend
cd BE
npm install
Crea .env:

PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tekit_db
JWT_SECRET=tu_clave_secreta
CORS_ORIGIN=http://localhost:5173
Crea la base de datos:

psql -U postgres
CREATE DATABASE tekit_db;
\q
npm run migrate
Frontend
cd FE/vite-project
npm install
Crea .env:

VITE_API_URL=http://localhost:5000/api
Ejecución
Backend:

cd BE
cd script.js
npm run dev
Disponible en: http://localhost:5000

Frontend:

cd FE/vite-project
npm run dev
Disponible en: http://localhost:5173

Uso del Sistema
Para Clientes
1. Registro
Clic en "Regístrate"
Completa datos personales (Paso 1)
Selecciona tipo "Cliente" (Paso 2)
Acepta términos y crea cuenta
2. Buscar Profesionales
Usa la barra de búsqueda o "Explorar"
Aplica filtros: categoría, precio, ubicación, calificación
Ver resultados en tarjetas con información clave
3. Ver Perfil y Contactar
Haz clic en "Ver Perfil" del profesional
Revisa: experiencia, habilidades, proyectos, reseñas
Contacta vía WhatsApp o formulario
4. Mi Cuenta
Editar datos personales
Ver historial de servicios
Consultar reseñas recibidas
5. Dejar Reseña
Navega al perfil del profesional
Califica (1-5 estrellas) y comenta
Para Trabajadores
1. Registro
Completa datos personales (Paso 1)
Selecciona "Trabajador" (Paso 2)
Agrega: profesión, experiencia, tarifa, descripción
2. Completar Perfil Público
Mi Perfil → "Perfil Público" → "Editar"
Agrega: foto, experiencia laboral, habilidades, certificaciones, proyectos
3. Publicar Servicio
Clic en "Publicar Servicio"
Completa: categoría, título, descripción, precio
4. Dashboard
Visualiza: servicios activos, contactos, ingresos estimados
Acciones rápidas: crear servicio, ver solicitudes
5. Gestionar Servicios
Editar, pausar o eliminar servicios
6. Contactos y Reseñas
Recibe notificaciones de contactos
Consulta reseñas de clientes
Técnico
Créditos
UNIVERSIDAD CENTROAMERICANA JOSÉ SIMEÓN CAÑAS
PROYECTO FINAL - TEKIT MARKETPLACE

Integrantes:

Andrea Pamela Álvarez Lopez - 00073824@uca.edu.sv
Jeremías Alessandro Artiga Pérez - 00171124@uca.edu.sv
Cesar Alejandro Chiquillo Vides - 00225424@uca.edu.sv
Julio Alejandro Flores Diaz - 00018824@uca.edu.sv
Luis Amílcar García Ruiz - 00114124@uca.edu.sv
"Hecho con ❤️ para conectar a El Salvador"


