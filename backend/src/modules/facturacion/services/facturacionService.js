// Servicio del dominio de facturación hospitalaria.
// Expone los procedimientos nativos de SIGH/GalenHos y deja el acceso a base
// en el repositorio, igual que el resto de módulos del sistema.

const facturacionRepository = require('../repositories/facturacionServicioDespachoRepository');
const cuentasAtencionRepository = require('../repositories/facturacionCuentasAtencionRepository');
const facturacionAnulacionRepository = require('../repositories/facturacionAnulacionRepository');

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

async function consultarCuentasAtencionPtos(idCuenta) {
    try {
        return await cuentasAtencionRepository.consultarCuentasAtencionPtos(idCuenta);
    } catch (error) {
        console.error('Error en facturacionService.consultarCuentasAtencionPtos:', error.message);
        throw error;
    }
}

async function actualizarCuentasAtencionPtos(datos) {
    try {
        return await cuentasAtencionRepository.actualizarCuentasAtencionPtos(datos);
    } catch (error) {
        console.error('Error en facturacionService.actualizarCuentasAtencionPtos:', error.message);
        throw error;
    }
}

async function actualizarImportesCuenta(datos) {
    try {
        return await cuentasAtencionRepository.actualizarImportesCuenta(datos);
    } catch (error) {
        console.error('Error en facturacionService.actualizarImportesCuenta:', error.message);
        throw error;
    }
}

async function consultarComprobantesPagoPorCuenta(idCuenta) {
    try {
        return await cuentasAtencionRepository.consultarComprobantesPagoPorCuenta(idCuenta);
    } catch (error) {
        console.error('Error en facturacionService.consultarComprobantesPagoPorCuenta:', error.message);
        throw error;
    }
}

async function anularOrdenServicio(datos) {
    try {
        return await facturacionAnulacionRepository.anularOrdenServicio(datos);
    } catch (error) {
        console.error('Error en facturacionService.anularOrdenServicio:', error.message);
        throw error;
    }
}

async function obtenerOrdenServicioPorId(idOrden) {
    try {
        return await facturacionAnulacionRepository.obtenerOrdenServicioPorId(idOrden);
    } catch (error) {
        console.error('Error en facturacionService.obtenerOrdenServicioPorId:', error.message);
        throw error;
    }
}

async function obtenerDespachoPorIdOrden(idOrden) {
    try {
        return await facturacionAnulacionRepository.obtenerDespachoPorIdOrden(idOrden);
    } catch (error) {
        console.error('Error en facturacionService.obtenerDespachoPorIdOrden:', error.message);
        throw error;
    }
}

module.exports = {
    agregarServicioDespacho,
    agregarServicioDespachoRc,
    consultarCuentasAtencionPtos,
    actualizarCuentasAtencionPtos,
    actualizarImportesCuenta,
    consultarComprobantesPagoPorCuenta,
    anularOrdenServicio,
    obtenerOrdenServicioPorId,
    obtenerDespachoPorIdOrden,
};
