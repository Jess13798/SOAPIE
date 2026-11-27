const sql = require('mssql');
const { executeProcedure } = require('../../../../dbHelper');

/**
 * 1. Búsqueda de CPTs por Punto de Carga y Financiamiento oficial de SIGH.
 * Si se especifica idPuntoCarga o idServicio, calcula idPuntoCarga = idServicio + 500 (o el provisto).
 * Utiliza dbo.FactCatalogoServiciosHospFiltraPorPuntoCargaTipoFinanciamiento y,
 * si no arroja resultados o no se especifica área, realiza la búsqueda general por catálogo de respaldo.
 */
async function buscarServicios(buscar, opciones = {}) {
    const texto = (buscar || '').trim();
    const esCodigo = /^\d+$/.test(texto);
    const idFiltroTipo = esCodigo ? 1 : 2; // 1 = Por código, 2 = Por nombre

    let idPuntoCarga = opciones.idPuntoCarga;
    if (!idPuntoCarga && opciones.idServicio) {
        idPuntoCarga = Number(opciones.idServicio) + 500;
    }
    if (!idPuntoCarga) {
        idPuntoCarga = 716; // Por defecto Medicina
    }

    const idTipoFinanciamiento = Number(opciones.idTipoFinanciamiento) || 2; // SIS por defecto

    try {
        const result = await executeProcedure('dbo.FactCatalogoServiciosHospFiltraPorPuntoCargaTipoFinanciamiento', [
            { name: 'idPuntoCarga', type: sql.Int, value: idPuntoCarga },
            { name: 'idTipoFinanciamiento', type: sql.Int, value: idTipoFinanciamiento },
            { name: 'idFiltroTipo', type: sql.Int, value: idFiltroTipo },
            { name: 'Filtro', type: sql.VarChar(100), value: texto },
            { name: 'TipoServicioOfrecido', type: sql.Int, value: 1 }, // 1 -> Solo CPT
        ]);

        const filas = result.recordset || [];
        if (filas.length > 0) {
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
    } catch (errSp) {
        console.warn('Advertencia al consultar FactCatalogoServiciosHospFiltraPorPuntoCargaTipoFinanciamiento:', errSp.message);
    }

    // Respaldo oficial (conforme a punto 2.3 de cpt-recorrido-bd.md):
    // Búsqueda general en FactCatalogoServicios para no bloquear al usuario si el procedimiento no está asignado a ese punto
    const queryRespaldo = `
        SELECT TOP 20
            fcs.IdProducto,
            fcs.Codigo,
            fcs.Nombre,
            fcsh.PrecioUnitario,
            COALESCE(fcsh.Activo, 1) AS Activo,
            @idPuntoCarga AS idPuntoCarga,
            fcsh.SeUsaSinPrecio
        FROM dbo.FactCatalogoServicios AS fcs
        LEFT JOIN dbo.FactCatalogoServiciosHosp AS fcsh
            ON fcsh.IdProducto = fcs.IdProducto
           AND fcsh.IdTipoFinanciamiento = @idTipoFinanciamiento
        WHERE fcs.idEstado = 1
          AND (fcs.Codigo = @texto OR fcs.Nombre LIKE '%' + @texto + '%' OR fcs.Codigo LIKE '%' + @texto + '%')
        ORDER BY fcs.Nombre ASC;
    `;

    const { query } = require('../../../../dbHelper');
    const resRespaldo = await query(queryRespaldo, [
        { name: 'texto', type: sql.VarChar, value: texto },
        { name: 'idPuntoCarga', type: sql.Int, value: idPuntoCarga },
        { name: 'idTipoFinanciamiento', type: sql.Int, value: idTipoFinanciamiento },
    ]);

    return (resRespaldo.recordset || []).map((fila) => ({
        id: fila.IdProducto,
        codigo: fila.Codigo,
        nombre: fila.Nombre,
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

/**
 * 3. Consultar los datos del Tipo de Financiamiento en GalenHos/SIGH.
 * Utiliza: dbo.TiposFinanciamientoSeleccionarPorId
 */
async function obtenerTipoFinanciamientoPorId(idTipoFinanciamiento = 2) {
    const result = await executeProcedure('dbo.TiposFinanciamientoSeleccionarPorId', [
        { name: 'IdTipoFinanciamiento', type: sql.Int, value: Number(idTipoFinanciamiento) },
    ]);

    return result.recordset?.[0] || null;
}

module.exports = {
    buscarServicios,
    obtenerServicioPorFinanciamiento,
    obtenerTipoFinanciamientoPorId,
};
