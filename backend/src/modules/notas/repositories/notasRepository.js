const sql = require('mssql');
const dbHelper = require('../../../../dbHelper');

const NOTA_NOT_FOUND = 'NOTA_NOT_FOUND';
const CARE_PLAN_RELATION_INVALID = 'CARE_PLAN_RELATION_INVALID';

function createRepositoryError(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
}

function bindNota(request, nota) {
    request.input('idCuenta', sql.Int, nota.idCuenta);
    request.input('idPaciente', sql.Int, nota.idPaciente);
    request.input('idEmpleado', sql.Int, nota.idEmpleado);
    request.input('turno', sql.VarChar(10), nota.turno);
    request.input('fechaInicio', sql.DateTime, nota.fechaInicio);
    request.input('fechaFin', sql.DateTime, nota.fechaFin);
    request.input('subjetivo', sql.NVarChar(sql.MAX), nota.subjetivo);
    request.input('objetivo', sql.NVarChar(sql.MAX), nota.objetivo);
    request.input('analisis', sql.NVarChar(sql.MAX), nota.analisis);
    request.input('plan', sql.NVarChar(sql.MAX), nota.plan);
    request.input('intervencion', sql.NVarChar(sql.MAX), nota.intervencion);
    request.input('evaluacion', sql.NVarChar(sql.MAX), nota.evaluacion);
}

function bindVitales(request, signosVitales, metadata) {
    request.input('idPacienteVital', sql.Int, metadata.idPaciente);
    request.input('idCuentaVital', sql.Int, metadata.idCuenta);
    request.input('fechaVital', sql.DateTime, metadata.fechaHora);
    request.input('idEmpleadoVital', sql.Int, metadata.idEmpleado);
    request.input('peso', sql.Decimal(5, 2), signosVitales.peso);
    request.input('talla', sql.Decimal(5, 2), signosVitales.talla);
    request.input('pCefalico', sql.Decimal(5, 2), signosVitales.pCefalico);
    request.input('pAbdominal', sql.Decimal(5, 2), signosVitales.pAbdominal);
    request.input('hemoglucotest', sql.Decimal(5, 2), signosVitales.hemoglucotest);
    request.input('presionArterial', sql.VarChar(10), signosVitales.presionArterial);
    request.input('frecuenciaCardiaca', sql.Int, signosVitales.frecuenciaCardiaca);
    request.input('frecuenciaRespiratoria', sql.Int, signosVitales.frecuenciaRespiratoria);
    request.input('temperatura', sql.Decimal(4, 2), signosVitales.temperatura);
    request.input('saturacion', sql.Int, signosVitales.saturacionOxigeno);
}

