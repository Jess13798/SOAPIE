// Propósito: Punto de entrada del servidor y configuración de rutas.
// Responsable de mantener separadas las reglas de este archivo.

const nandaNocNicService = require('./services/nandaNocNicService');
const serviciosRepository = require('./repositories/factCatalogoServiciosRepository');

module.exports = {
    buscarNandaNocNic: nandaNocNicService.buscarCatalogo,
    buscarServicios: serviciosRepository.buscarServicios,
    obtenerServicioPorFinanciamiento: serviciosRepository.obtenerServicioPorFinanciamiento,
    obtenerTipoFinanciamientoPorId: serviciosRepository.obtenerTipoFinanciamientoPorId,
};
