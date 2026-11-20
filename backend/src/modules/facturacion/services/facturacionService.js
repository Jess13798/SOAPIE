// Servicio del dominio de facturación hospitalaria.
// Expone los procedimientos nativos de SIGH/GalenHos y deja el acceso a base
// en el repositorio, igual que el resto de módulos del sistema.

const facturacionRepository = require('../repositories/facturacionServicioDespachoRepository');

async function agregarServicioDespacho(datos) {
    try {
        return await facturacionRepository.agregarServicioDespacho(datos);
    } catch (error) {
        console.error('Error en facturacionService.agregarServicioDespacho:', error.message);
        throw error;
    }
}

async function agregarServicioDespachoRc(datos) {
    try {
        return await facturacionRepository.agregarServicioDespachoRc(datos);
    } catch (error) {
        console.error('Error en facturacionService.agregarServicioDespachoRc:', error.message);
        throw error;
    }
}

module.exports = {
    agregarServicioDespacho,
    agregarServicioDespachoRc,
};
