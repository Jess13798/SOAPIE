// Export central del módulo de pacientes.
// Este archivo permite migrar el acceso desde los archivos legacy sin romper
// el resto del proyecto ni las rutas existentes de la API.

const pacientesService = require('./services/pacientesService');

module.exports = {
    obtenerPacientes: pacientesService.obtenerPacientes,
    obtenerServicios: pacientesService.obtenerServicios,
};
