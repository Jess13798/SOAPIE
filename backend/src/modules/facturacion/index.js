// Módulo de Facturación Hospitalaria (GalenHos / SIGH).
// Reexporta los repositorios, servicios y utilidades del dominio.

const facturacionService = require('./services/facturacionService');
const facturacionServicioDespachoRepository = require('./repositories/facturacionServicioDespachoRepository');
const facturacionCuentasAtencionRepository = require('./repositories/facturacionCuentasAtencionRepository');
const facturacionAnulacionRepository = require('./repositories/facturacionAnulacionRepository');

module.exports = {
    ...facturacionService,
    facturacionServicioDespachoRepository,
    facturacionCuentasAtencionRepository,
    facturacionAnulacionRepository,
};
