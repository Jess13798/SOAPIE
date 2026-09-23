const { sql, dbConfig } = require('./database');

function parseJsonSafe(value, fallback = {}) {
    if (!value) return fallback;
    try {
        return JSON.parse(value);
    } catch (err) {
        return fallback;
    }
}

// Funcion para guardar una nota
async function guardarNota(nota) {
    try {
        const idEmp = nota.idEmpleado || nota.IDEMPLEADO;
        console.log('Intentando guardar nota:', nota.id, 'pacienteId:', nota.pacienteId, 'idEmpleado:', idEmp)
        const pool = await sql.connect(dbConfig);

        // Convertir objetos a JSON (incluye SOAPIE + metadatos de firma)
        const signosVitales = JSON.stringify(nota.signosVitales || {});
        const soapiePayload = {
            subjetivo: nota.subjetivo ?? nota.soapie?.subjetivo ?? nota.soapie?.s ?? '',
            objetivo: nota.objetivo ?? nota.soapie?.objetivo ?? nota.soapie?.o ?? '',
            analisis: nota.analisis ?? nota.soapie?.analisis ?? nota.soapie?.a ?? '',
            plan: nota.plan ?? nota.soapie?.plan ?? nota.soapie?.p ?? '',
            intervencion: nota.intervencion ?? nota.soapie?.intervencion ?? nota.soapie?.i ?? '',
            evaluacion: nota.evaluacion ?? nota.soapie?.evaluacion ?? nota.soapie?.e ?? '',
            antecedentes: nota.antecedentes ?? '',
            diagnosticos: nota.diagnosticos ?? '',
            farmacia: nota.farmacia ?? '',
            laboratorio: nota.laboratorio ?? '',
            imagen: nota.imagen ?? '',
            fechaFirmada: nota.fechaFirmada ?? null,
            horaFirmada: nota.horaFirmada ?? null
        };
        const soapie = JSON.stringify(soapiePayload);

        // Verificar si la nota es un string UUID (nueva) o numero (existente)
        let idNota = nota.id;
        const isNew = isNaN(Number(idNota)) || String(idNota).length > 20;

        const sv = nota.signosVitales || {};
        const fechaHoraParsed = `${nota.fecha} ${nota.hora}:00`;
        const fechaHoraSistemas = new Date(); // Usar la hora real del momento de guardado
        const e2n = (val) => (val === undefined || val === null || String(val).trim() === '') ? null : val;

        if (!isNew) {
            // Actualizar nota existente
            let fechaFin = null;
            if (nota.isFirmada) {
                if (nota.fechaFirmada && nota.horaFirmada) {
                    fechaFin = `${nota.fechaFirmada} ${nota.horaFirmada}:00`;
                } else {
                    fechaFin = fechaHoraSistemas;
                }
            }

            await pool.query`
                UPDATE NotaEnfermeria SET
                    Subjetivo = ${nota.subjetivo ?? ''},
                    Objetivo = ${nota.objetivo ?? ''},
                    Analisis = ${nota.analisis ?? ''},
                    Plan_ = ${nota.plan ?? ''},
                    Intervencion = ${nota.intervencion ?? ''},
                    Evaluacion = ${nota.evaluacion ?? ''},
                    Fecha_Hora_Fin = ${fechaFin}
                WHERE IdNotaEnfermeria = ${idNota}
            `;

            // Insertar un NUEVO registro de signos vitales (para auditoría/historial)
            await pool.query`
                INSERT INTO NotaEnfermeriaSignosVitales (
                    IdNotaEnfermeria, IDPACIENTE, IdCuentaatencion, Fecha_Hora, IdEmpleado,
                    Peso, Talla, P_Cefalico, P_Abdominal, Hemoglucotest,
                    Presion_Arterial, Frec_Cardiaca, Frec_Respiratoria, Temperatura, Saturacion
                )
                VALUES (
                    ${idNota}, ${e2n(nota.pacienteId)}, ${e2n(nota.idCuenta)}, ${fechaHoraSistemas}, ${e2n(idEmp)},
                    ${e2n(sv.peso)}, ${e2n(sv.talla)}, ${e2n(sv.pCefalico)}, ${e2n(sv.pAbdominal)},
                    ${e2n(sv.hemoglucotest)}, ${e2n(sv.presionArterial)}, ${e2n(sv.frecuenciaCardiaca)},
                    ${e2n(sv.frecuenciaRespiratoria)}, ${e2n(sv.temperatura)}, ${e2n(sv.saturacionOxigeno)}
                )
            `;
            console.log('Nota y vitales actualizados:', idNota);
        } else {
            let idNotaReciente = null;
            try {
                let fechaFin = null;
                if (nota.isFirmada) {
                    if (nota.fechaFirmada && nota.horaFirmada) {
                        fechaFin = `${nota.fechaFirmada} ${nota.horaFirmada}:00`;
                    } else {
                        fechaFin = fechaHoraSistemas;
                    }
                }

                const resultInsert = await pool.query`
                    INSERT INTO NotaEnfermeria (
                        IdCuenta, IdPaciente, IdEmpleado, Fecha_Hora_Inicio, Fecha_Hora_Fin,
                        Subjetivo, Objetivo, Analisis, Plan_, Intervencion, Evaluacion
                    )
                    OUTPUT INSERTED.IdNotaEnfermeria
                    VALUES (
                        ${e2n(nota.idCuenta)}, ${e2n(nota.pacienteId)}, ${e2n(nota.idEmpleado)}, ${fechaHoraParsed}, ${fechaFin},
                        ${nota.subjetivo ?? ''}, ${nota.objetivo ?? ''}, ${nota.analisis ?? ''}, 
                        ${nota.plan ?? ''}, ${nota.intervencion ?? ''}, ${nota.evaluacion ?? ''}
                    )
                `;
                idNotaReciente = resultInsert.recordset[0].IdNotaEnfermeria;
                idNota = idNotaReciente;
            } catch (e) {
                console.error("==> Error SQL en Tabla NotaEnfermeria:", e.message);
                throw e;
            }

            try {
                await pool.query`
                    INSERT INTO NotaEnfermeriaSignosVitales (
                    IdNotaEnfermeria, IDPACIENTE, IdCuentaatencion, Fecha_Hora, IdEmpleado,
                    Peso, Talla, P_Cefalico, P_Abdominal, Hemoglucotest,
                    Presion_Arterial, Frec_Cardiaca, Frec_Respiratoria, Temperatura, Saturacion
                )
                VALUES (
                    ${idNota}, ${e2n(nota.pacienteId)}, ${e2n(nota.idCuenta)}, ${fechaHoraSistemas}, ${e2n(idEmp)},
                    ${e2n(sv.peso)}, ${e2n(sv.talla)}, ${e2n(sv.pCefalico)}, ${e2n(sv.pAbdominal)},
                    ${e2n(sv.hemoglucotest)}, ${e2n(sv.presionArterial)}, ${e2n(sv.frecuenciaCardiaca)},
                    ${e2n(sv.frecuenciaRespiratoria)}, ${e2n(sv.temperatura)}, ${e2n(sv.saturacionOxigeno)}
                )
            `;
            console.log('Nota y vitales guardados con ID:', idNota);
            } catch (e) {
                console.error("==> Error SQL en Tabla NotaEnfermeriaSignosVitales. Revisa si alguna columna es INT y enviaste letras (ej. presionArterial=120/80):", e.message);
                throw e;
            }
        }

        return { success: true, id: idNota };
    } catch (err) {
        console.error('Error al guardar nota:', err.message);
        throw err;
    }
}

