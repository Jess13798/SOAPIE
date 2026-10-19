// Servicio del dominio de médicos.
// Se encarga del uso de la entidad y delega la consulta SQL al repositorio.

const medicosRepository = require('../repositories/medicosRepository');

async function obtenerMedicosPorEspecialidad(idEspecialidad) {
    try {
        return await medicosRepository.getMedicosByEspecialidad(idEspecialidad);
    } catch (error) {
        console.error('Error en medicosService.obtenerMedicosPorEspecialidad:', error.message);
        throw error;
    }
}

module.exports = {
    obtenerMedicosPorEspecialidad,
};
