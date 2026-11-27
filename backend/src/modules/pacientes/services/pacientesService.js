// Servicio principal del dominio de pacientes.
// Aquí se mantiene la lógica de negocio y se delega el acceso a BD al repositorio.

const pacientesRepository = require('../repositories/pacientesRepository');

/**
 * Implementa la operación "obtenerPacientes".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


async function obtenerPacientes(servicioId = null) {
    try {
        return await pacientesRepository.getPacientesByServicio(servicioId);
    } catch (error) {
        console.error('Error en pacientesService.obtenerPacientes:', error.message);
        throw error;
    }
}

/**
 * Implementa la operación "obtenerServicios".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


async function obtenerServicios() {
    try {
        return await pacientesRepository.getServicios();
    } catch (error) {
        console.error('Error en pacientesService.obtenerServicios:', error.message);
        throw error;
    }
}

/**
 * Implementa la operación "buscarPacientes".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


async function buscarPacientes(texto) {
    try {
        return await pacientesRepository.buscarPacientes(texto);
    } catch (error) {
        console.error('Error en pacientesService.buscarPacientes:', error.message);
        throw error;
    }
}

module.exports = {
    obtenerPacientes,
    obtenerServicios,
    buscarPacientes,
};
