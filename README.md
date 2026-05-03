# HelpDesk IntegralTI

Sistema web de gestión de incidencias TI para uso interno de IntegralTI SpA.
Proyecto de Título: Análisis de Sistemas - Iplacex

## Stack
- Node.js v22 + Express.js v4
- MySQL 9.4 (Railway) + MongoDB Atlas
- HTML5 + CSS3 puro (sin frameworks)
- JWT + bcryptjs

## Demo
https://helpdesk-integralti.onrender.com

## Instalación local

1. Clonar el repositorio
2. Ejecutar `npm install`
3. Renombrar `.env.ejemplo` a `.env` y completar las variables
4. Ejecutar `node app.js`
5. Abrir http://localhost:3000

## Variables de entorno
Ver archivo `.env.ejemplo` en la raíz del proyecto.

## Estructura
- `controllers/` - lógica de negocio
- `models/` - consultas a base de datos
- `routes/` - definición de rutas HTTP
- `views/` - plantillas EJS
- `public/css/` - estilos
- `config/esquema.sql` - modelo de base de datos MySQL