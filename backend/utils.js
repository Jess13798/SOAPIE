// Utilidades compartidas por módulos del backend.
// Sirven para evitar duplicar funciones simples como validación y formateo.

/**
 * Implementa la operación "nullIfEmpty".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


function nullIfEmpty(value) {
    if (value === undefined || value === null) return null;
    if (typeof value === 'string' && value.trim() === '') return null;
    return value;
}

/**
 * Implementa la operación "parseJsonSafe".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


function parseJsonSafe(value, fallback = {}) {
    if (!value) return fallback;

    try {
        return JSON.parse(value);
    } catch (error) {
        return fallback;
    }
}

/**
 * Implementa la operación "formatDate".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


function formatDate(dateValue) {
    if (!dateValue) return '';

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';

    return date.toISOString().split('T')[0];
}

/**
 * Implementa la operación "formatTime".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


function formatTime(dateValue) {
    if (!dateValue) return '';

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';

    return date.toISOString().substring(11, 16);
}

module.exports = {
    nullIfEmpty,
    parseJsonSafe,
    formatDate,
    formatTime,
};