async function guardarNotaCompleta(nota) {
    const pool = await dbHelper.getPool();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        let idNota = nota.idNota;
        const notaRequest = transaction.request();
        bindNota(notaRequest, nota);

        if (idNota) {
            notaRequest.input('idNota', sql.Int, idNota);
            const updateResult = await notaRequest.query(`
                UPDATE dbo.NotaEnfermeria
                SET IdCuenta = @idCuenta,
                    IdPaciente = @idPaciente,
                    IdEmpleado = @idEmpleado,
                    Turno = @turno,
                    Fecha_Hora_Fin = @fechaFin,
                    Subjetivo = @subjetivo,
                    Objetivo = @objetivo,
                    Analisis = @analisis,
                    Plan_ = @plan,
                    Intervencion = @intervencion,
                    Evaluacion = @evaluacion
                WHERE IdNotaEnfermeria = @idNota;
            `);

            if (updateResult.rowsAffected[0] === 0) {
                throw createRepositoryError(NOTA_NOT_FOUND, 'La nota SOAPIE solicitada no existe.');
            }
        } else {
            const insertResult = await notaRequest.query(`
                INSERT INTO dbo.NotaEnfermeria (
                    IdCuenta, IdPaciente, IdEmpleado, Turno,
                    Fecha_Hora_Inicio, Fecha_Hora_Fin, Subjetivo, Objetivo,
                    Analisis, Plan_, Intervencion, Evaluacion
                )
                OUTPUT INSERTED.IdNotaEnfermeria AS IdNotaEnfermeria
                VALUES (
                    @idCuenta, @idPaciente, @idEmpleado, @turno,
                    @fechaInicio, @fechaFin, @subjetivo, @objetivo,
                    @analisis, @plan, @intervencion, @evaluacion
                );
            `);
            idNota = insertResult.recordset[0].IdNotaEnfermeria;
        }

        const vitalRequest = transaction.request();
        vitalRequest.input('idNotaVital', sql.Int, idNota);
        bindVitales(vitalRequest, nota.signosVitales, nota);
        await vitalRequest.query(`
            INSERT INTO dbo.NotaEnfermeriaSignosVitales (
                IdNotaEnfermeria, IdPaciente, IdCuentaatencion, Fecha_Hora,
                IdEmpleado, Peso, Talla, P_Cefalico, P_Abdominal, Hemoglucotest,
                Presion_Arterial, Frec_Cardiaca, Frec_Respiratoria,
                Temperatura, Saturacion
            )
            VALUES (
                @idNotaVital, @idPacienteVital, @idCuentaVital, @fechaVital,
                @idEmpleadoVital, @peso, @talla, @pCefalico, @pAbdominal, @hemoglucotest,
                @presionArterial, @frecuenciaCardiaca, @frecuenciaRespiratoria,
                @temperatura, @saturacion
            );
        `);

        const carePlanRequest = transaction.request();
        carePlanRequest.input('idNotaCarePlan', sql.Int, idNota);
        await carePlanRequest.query(`
            DELETE FROM dbo.NotaEnfermeriaPlanCuidado
            WHERE IdNotaEnfermeria = @idNotaCarePlan;
        `);

        for (const diagnosis of nota.planCuidados) {
            const diagnosisOnly = diagnosis.nocIds.length === 0 && diagnosis.nicIds.length === 0;
            if (diagnosisOnly) {
                await insertCarePlanSelection(transaction, idNota, diagnosis.idNANDA, null, null);
            }
            for (const idNOC of diagnosis.nocIds) {
                await insertCarePlanSelection(transaction, idNota, diagnosis.idNANDA, idNOC, null);
            }
            for (const idNIC of diagnosis.nicIds) {
                await insertCarePlanSelection(transaction, idNota, diagnosis.idNANDA, null, idNIC);
            }
        }

        await transaction.commit();
        return idNota;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function insertCarePlanSelection(transaction, idNota, idNANDA, idNOC, idNIC) {
    const request = transaction.request();
    request.input('idNotaCarePlan', sql.Int, idNota);
    request.input('idNANDA', sql.Int, idNANDA);
    request.input('idNOC', sql.Int, idNOC);
    request.input('idNIC', sql.Int, idNIC);

    const relationColumn = idNOC !== null ? 'IdNOC' : idNIC !== null ? 'IdNIC' : null;
    const relatedCatalog = idNOC !== null
        ? 'INNER JOIN dbo.Catalogo_NOC AS c ON c.IdNOC = r.IdNOC AND c.EsActivo = 1'
        : idNIC !== null
            ? 'INNER JOIN dbo.Catalogo_NIC AS c ON c.IdNIC = r.IdNIC AND c.EsActivo = 1'
            : '';
    const selectedRelation = relationColumn ? `AND r.${relationColumn} = @${relationColumn === 'IdNOC' ? 'idNOC' : 'idNIC'}` : '';

    const result = await request.query(`
        IF EXISTS (
            SELECT 1
            FROM dbo.Catalogo_NANDA AS n
            INNER JOIN dbo.NANDA_Interrelacion AS r
                ON r.IdNANDA = n.IdNANDA
            ${relatedCatalog}
            WHERE n.IdNANDA = @idNANDA
              AND n.EsActivo = 1
              ${selectedRelation}
        )
        BEGIN
            INSERT INTO dbo.NotaEnfermeriaPlanCuidado (
                IdNotaEnfermeria, IdNANDA, IdNOC, IdNIC
            )
            VALUES (@idNotaCarePlan, @idNANDA, @idNOC, @idNIC);
            SELECT CAST(1 AS bit) AS Guardado;
        END
        ELSE
        BEGIN
            SELECT CAST(0 AS bit) AS Guardado;
        END;
    `);

    if (!result.recordset[0].Guardado) {
        throw createRepositoryError(
            CARE_PLAN_RELATION_INVALID,
            'Una selección NANDA, NOC o NIC ya no está activa o no corresponde a la interrelación del catálogo.'
        );
    }
}

const NOTAS_QUERY = `
    SELECT
        n.IdNotaEnfermeria,
        n.IdCuenta,
        n.IdPaciente,
        n.IdEmpleado,
        n.Turno,
        n.Fecha_Hora_Inicio,
        n.Fecha_Hora_Fin,
        n.Subjetivo,
        n.Objetivo,
        n.Analisis,
        n.Plan_,
        n.Intervencion,
        n.Evaluacion,
        vital.IdSignoVital,
        vital.Peso,
        vital.Talla,
        vital.P_Cefalico,
        vital.P_Abdominal,
        vital.Hemoglucotest,
        vital.Presion_Arterial,
        vital.Frec_Cardiaca,
        vital.Frec_Respiratoria,
        vital.Temperatura,
        vital.Saturacion,
        cuidado.IdNANDA AS PlanIdNANDA,
        nanda.Codigo AS PlanCodigoNANDA,
        nanda.Diagnostico AS PlanDiagnosticoNANDA,
        cuidado.IdNOC AS PlanIdNOC,
        noc.Codigo AS PlanCodigoNOC,
        noc.Resultado AS PlanResultadoNOC,
        noc.EscalaLikert AS PlanEscalaLikertNOC,
        cuidado.IdNIC AS PlanIdNIC,
        nic.Codigo AS PlanCodigoNIC,
        nic.Intervencion AS PlanIntervencionNIC
    FROM dbo.NotaEnfermeria AS n
    OUTER APPLY (
        SELECT TOP (1) sv.*
        FROM dbo.NotaEnfermeriaSignosVitales AS sv
        WHERE sv.IdNotaEnfermeria = n.IdNotaEnfermeria
        ORDER BY sv.Fecha_Hora DESC, sv.IdSignoVital DESC
    ) AS vital
    LEFT JOIN dbo.NotaEnfermeriaPlanCuidado AS cuidado
        ON cuidado.IdNotaEnfermeria = n.IdNotaEnfermeria
    LEFT JOIN dbo.Catalogo_NANDA AS nanda
        ON nanda.IdNANDA = cuidado.IdNANDA
    LEFT JOIN dbo.Catalogo_NOC AS noc
        ON noc.IdNOC = cuidado.IdNOC
    LEFT JOIN dbo.Catalogo_NIC AS nic
        ON nic.IdNIC = cuidado.IdNIC
`;

async function getAllNotas() {
    return dbHelper.query(`${NOTAS_QUERY} ORDER BY n.Fecha_Hora_Inicio DESC, n.IdNotaEnfermeria DESC;`);
}

async function getNotasPorPaciente(idPaciente) {
    return dbHelper.query(
        `${NOTAS_QUERY} WHERE n.IdPaciente = @idPaciente ORDER BY n.Fecha_Hora_Inicio DESC, n.IdNotaEnfermeria DESC;`,
        [{ name: 'idPaciente', type: sql.Int, value: idPaciente }]
    );
}

async function getHistorialVitals(idNota, limit = 10, offset = 0) {
    return dbHelper.query(`
        SELECT
            sv.IdSignoVital,
            sv.Fecha_Hora,
            sv.Peso,
            sv.Talla,
            sv.P_Cefalico,
            sv.P_Abdominal,
            sv.Hemoglucotest,
            sv.Presion_Arterial,
            sv.Frec_Cardiaca,
            sv.Frec_Respiratoria,
            sv.Temperatura,
            sv.Saturacion,
            sv.IdEmpleado,
            COUNT(*) OVER() AS TotalCount
        FROM dbo.NotaEnfermeriaSignosVitales AS sv
        WHERE sv.IdNotaEnfermeria = @idNota
        ORDER BY sv.Fecha_Hora DESC, sv.IdSignoVital DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
    `, [
        { name: 'idNota', type: sql.Int, value: idNota },
        { name: 'offset', type: sql.Int, value: offset },
        { name: 'limit', type: sql.Int, value: limit },
    ]);
}

async function deleteNotaById(idNota) {
    const pool = await dbHelper.getPool();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        const request = transaction.request();
        request.input('idNota', sql.Int, idNota);
        await request.query(`
            DELETE FROM dbo.NotaEnfermeriaSignosVitales
            WHERE IdNotaEnfermeria = @idNota;

            DELETE FROM dbo.NotaEnfermeriaPlanCuidado
            WHERE IdNotaEnfermeria = @idNota;

            DELETE FROM dbo.NotaEnfermeria
            WHERE IdNotaEnfermeria = @idNota;
        `);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    guardarNotaCompleta,
    getNotasPorPaciente,
    getAllNotas,
    getHistorialVitals,
    deleteNotaById,
    CARE_PLAN_RELATION_INVALID,
    NOTA_NOT_FOUND,
};
