// Export central del módulo de médicos.
// Mantiene la compatibilidad del backend mientras se reestructura el código.

const medicosService = require('./services/medicosService');

module.exports = {
    obtenerMedicosPorEspecialidad: medicosService.obtenerMedicosPorEspecialidad,
};
