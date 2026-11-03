// Utilidades compartidas por módulos del backend.
// Sirven para evitar duplicar funciones simples como validación y formateo.

function nullIfEmpty(value) {
    if (value === undefined || value === null) return null;
    if (typeof value === 'string' && value.trim() === '') return null;
    return value;
}

function parseJsonSafe(value, fallback = {}) {
    if (!value) return fallback;

    try {
        return JSON.parse(value);
    } catch (error) {
        return fallback;
    }
}

function formatDate(dateValue) {
    if (!dateValue) return '';

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';

    return date.toISOString().split('T')[0];
}

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
