// Export central del módulo de balance hídrico.
const balanceHidricoService = require('./services/balanceHidricoService');

module.exports = {
    guardarRegistro: balanceHidricoService.guardarRegistro,
    obtenerRegistros: balanceHidricoService.obtenerRegistros,
    eliminarRegistro: balanceHidricoService.eliminarRegistro,
};
