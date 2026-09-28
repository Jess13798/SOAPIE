require('dotenv').config();
const sql = require('mssql');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        // Aumentar tiempo de espera por consultas pesadas
        requestTimeout: 30000,      // 30 segundos para cada query
        connectionTimeout: 15000    // 15 segundos para conectar
    }
};

// Solo exportamos la configuracion para que otros archivos la usen
module.exports = { sql, dbConfig };