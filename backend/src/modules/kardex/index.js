// Propósito: Punto de entrada del servidor y configuración de rutas.
// Responsable de mantener separadas las reglas de este archivo.

const kardexService = require('./services/kardexService');

module.exports = {
    guardarRegistro: kardexService.guardarRegistro,
    obtenerRegistros: kardexService.obtenerRegistros,
};
