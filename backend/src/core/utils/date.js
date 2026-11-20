const { executeProcedure } = require('../../../dbHelper');

// Utilidades reutilizables para formateo y normalización de fechas.
// Esto evita duplicar la lógica en cada módulo clínico.

function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
}

function formatTime(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().substring(11, 16);
}

/**
 * Consulta la fecha y hora oficial del servidor de base de datos SQL Server
 * mediante el procedimiento almacenado dbo.RetornaFechaServidorSQL.
 * Si la base de datos no está disponible, cae de forma segura a new Date().
 */
async function obtenerFechaServidorSQL() {
    try {
        const result = await executeProcedure('dbo.RetornaFechaServidorSQL');
        const fechaSQL = result.recordset?.[0]?.FechaHoraSQL;
        if (fechaSQL) {
            return new Date(fechaSQL);
        }
    } catch {
        // Fallback defensivo a hora del servidor de Node.js si la BD no está disponible
    }
    return new Date();
}

module.exports = {
    formatDate,
    formatTime,
    obtenerFechaServidorSQL,
};
