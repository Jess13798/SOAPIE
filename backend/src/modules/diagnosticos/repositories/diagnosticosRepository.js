// Repositorio de diagnósticos.
// Encapsula la consulta SQL y deja el servicio libre de detalles de infraestructura.

const sql = require('mssql');
const { query } = require('../../../../dbHelper');

async function getDiagnosticosByCuenta(idCuentaAtencion) {
    if (!idCuentaAtencion) return [];

    const result = await query(`
        SELECT CodigoCIE10, IdDiagnostico, Descripcion, Codigo
        FROM (
            SELECT 
                d.CodigoCIE10,
                atd.IdDiagnostico,
                d.Descripcion,
                s.Codigo,
                ROW_NUMBER() OVER (
                    PARTITION BY d.CodigoCIE10, atd.IdDiagnostico
                    ORDER BY 
                        CASE 
                            WHEN s.Codigo = 'D' THEN 1
                            WHEN s.Codigo = 'R' THEN 2
                            WHEN s.Codigo = 'P' THEN 3
                            ELSE 4
                        END
                ) AS rn
            FROM AtencionesDiagnosticos atd
            INNER JOIN Diagnosticos d 
                ON d.IdDiagnostico = atd.IdDiagnostico
            INNER JOIN SubclasificacionDiagnosticos s 
                ON s.IdSubclasificacionDx = atd.IdSubclasificacionDx
            WHERE atd.IdAtencion = @idcuentaatencion
        ) x
        WHERE rn = 1
    `, [
        { name: 'idcuentaatencion', type: sql.Int, value: Number(idCuentaAtencion) }
    ]);

    return result.recordset || [];
}

module.exports = {
    getDiagnosticosByCuenta,
};
