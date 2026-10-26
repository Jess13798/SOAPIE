// Servicio del dominio para pacientes sin cama.
// Aquí se conserva la lógica de negocio y se delega el acceso a SQL al repositorio.

const pacientesSinCamaRepository = require('../repositories/pacientesSinCamaRepository');

async function obtenerPacientesSinCama(nombreServicio = null) {
    try {
        return await pacientesSinCamaRepository.getPacientesSinCama(nombreServicio);
    } catch (error) {
        console.error('Error en pacientesSinCamaService.obtenerPacientesSinCama:', error.message);
        throw error;
    }
}

async function asignarCama({ IdPaciente, IdCuentaAtencion, IdCama, IdMedicoOrdena, idUsuario, usuario }) {
    try {
        return await pacientesSinCamaRepository.asignarCama({
            IdPaciente,
            IdCuentaAtencion,
            IdCama,
            IdMedicoOrdena,
            idUsuario,
            usuario,
        });
    } catch (error) {
        console.error('Error en pacientesSinCamaService.asignarCama:', error.message);
        throw error;
    }
}

async function moverPacienteDeCama({ IdPaciente, IdCama, IdCuentaAtencion, idUsuario, usuario }) {
    try {
        return await pacientesSinCamaRepository.moverPacienteDeCama({
            IdPaciente,
            IdCama,
            IdCuentaAtencion,
            idUsuario,
            usuario,
        });
    } catch (error) {
        console.error('Error en pacientesSinCamaService.moverPacienteDeCama:', error.message);
        throw error;
    }
}

async function registrarTransferenciaEstancia(payload) {
    try {
        return await pacientesSinCamaRepository.registrarTransferenciaEstancia(payload);
    } catch (error) {
        console.error('Error en pacientesSinCamaService.registrarTransferenciaEstancia:', error.message);
        throw error;
    }
}

async function obtenerAuditoriaCamas(filtros = {}) {
    try {
        return await pacientesSinCamaRepository.getAuditoriaCamas(filtros);
    } catch (error) {
        console.error('Error en pacientesSinCamaService.obtenerAuditoriaCamas:', error.message);
        throw error;
    }
}

module.exports = {
    obtenerPacientesSinCama,
    asignarCama,
    moverPacienteDeCama,
    registrarTransferenciaEstancia,
    obtenerAuditoriaCamas,
};
