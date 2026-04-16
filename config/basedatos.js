const mysql = require('mysql2/promise');
const mongoose = require('mongoose');

// Conexión a MySQL (Railway)
const conectarMySQL = async () => {
    try {
        const conexion = await mysql.createConnection({
            host:     process.env.DB_HOST,
            port:     process.env.DB_PORT,
            user:     process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log('MySQL conectado correctamente');
        return conexion;
    } catch (error) {
        console.error('Error al conectar MySQL:', error.message);
        process.exit(1);
    }
};

// Conexión a MongoDB (Atlas)
const conectarMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB conectado correctamente');
    } catch (error) {
        console.error('Error al conectar MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = { conectarMySQL, conectarMongoDB };

// Forzar uso de Google DNS para resolver direcciones MongoDB Atlas
require('dns').setDefaultResultOrder('ipv4first');
const dns = require('dns').promises;
dns.setServers(['8.8.8.8', '8.8.4.4']);
