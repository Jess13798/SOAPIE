// Wrapper de compatibilidad para el módulo legacy.
// La lógica real quedó movida a src/modules/notas y este archivo conserva
// la API pública anterior para no romper imports del resto del proyecto.

module.exports = require('./src/modules/notas');

