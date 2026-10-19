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

module.exports = {
    formatDate,
    formatTime,
};
