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

module.exports = {
    getMedicosByEspecialidad,
};
