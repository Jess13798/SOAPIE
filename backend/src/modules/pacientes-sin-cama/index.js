// Export central del módulo de pacientes sin cama.
// Este archivo permite seguir usando el backend legacy mientras se mueve la
// lógica a capas más organizadas y preparadas para crecer en módulos clínicos.

const pacientesSinCamaService = require('./services/pacientesSinCamaService');

module.exports = {
    obtenerPacientesSinCama: pacientesSinCamaService.obtenerPacientesSinCama,
    asignarCama: pacientesSinCamaService.asignarCama,
    moverPacienteDeCama: pacientesSinCamaService.moverPacienteDeCama,
    registrarTransferenciaEstancia: pacientesSinCamaService.registrarTransferenciaEstancia,
};
