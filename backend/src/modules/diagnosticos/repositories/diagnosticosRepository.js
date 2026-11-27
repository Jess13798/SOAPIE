// Repositorio de diagnósticos.
// Encapsula la consulta SQL y deja el servicio libre de detalles de infraestructura.

const sql = require('mssql');
const { query, executeProcedure } = require('../../../../dbHelper');

/**


 * Implementa la operación "getDiagnosticosByCuenta".


 * Mantiene aislada la responsabilidad principal de este archivo.


 */


async function getDiagnosticosByCuenta(idCuentaAtencion) {
    if (!idCuentaAtencion) return [];

    const result = await query(`
        SELECT CodigoCIE10, IdDiagnostico, IdAtencionDiagnostico, Descripcion, Codigo
        FROM (
            SELECT 
                d.CodigoCIE10,
                atd.IdDiagnostico,
                atd.IdAtencionDiagnostico,
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
            FROM Atenciones a
            INNER JOIN AtencionesDiagnosticos atd
                ON atd.IdAtencion = a.IdAtencion
            INNER JOIN Diagnosticos d 
                ON d.IdDiagnostico = atd.IdDiagnostico
            INNER JOIN SubclasificacionDiagnosticos s 
                ON s.IdSubclasificacionDx = atd.IdSubclasificacionDx
            WHERE a.IdCuentaAtencion = @idcuentaatencion
        ) x
        WHERE rn = 1
    `, [
        { name: 'idcuentaatencion', type: sql.Int, value: Number(idCuentaAtencion) }
    ]);

    return result.recordset || [];
}

/**
 * Consulta el IdDiagnostico correspondiente a un código CIE (ej: 'N39.0')
 * utilizando el procedimiento almacenado oficial de SIGH/GalenHos.
 * Utiliza: dbo.DevuelveIdDIagnostico
 */
/**

 * Implementa la operación "devuelveIdDiagnostico".

 * Mantiene aislada la responsabilidad principal de este archivo.

 */

async function devuelveIdDiagnostico(codigoCIE) {
    if (!codigoCIE) return 0;
    const codigoFormateado = String(codigoCIE).trim().padEnd(7, ' ');
    const result = await executeProcedure('dbo.DevuelveIdDIagnostico', [
        { name: 'Codigo', type: sql.Char(7), value: codigoFormateado },
    ]);
    return result.recordset?.[0]?.iddiagnostico ?? 0;
}

module.exports = {
    getDiagnosticosByCuenta,
    devuelveIdDiagnostico,
};
