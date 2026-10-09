// Repositorio de notas de enfermería.
// Centraliza el acceso a las tablas de notas y signos vitales para que la
// lógica del servicio no dependa de columnas específicas de SQL Server.
// Usa dbHelper (pool compartido + parámetros nombrados) como ÚNICA vía de acceso.

const sql = require('mssql');
const { query } = require('../../../../dbHelper');

// Convierte un valor del dominio en parámetro tipado para mssql.
// Evita que lleguen strings vacíos donde la BD espera NULL.
function toParam(name, value, type) {
    const v = value === undefined || value === null || String(value).trim() === ''
        ? null
        : value;

    // Si el valor es un objeto Date real, siempre se envía como DateTime
    if (v instanceof Date) {
        return { name, type: sql.DateTime, value: v };
    }

    return { name, type, value: v };
}

async function getAllNotas() {
    return query(`
        SELECT ne.*,
               LTRIM(RTRIM(
                   ISNULL(e.ApellidoPaterno, '') + ' ' +
                   ISNULL(e.ApellidoMaterno, '') + ' ' +
                   ISNULL(e.Nombres, '')
               )) AS Enfermera
        FROM NotaEnfermeria ne
        LEFT JOIN Empleados e ON ne.IdEmpleado = e.IdEmpleado
        ORDER BY ne.Fecha_Hora_Inicio DESC
    `);
}

async function getNotasPorPaciente(idPaciente) {
    const result = await query(`
        SELECT *
        FROM NotaEnfermeria
        WHERE IdPaciente = @IdPaciente
        ORDER BY Fecha_Hora_Inicio DESC
    `, [
        toParam('IdPaciente', idPaciente, sql.Int),
    ]);

    return result.recordset || [];
}

async function insertNota({
    idCuenta,
    idPaciente,
    idEmpleado,
    turnoNota,
    fechaHoraParsed,
    fechaFin,
    subjetivo,
    objetivo,
    analisis,
    plan,
    intervencion,
    evaluacion,
}) {
    const result = await query(`
        INSERT INTO NotaEnfermeria (
            IdCuenta, IdPaciente, IdEmpleado, Turno, Fecha_Hora_Inicio, Fecha_Hora_Fin,
            Subjetivo, Objetivo, Analisis, Plan_, Intervencion, Evaluacion
        )
        OUTPUT INSERTED.IdNotaEnfermeria
        VALUES (
            @idCuenta, @idPaciente, @idEmpleado, @turnoNota, @fechaHoraParsed, @fechaFin,
            @subjetivo, @objetivo, @analisis, @plan, @intervencion, @evaluacion
        )
    `, [
        toParam('idCuenta', idCuenta, sql.Int),
        toParam('idPaciente', idPaciente, sql.Int),
        toParam('idEmpleado', idEmpleado, sql.Int),
        { name: 'turnoNota', type: sql.VarChar(10), value: turnoNota },
        { name: 'fechaHoraParsed', type: sql.VarChar(23), value: fechaHoraParsed },
        toParam('fechaFin', fechaFin, sql.VarChar(23)),
        { name: 'subjetivo', type: sql.NVarChar(sql.MAX), value: subjetivo ?? '' },
        { name: 'objetivo', type: sql.NVarChar(sql.MAX), value: objetivo ?? '' },
        { name: 'analisis', type: sql.NVarChar(sql.MAX), value: analisis ?? '' },
        { name: 'plan', type: sql.NVarChar(sql.MAX), value: plan ?? '' },
        { name: 'intervencion', type: sql.NVarChar(sql.MAX), value: intervencion ?? '' },
        { name: 'evaluacion', type: sql.NVarChar(sql.MAX), value: evaluacion ?? '' },
    ]);

    return result.recordset?.[0]?.IdNotaEnfermeria;
}

async function updateNota({
    idNota,
    turnoNota,
    subjetivo,
    objetivo,
    analisis,
    plan,
    intervencion,
    evaluacion,
    fechaFin,
}) {
    await query(`
        UPDATE NotaEnfermeria SET
            Turno = @turnoNota,
            Subjetivo = @subjetivo,
            Objetivo = @objetivo,
            Analisis = @analisis,
            Plan_ = @plan,
            Intervencion = @intervencion,
            Evaluacion = @evaluacion,
            Fecha_Hora_Fin = @fechaFin
        WHERE IdNotaEnfermeria = @idNota
    `, [
        { name: 'turnoNota', type: sql.VarChar(10), value: turnoNota },
        { name: 'subjetivo', type: sql.NVarChar(sql.MAX), value: subjetivo ?? '' },
        { name: 'objetivo', type: sql.NVarChar(sql.MAX), value: objetivo ?? '' },
        { name: 'analisis', type: sql.NVarChar(sql.MAX), value: analisis ?? '' },
        { name: 'plan', type: sql.NVarChar(sql.MAX), value: plan ?? '' },
        { name: 'intervencion', type: sql.NVarChar(sql.MAX), value: intervencion ?? '' },
        { name: 'evaluacion', type: sql.NVarChar(sql.MAX), value: evaluacion ?? '' },
        toParam('fechaFin', fechaFin, sql.VarChar(23)),
        toParam('idNota', idNota, sql.Int),
    ]);
}

