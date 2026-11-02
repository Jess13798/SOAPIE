const repo = require('../repositories/balanceHidricoRepository');

async function guardarRegistro(nota) {
    return repo.guardarRegistro(nota);
}

async function obtenerRegistros(idCuenta, fecha) {
    return repo.obtenerRegistros(idCuenta, fecha);
}

async function eliminarRegistro(id) {
    return repo.eliminarRegistro(id);
}

module.exports = { guardarRegistro, obtenerRegistros, eliminarRegistro };
