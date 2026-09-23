const { sql, dbConfig } = require('./database');

async function obtenerDiagnosticos(idCuentaAtencion) {
    if (!idCuentaAtencion) return [];
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
        .input('idcuentaatencion', sql.Int, Number(idCuentaAtencion))
        .query(`
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
        `);
    return result.recordset || [];
}

module.exports = { obtenerDiagnosticos };
