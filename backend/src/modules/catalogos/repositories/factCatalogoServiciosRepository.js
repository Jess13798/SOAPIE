const sql = require('mssql');
const { query } = require('../../../../dbHelper');

async function buscarServicios(buscar) {
    const result = await query(`
        SELECT TOP (50)
            s.IdProducto AS id,
            s.Codigo AS codigo,
            s.Nombre AS nombre,
            h.PrecioUnitario AS precio
        FROM dbo.FactCatalogoServicios s
        INNER JOIN dbo.FactCatalogoServiciosHosp h
            ON h.IdProducto = s.IdProducto
        WHERE h.IdTipoFinanciamiento = 2
          AND (h.Activo = 1 OR h.Activo IS NULL)
          AND (
                s.Codigo LIKE '%' + @buscar + '%'
                OR s.Nombre LIKE '%' + @buscar + '%'
          )
        ORDER BY
            CASE WHEN s.Codigo LIKE @buscar + '%' THEN 0 ELSE 1 END,
            s.Nombre,
            s.IdProducto;
    `, [
        { name: 'buscar', type: sql.VarChar(100), value: buscar },
    ]);

    return result.recordset || [];
}

module.exports = {
    buscarServicios,
};
