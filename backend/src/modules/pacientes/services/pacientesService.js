// Servicio principal del dominio de pacientes.
// Aquí se mantiene la lógica de negocio y se delega el acceso a BD al repositorio.

const pacientesRepository = require('../repositories/pacientesRepository');

async function obtenerPacientes(servicioId = null) {
    try {
        return await pacientesRepository.getPacientesByServicio(servicioId);
    } catch (error) {
        console.error('Error en pacientesService.obtenerPacientes:', error.message);
        throw error;
    }
}

async function obtenerServicios() {
    try {
        return await pacientesRepository.getServicios();
    } catch (error) {
        console.error('Error en pacientesService.obtenerServicios:', error.message);
        throw error;
    }
}

module.exports = {
    obtenerPacientes,
    obtenerServicios,
};
