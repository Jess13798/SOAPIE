// Wrapper de compatibilidad para el módulo legacy de diagnósticos.
// La lógica real quedó movida a src/modules/diagnosticos para mantener una
// arquitectura más limpia y extensible de cara a nuevos documentos clínicos.

module.exports = require('./src/modules/diagnosticos');

