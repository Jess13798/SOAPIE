// Propósito: Reglas de negocio del módulo "balance-hidrico".
// Responsable de mantener separadas las reglas de este archivo.

const repo = require('../repositories/balanceHidricoRepository');

/**
 * Implementa la operación "guardarRegistro".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */

async function guardarRegistro(nota) {
    return repo.guardarRegistro(nota);
}

/**
 * Implementa la operación "obtenerRegistros".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


async function obtenerRegistros(idCuenta, fecha) {
    return repo.obtenerRegistros(idCuenta, fecha);
}

/**
 * Implementa la operación "eliminarRegistro".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


async function eliminarRegistro(id) {
    return repo.eliminarRegistro(id);
}

module.exports = { guardarRegistro, obtenerRegistros, eliminarRegistro };
