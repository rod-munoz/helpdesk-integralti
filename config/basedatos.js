require('dns').setDefaultResultOrder('ipv4first');
const dns = require('dns').promises;
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mysql = require('mysql2/promise');
const mongoose = require('mongoose');

// Pool de conexiones MySQL (mejor para aplicaciones web)
const pool = mysql.createPool({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Verifica la conexión MySQL al iniciar
const conectarMySQL = async () => {
    try {
        const conexion = await pool.getConnection();
        console.log('MySQL conectado correctamente');
        conexion.release();
    } catch (error) {
        console.error('Error al conectar MySQL:', error.message);
        process.exit(1);
    }
};

// Conexión a MongoDB Atlas
const conectarMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB conectado correctamente');
    } catch (error) {
        console.error('Error al conectar MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = { pool, conectarMySQL, conectarMongoDB };
