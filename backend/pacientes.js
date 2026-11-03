// Wrapper de compatibilidad para el módulo legacy de pacientes.
// La lógica real quedó migrada a src/modules/pacientes para mantener un flujo
// modular y facilitar la evolución hacia más tipos de documentos clínicos.

module.exports = require('./src/modules/pacientes');

