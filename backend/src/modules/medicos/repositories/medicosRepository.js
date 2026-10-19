// Repositorio de médicos.
// Centraliza la consulta SQL para obtener médicos por especialidad.

const sql = require('mssql');
const { query } = require('../../../../dbHelper');

async function getMedicosByEspecialidad(idEspecialidad) {
    if (!idEspecialidad) return [];

    const result = await query(`
        SELECT DISTINCT 
            me.IdMedico,
            me.IdEmpleado,
            m.IdEspecialidad,
            ISNULL(esp.Nombre, '') AS Especialidad,
            UPPER(LTRIM(RTRIM(ISNULL(e.ApellidoPaterno, '') + ' ' + ISNULL(e.ApellidoMaterno, '') + ' ' + ISNULL(e.Nombres, '')))) AS Medico
        FROM MedicosEspecialidad m
        INNER JOIN Medicos me ON me.IdMedico = m.IdMedico
        INNER JOIN Empleados e ON e.IdEmpleado = me.IdEmpleado
        LEFT JOIN Especialidades esp ON esp.IdEspecialidad = m.IdEspecialidad
        WHERE m.IdEspecialidad = @IdEspecialidad
        ORDER BY Medico
    `, [
        { name: 'IdEspecialidad', type: sql.Int, value: Number(idEspecialidad) }
    ]);

    return result.recordset || [];
}

// Todos los médicos del hospital, sin repetir.
// Se usa cuando el filtro es "Todos los servicios" y por lo tanto no hay una
// especialidad concreta de la cual sacarlos. Un mismo médico puede estar en
// varias especialidades (MedicosEspecialidad), así que se agrupa por médico.
async function getTodosLosMedicos() {
    const result = await query(`
        SELECT
            me.IdMedico,
            me.IdEmpleado,
            MAX(m.IdEspecialidad) AS IdEspecialidad,
            '' AS Especialidad,
            UPPER(LTRIM(RTRIM(ISNULL(e.ApellidoPaterno, '') + ' ' + ISNULL(e.ApellidoMaterno, '') + ' ' + ISNULL(e.Nombres, '')))) AS Medico
        FROM Medicos me
        INNER JOIN Empleados e ON e.IdEmpleado = me.IdEmpleado
        LEFT JOIN MedicosEspecialidad m ON m.IdMedico = me.IdMedico
        GROUP BY me.IdMedico, me.IdEmpleado, e.ApellidoPaterno, e.ApellidoMaterno, e.Nombres
        ORDER BY Medico
    `);

    return result.recordset || [];
}

module.exports = {
    getMedicosByEspecialidad,
    getTodosLosMedicos,
};
