const sql = require('mssql');
const { query } = require('../../../../dbHelper');

async function buscarServicios(buscar) {
    const result = await query(`
        SELECT TOP (50)
            FactCatalogoServicios.IdProducto AS id,
            FactCatalogoServicios.Codigo AS codigo,
            FactCatalogoServicios.Nombre AS nombre,
            FactCatalogoServicios.IdServicioSubGrupo AS idServicioSubGrupo,
            FactCatalogoServiciosHosp.PrecioUnitario AS precioUnitario,
            FactCatalogoServiciosHosp.Activo AS activo
        FROM dbo.FactCatalogoServiciosHosp, dbo.FactCatalogoServicios
        WHERE FactCatalogoServiciosHosp.IdTipoFinanciamiento = 2
          AND FactCatalogoServiciosHosp.IdProducto = FactCatalogoServicios.IdProducto
          AND (
                FactCatalogoServicios.Nombre LIKE '%' + @buscar + '%'
                OR FactCatalogoServicios.Codigo LIKE '%' + @buscar + '%'
          )
        ORDER BY FactCatalogoServicios.Nombre;
    `, [
        { name: 'buscar', type: sql.VarChar(100), value: buscar },
    ]);

    return result.recordset || [];
}

module.exports = {
    buscarServicios,
};
