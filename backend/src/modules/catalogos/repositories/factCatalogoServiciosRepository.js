const sql = require('mssql');
const { query } = require('../../../../dbHelper');

async function buscarServicios(buscar) {
    const result = await query(`
        SELECT TOP (50)
            IdProducto AS id,
            Codigo AS codigo,
            Nombre AS nombre
        FROM dbo.FactCatalogoServicios
        WHERE idEstado = 1
          AND (
                Codigo LIKE '%' + @buscar + '%'
                OR Nombre LIKE '%' + @buscar + '%'
          )
        ORDER BY
            CASE WHEN Codigo LIKE @buscar + '%' THEN 0 ELSE 1 END,
            Nombre,
            IdProducto;
    `, [
        { name: 'buscar', type: sql.VarChar(100), value: buscar },
    ]);

    return result.recordset || [];
}

module.exports = {
    buscarServicios,
};
