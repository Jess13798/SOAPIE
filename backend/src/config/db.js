// Archivo de configuración central para la infraestructura de persistencia.
// Mantiene la conexión de SQL Server separada del dominio de la aplicación.
// Esta capa es la base para que luego se puedan reemplazar detalles de BD.

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        requestTimeout: 30000,
        connectionTimeout: 15000,
    },
};

module.exports = {
    dbConfig,
};
