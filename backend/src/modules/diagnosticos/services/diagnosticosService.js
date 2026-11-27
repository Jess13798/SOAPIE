// Servicio del dominio de diagnósticos.
// Aquí se conserva la lógica clínica y se delega el acceso a base al repositorio.

const diagnosticosRepository = require('../repositories/diagnosticosRepository');

/**


 * Implementa la operación "obtenerDiagnosticos".


 * Mantiene aislada la responsabilidad principal de este archivo.


 */


async function obtenerDiagnosticos(idCuentaAtencion) {
    try {
        return await diagnosticosRepository.getDiagnosticosByCuenta(idCuentaAtencion);
    } catch (error) {
        console.error('Error en diagnosticosService.obtenerDiagnosticos:', error.message);
        throw error;
    }
}

/**


 * Implementa la operación "obtenerIdDiagnosticoPorCodigo".


 * Mantiene aislada la responsabilidad principal de este archivo.


 */


async function obtenerIdDiagnosticoPorCodigo(codigoCIE) {
    try {
        return await diagnosticosRepository.devuelveIdDiagnostico(codigoCIE);
    } catch (error) {
        console.error('Error en diagnosticosService.obtenerIdDiagnosticoPorCodigo:', error.message);
        throw error;
    }
}

module.exports = {
    obtenerDiagnosticos,
    obtenerIdDiagnosticoPorCodigo,
};
