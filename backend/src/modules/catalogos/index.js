const nandaNocNicService = require('./services/nandaNocNicService');
const serviciosRepository = require('./repositories/factCatalogoServiciosRepository');

module.exports = {
    buscarNandaNocNic: nandaNocNicService.buscarCatalogo,
    buscarServicios: serviciosRepository.buscarServicios,
    obtenerServicioPorFinanciamiento: serviciosRepository.obtenerServicioPorFinanciamiento,
};
