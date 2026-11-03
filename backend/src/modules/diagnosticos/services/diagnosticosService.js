// Servicio del dominio de diagnósticos.
// Aquí se conserva la lógica clínica y se delega el acceso a base al repositorio.

const diagnosticosRepository = require('../repositories/diagnosticosRepository');

async function obtenerDiagnosticos(idCuentaAtencion) {
    try {
        return await diagnosticosRepository.getDiagnosticosByCuenta(idCuentaAtencion);
    } catch (error) {
        console.error('Error en diagnosticosService.obtenerDiagnosticos:', error.message);
        throw error;
    }
}

module.exports = {
    obtenerDiagnosticos,
};
