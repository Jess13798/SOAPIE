// Propósito: Operaciones para pacientes sin cama asignada.
// Responsable de mantener separadas las reglas de este archivo.

﻿// Wrapper de compatibilidad para el módulo legacy de pacientes sin cama.
// La lógica real quedó movida a src/modules/pacientes-sin-cama para mantener
// una estructura más clara de dominio, servicio y repositorio.

module.exports = require('./src/modules/pacientes-sin-cama');

