 // Carga las variables del archivo .env
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

const { conectarMySQL, conectarMongoDB } = require('./config/basedatos');

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware: parsear formularios y cookies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Archivos estáticos (CSS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('HelpDesk IntegralTI — servidor funcionando');
});

// Iniciar servidor y conexiones
const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, async () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
    await conectarMySQL();
    await conectarMongoDB();
});
