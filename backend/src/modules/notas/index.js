// Export central del módulo de notas.
// Este archivo facilita migrar la lógica desde los archivos legacy del backend
// hacia la estructura modular sin romper la compatibilidad del proyecto.

const notasService = require('./services/notasService');

module.exports = {
    guardarNota: notasService.guardarNota,
    obtenerNotas: notasService.obtenerNotas,
    eliminarNota: notasService.eliminarNota,
    obtenerHistorialVitals: notasService.obtenerHistorialVitals,
};
