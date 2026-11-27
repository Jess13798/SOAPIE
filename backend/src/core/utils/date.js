// Propósito: Implementación del archivo date.js.
// Responsable de mantener separadas las reglas de este archivo.

const { executeProcedure } = require('../../../dbHelper');

// Utilidades reutilizables para formateo y normalización de fechas.
// Esto evita duplicar la lógica en cada módulo clínico.

/**
 * Implementa la operación "formatDate".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */

function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
}

/**
 * Implementa la operación "formatTime".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


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
/**
 * Implementa la operación "obtenerFechaServidorSQL".
 * Mantiene aislada la responsabilidad principal de este archivo.
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
