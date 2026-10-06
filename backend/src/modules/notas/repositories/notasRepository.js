// Repositorio de notas de enfermería.
// Centraliza el acceso a la tabla de notas para que la lógica del servicio
// no dependa de columnas específicas de SQL Server.

const sql = require('mssql');
const { dbConfig } = require('../../../config/db');

async function getNotasPorPaciente(idPaciente) {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
        .input('IdPaciente', sql.Int, Number(idPaciente))
        .query(`
            SELECT *
            FROM NotaEnfermeria
            WHERE IdPaciente = @IdPaciente
            ORDER BY Fecha_Hora_Inicio DESC
        `);

    return result.recordset || [];
}

module.exports = {
    getNotasPorPaciente,
};
