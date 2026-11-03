// Export central del módulo de diagnósticos.
// Permite mantener el proyecto compatible mientras se mueve la lógica a una
// estructura más organizada para futuras clínicas y documentaciones.

const diagnosticosService = require('./services/diagnosticosService');

module.exports = {
    obtenerDiagnosticos: diagnosticosService.obtenerDiagnosticos,
};
