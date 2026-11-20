// Export central del módulo de facturación (procedimientos SIGH).

const facturacionService = require('./services/facturacionService');

module.exports = {
    agregarServicioDespacho: facturacionService.agregarServicioDespacho,
    agregarServicioDespachoRc: facturacionService.agregarServicioDespachoRc,
};
