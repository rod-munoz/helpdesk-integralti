require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { conectarMySQL, conectarMongoDB } = require('./config/basedatos');
const app = express();
const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, async () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
    await conectarMySQL();
    await conectarMongoDB();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', require('./routes/autenticacion'));
app.use('/colaborador', require('./routes/colaborador'));
app.use('/tecnico', require('./routes/tecnico'));
app.use('/tecnico/categorias', require('./routes/categorias'));
app.use('/colaborador/perfil', require('./routes/perfil'));
app.use('/tecnico/perfil', require('./routes/perfil'));
app.use('/tecnico/usuarios', require('./routes/usuarios'));

// Ruta raíz redirige al login
app.get('/', (req, res) => res.redirect('/login'));
