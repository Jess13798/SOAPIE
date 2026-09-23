const { sql, dbConfig } = require('./database');

async function obtenerMedicosPorEspecialidad(idEspecialidad) {
    if (!idEspecialidad) return [];
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
        .input('IdEspecialidad', sql.Int, Number(idEspecialidad))
        .query(`
            SELECT DISTINCT 
                me.IdMedico,
                me.IdEmpleado,
                s.IdEspecialidad,
                UPPER(LTRIM(RTRIM(ISNULL(e.ApellidoPaterno, '') + ' ' + ISNULL(e.ApellidoMaterno, '') + ' ' + ISNULL(e.Nombres, '')))) AS Medico
            FROM MedicosEspecialidad m
            INNER JOIN Medicos me ON me.IdMedico = m.IdMedico
            INNER JOIN Empleados e ON e.IdEmpleado = me.IdEmpleado
            INNER JOIN Servicios s ON s.IdEspecialidad = m.IdEspecialidad
            WHERE m.IdEspecialidad = @IdEspecialidad
        `);
    return result.recordset || [];
}

module.exports = { obtenerMedicosPorEspecialidad };
