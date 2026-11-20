const sql = require('mssql');
const { executeProcedure } = require('../../../../dbHelper');

/**
 * 1. Búsqueda de CPTs por Punto de Carga y Financiamiento oficial de SIGH.
 * Utiliza: dbo.FactCatalogoServiciosHospFiltraPorPuntoCargaTipoFinanciamiento
 */
async function buscarServicios(buscar, idPuntoCarga = 716, idTipoFinanciamiento = 2) {
    const texto = (buscar || '').trim();
    const esCodigo = /^\d+$/.test(texto);
    const idFiltroTipo = esCodigo ? 1 : 2; // 1 = Por código, 2 = Por nombre

    const result = await executeProcedure('dbo.FactCatalogoServiciosHospFiltraPorPuntoCargaTipoFinanciamiento', [
        { name: 'idPuntoCarga', type: sql.Int, value: idPuntoCarga },
        { name: 'idTipoFinanciamiento', type: sql.Int, value: idTipoFinanciamiento },
        { name: 'idFiltroTipo', type: sql.Int, value: idFiltroTipo },
        { name: 'Filtro', type: sql.VarChar(100), value: texto },
        { name: 'TipoServicioOfrecido', type: sql.Int, value: 1 }, // 1 -> Solo CPT
    ]);

    const filas = result.recordset || [];

    return filas.map((fila) => ({
        id: fila.IdProducto,
        codigo: fila.Codigo,
        nombre: fila.Nombre || fila.NombreProducto,
        precioUnitario: fila.PrecioUnitario,
        activo: fila.Activo,
        idPuntoCarga: fila.idPuntoCarga,
        seUsaSinPrecio: fila.SeUsaSinPrecio,
    }));
}

/**
 * 2. Obtener la configuración hospitalaria de un producto por tipo de financiamiento.
 * Utiliza: dbo.FactCatalogoServiciosXidTipoFinanciamiento
 */
async function obtenerServicioPorFinanciamiento(idProducto, idTipoFinanciamiento = 2) {
    const result = await executeProcedure('dbo.FactCatalogoServiciosXidTipoFinanciamiento', [
        { name: 'idProducto', type: sql.Int, value: Number(idProducto) },
        { name: 'IdTipoFinanciamiento', type: sql.Int, value: Number(idTipoFinanciamiento) },
    ]);

    return result.recordset?.[0] || null;
}

module.exports = {
    buscarServicios,
    obtenerServicioPorFinanciamiento,
};
