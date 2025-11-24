---
# TEKIT 

Plataforma web que conecta *clientes* con *profesionales verificados* en áreas como fontanería, electricidad, carpintería, informática, diseño, construcción y más. Permite buscar, filtrar, contactar y contratar profesionales, mientras que los profesionales pueden publicar servicios, gestionar su perfil y recibir reseñas.

---

# 📋 Tabla de Contenidos

* Instalación
* Configuración
* Ejecución
* Uso del sistema
* Apartado técnico
* Créditos

---

# Instalación

Clona el repositorio:

bash
git clone https://github.com/UCASV/TEKIT.git


---

# Configuración

## Requisitos Previos

* Node.js >= 18
* SQL Server 2019+ o PostgreSQL >= 14 (según entorno académico)
* Git
* npm >= 8

---

# Backend

bash
cd BE
npm install


Crea .env:

env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tekit_db
JWT_SECRET=tu_clave_secreta
CORS_ORIGIN=http://localhost:5173


Crear base de datos (entorno PostgreSQL utilizado en documentación académica):

bash
psql -U postgres
CREATE DATABASE tekit_db;
\q
npm run migrate


---

# Frontend

bash
cd FE/vite-project
npm install


Crear .env:

env
VITE_API_URL=http://localhost:5000/api


---

# Ejecución

## Backend

bash
cd BE
npm run dev


Disponible en:
http://localhost:5000

## Frontend

bash
cd FE/vite-project
npm run dev


Disponible en:
http://localhost:5173

---

# Uso del Sistema

## Para Clientes

### 1. Registro

1. Clic en “Regístrate”.
2. Completa datos personales.
3. Selecciona *Cliente*.
4. Acepta términos y confirma.

### 2. Buscar Profesionales

* Barra de búsqueda.
* Filtros: categoría, precio, ubicación, calificación.
* Resultados en tarjetas.

### 3. Ver Perfil y Contactar

* Ver: experiencia, habilidades, proyectos, reseñas.
* Contacto vía WhatsApp o formulario.

### 4. Mi Cuenta

* Editar datos.
* Historial.
* Reseñas recibidas.

### 5. Dejar Reseña

* Calificar (1–5).
* Agregar comentario.

---

## Para Profesionales

### 1. Registro

* Datos personales.
* Seleccionar *Profesional*.
* Completar profesión, experiencia, tarifa, descripción.

### 2. Completar Perfil Público

* Foto.
* Experiencia laboral.
* Habilidades.
* Certificaciones.
* Proyectos.

### 3. Publicar Servicio

* Categoría.
* Título.
* Descripción.
* Precio (por hora, fijo o a consultar).

### 4. Dashboard

* Servicios activos.
* Contactos recibidos.
* Ingresos estimados.
* Acciones rápidas.

### 5. Gestionar Servicios

* Editar.
* Pausar.
* Eliminar.

### 6. Contactos y Reseñas

* Notificaciones de contacto.
* Reseñas de clientes.

---

# APARTADO TÉCNICO

## Descripción del Proyecto

TEKIT es una plataforma web tipo marketplace que conecta clientes con profesionales de servicios en El Salvador. Incluye autenticación JWT, filtro avanzado de búsqueda, perfiles profesionales completos, panel de usuario, sistema de reseñas, servicios publicados y contacto con profesionales.

### Características

* Búsqueda avanzada con filtros.
* Perfiles profesionales completos.
* Reseñas y calificaciones.
* Panel de control para profesionales.
* Diseño responsive.
* Autenticación segura.
* Estadísticas y análisis.

---

# Stack Tecnológico

## Frontend

* React 19.1.1
* React Router DOM 7.9.4
* Bootstrap 5 + React Bootstrap
* Axios
* Vite
* Lucide Icons

## Backend

* Node.js (ES Modules)
* Express 5
* Microsoft SQL Server
* JWT (jsonwebtoken)
* bcryptjs
* mssql (Tedious)

---

# Arquitectura


React (SPA)
   |
HTTP/REST
   |
Express.js (Backend)
   |
SQL Server (Database)


---
```
TEKIT/
├── BE/
│   ├── src/
│   │   ├── app.js
│   │   └── server.js
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── .env
│   └── createAdmin.js
│
└── FE/
    └── vite-project/
        ├── public/
        ├── src/
        │   ├── assets/
        │   ├── components/
        │   ├── screens/
        │   ├── context/
        │   ├── services/
        │   ├── routes/
        │   ├── hooks/
        │   ├── utils/
        │   ├── App.jsx
        │   ├── main.jsx
        │   └── index.css
        ├── .env.local
        └── vite.config.js
```


---

# Configuración de Base de Datos

Incluye:

* Tabla de Roles
* Usuarios
* Categorías
* Perfiles Profesionales
* Servicios
* Reseñas
* Contactos
* Vista vw_Profesionales_Completos
* Seed de roles y categorías
---

# Sistema de Autenticación

* JWT con expiración de 7 días.
* Middleware authenticate.
* Middleware authorize.
* Hash de contraseñas con bcrypt.
* Interceptor Axios para incluir token en headers.

Incluye ejemplos completos de:

* Generación de token.
* Validación.
* Estructura del AuthContext.

---

# API Endpoints

Incluye todos los endpoints:

### /api/auth

* register
* login
* profile (GET y PUT)

### /api/professionals

* search
* detalles
* update profile

### /api/services

* create
* update
* delete (soft delete)
* listar servicios propios

### /api/reviews

* create
* update
* delete
* obtener reseñas por profesional

### /api/categories

* listar
* obtener por ID
* estadísticas

### /api/contacts

* registrar contacto
* estadísticas de contactos

Todos los ejemplos JSON incluidos.

---

# Componentes Frontend

Incluye componentes:

* MainLayout
* Navbar
* Search
* PerfilContratante
* ProfilePage
* ServiceForm
* Categories

Con sus funcionalidades, props, validaciones y flujos internos.

---

# Base de Datos — Modelo Entidad Relación

Incluye entidades:

* Roles
* Usuarios
* Perfiles_Profesionales
* Servicios
* Reseñas
* Categorías
* Contactos

y la vista SQL completa.

---

# Seguridad

Incluye:

* Hash bcrypt
* CORS
* Prevención SQL Injection
* XSS Protection
* Rate limiting
* Manejo de errores

---

# Deployment

Incluye:

* Variables producción
* Build frontend
* Configuración de hosting (Azure, Netlify, Vercel)
* Ejemplo completo de configuración NGINX
* Backup y restore SQL Server

---

# Contribución

* Flujo Git
* Ramas feature
* Commits convencionales
* Estándares de código para frontend y backend

---

# Créditos

### UNIVERSIDAD CENTROAMERICANA JOSÉ SIMEÓN CAÑAS

*PROYECTO FINAL - TEKIT*

*Integrantes:*

* Andrea Pamela Álvarez Lopez - 00073824@uca.edu.sv
* Jeremías Alessandro Artiga Pérez - 00171124@uca.edu.sv
* Cesar Alejandro Chiquillo Vides - 00225424@uca.edu.sv 
* Julio Alejandro Flores Diaz - 00018824@uca.edu.sv 
* Luis Amílcar García Ruiz - 00114124@uca.edu.sv

---

*Hecho con ❤ para conectar experto con clientes en El Salvador*