// Funcion para obtener todas las notas
async function obtenerNotas() {
    try {
        console.log('Intentando obtener notas de la base de datos...')
        const pool = await sql.connect(dbConfig);
        const result = await pool.query(`
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

        console.log('Notas encontradas en BD:', result.recordset.length)

        // Convertir los resultados al formato del frontend
        const notas = result.recordset.map(row => {
            const isFirmada = row.Fecha_Hora_Fin ? true : false;
            let fechaFirmada = '';
            let horaFirmada = '';
            if (isFirmada) {
                const dateObj = new Date(row.Fecha_Hora_Fin);
                fechaFirmada = dateObj.toISOString().split('T')[0];
                horaFirmada = dateObj.toISOString().substring(11, 16);
            }

            let fechaInicio = '';
            let horaInicio = '';
            if (row.Fecha_Hora_Inicio) {
                const dateIni = new Date(row.Fecha_Hora_Inicio);
                fechaInicio = dateIni.toISOString().split('T')[0];
                horaInicio = dateIni.toISOString().substring(11, 16);
            }

            return {
                id: String(row.IdNotaEnfermeria),
                pacienteId: String(row.IdPaciente || row.IDPACIENTE),
                idCuenta: String(row.IdCuenta || row.IDCUENTA),
                idEmpleado: String(row.IdEmpleado || row.IDEMPLEADO),
                enfermera: row.Enfermera || '',
                fecha: fechaInicio,
                hora: horaInicio,
                subjetivo: row.Subjetivo || row.SUBJETIVO || '',
                objetivo: row.Objetivo || row.OBJETIVO || '',
                analisis: row.Analisis || row.ANALISIS || '',
                plan: row.Plan_ || row.PLAN_ || '',
                intervencion: row.Intervencion || row.INTERVENCION || '',
                evaluacion: row.Evaluacion || row.EVALUACION || '',
                isFirmada: isFirmada,
                fechaFirmada: fechaFirmada,
                horaFirmada: horaFirmada,
                signosVitales: {} // Opcional: podrías hacer un JOIN para traer el último registro de vitales
            };
        });

        return notas;
    } catch (err) {
        console.error('Error al obtener notas:', err.message);
        throw err;
    }
}

// Funcion para eliminar una nota
// Funcion para obtener historial de signos vitales de una nota con paginación
async function obtenerHistorialVitals(idNota, limit = 10, offset = 0) {
    try {
        const pool = await sql.connect(dbConfig);
        // Usamos pool.request() para manejar parámetros nombrados de forma segura
        const result = await pool.request()
            .input('idNota', sql.Int, idNota)
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, limit)
            .query(`
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
            `);
        return result.recordset;
    } catch (err) {
        console.error('Error al obtener historial de vitales:', err.message);
        throw err;
    }
}

async function eliminarNota(id) {
    try {
        const pool = await sql.connect(dbConfig);
        await pool.query`DELETE FROM NotasEnfermeria WHERE id = ${id}`;
        console.log('Nota eliminada:', id);
        return { success: true };
    } catch (err) {
        console.error('Error al eliminar nota:', err.message);
        throw err;
    }
}

module.exports = {
    guardarNota,
    obtenerNotas,
    eliminarNota,
    obtenerHistorialVitals
};