// Inserta un registro de signos vitales (auditoría / historial).
// sv: objeto con los campos del formulario (peso, talla, presionArterial, ...)
async function insertVitales({ idNota, idPaciente, idCuenta, fechaHoraSistemas, idEmpleado, sv = {} }) {
    await query(`
        INSERT INTO NotaEnfermeriaSignosVitales (
            IdNotaEnfermeria, IDPACIENTE, IdCuentaatencion, Fecha_Hora, IdEmpleado,
            Peso, Talla, P_Cefalico, P_Abdominal, Hemoglucotest,
            Presion_Arterial, Frec_Cardiaca, Frec_Respiratoria, Temperatura, Saturacion
        )
        VALUES (
            @idNota, @idPaciente, @idCuenta, @fechaHoraSistemas, @idEmpleado,
            @peso, @talla, @pCefalico, @pAbdominal, @hemoglucotest,
            @presionArterial, @frecuenciaCardiaca, @frecuenciaRespiratoria, @temperatura, @saturacionOxigeno
        )
    `, [
        toParam('idNota', idNota, sql.Int),
        toParam('idPaciente', idPaciente, sql.Int),
        toParam('idCuenta', idCuenta, sql.Int),
        { name: 'fechaHoraSistemas', type: sql.DateTime, value: fechaHoraSistemas },
        toParam('idEmpleado', idEmpleado, sql.Int),
        toParam('peso', sv.peso, sql.NVarChar(50)),
        toParam('talla', sv.talla, sql.NVarChar(50)),
        toParam('pCefalico', sv.pCefalico, sql.NVarChar(50)),
        toParam('pAbdominal', sv.pAbdominal, sql.NVarChar(50)),
        toParam('hemoglucotest', sv.hemoglucotest, sql.NVarChar(50)),
        toParam('presionArterial', sv.presionArterial, sql.NVarChar(50)),
        toParam('frecuenciaCardiaca', sv.frecuenciaCardiaca, sql.NVarChar(50)),
        toParam('frecuenciaRespiratoria', sv.frecuenciaRespiratoria, sql.NVarChar(50)),
        toParam('temperatura', sv.temperatura, sql.NVarChar(50)),
        toParam('saturacionOxigeno', sv.saturacionOxigeno, sql.NVarChar(50)),
    ]);
}

async function deleteNotaById(id) {
    // 1. Elimina signos vitales asociados para evitar error de clave foránea
    await query(
        'DELETE FROM NotaEnfermeriaSignosVitales WHERE IdNotaEnfermeria = @id',
        [toParam('id', id, sql.Int)]
    );
    // 2. Elimina la nota
    await query(
        'DELETE FROM NotaEnfermeria WHERE IdNotaEnfermeria = @id',
        [toParam('id', id, sql.Int)]
    );
}

async function getHistorialVitals(idNota, limit = 10, offset = 0) {
    return query(`
        SELECT 
            sv.IdSignoVital,
            sv.Fecha_Hora,
            sv.Peso, sv.Talla, sv.P_Cefalico, sv.P_Abdominal, sv.Hemoglucotest,
            sv.Presion_Arterial, sv.Frec_Cardiaca, sv.Frec_Respiratoria,
            sv.Temperatura, sv.Saturacion,
            LTRIM(RTRIM(
                ISNULL(e.ApellidoPaterno, '') + ' ' +
                ISNULL(e.ApellidoMaterno, '') + ' ' +
                ISNULL(e.Nombres, '')
            )) AS NombreUsuario,
            COUNT(*) OVER() as TotalCount
        FROM NotaEnfermeriaSignosVitales sv
        LEFT JOIN Empleados e ON sv.IdEmpleado = e.IdEmpleado
        WHERE sv.IdNotaEnfermeria = @idNota
        ORDER BY sv.Fecha_Hora DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `, [
        toParam('idNota', idNota, sql.Int),
        { name: 'offset', type: sql.Int, value: Number(offset) },
        { name: 'limit', type: sql.Int, value: Number(limit) },
    ]);
}

module.exports = {
    getAllNotas,
    getNotasPorPaciente,
    insertNota,
    updateNota,
    insertVitales,
    deleteNotaById,
    getHistorialVitals,
};
