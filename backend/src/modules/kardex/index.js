const kardexService = require('./services/kardexService');

module.exports = {
    guardarRegistro: kardexService.guardarRegistro,
    obtenerRegistros: kardexService.obtenerRegistros,
};
