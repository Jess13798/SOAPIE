// Servicio principal para notas de enfermería.
// Aquí vive la lógica del dominio: decidir si una nota es nueva o existente,
// construir el payload SOAPIE, firmar y validar el guardado.

const sql = require('mssql');
const { getPool } = require('../../../../dbHelper');
const { nullIfEmpty } = require('../../../../utils');
const { buildSoapiePayload } = require('../../../../soapieHelper');
const notasRepository = require('../repositories/notasRepository');

async function guardarNota(nota) {
    try {
        const idEmp = nota.idEmpleado || nota.IDEMPLEADO;
        const turnoNota = nota.turno || 'dia';
        const pool = await getPool();

        const soapiePayload = buildSoapiePayload(nota);
        const signosVitales = JSON.stringify(nota.signosVitales || {});
        const soapie = JSON.stringify(soapiePayload);

        let idNota = nota.id;
        const isNew = isNaN(Number(idNota)) || String(idNota).length > 20;
        const sv = nota.signosVitales || {};
        const fechaHoraParsed = `${nota.fecha} ${nota.hora}:00`;
        const fechaHoraSistemas = new Date();
        const e2n = (val) => nullIfEmpty(val);

        if (!isNew) {
            let fechaFin = null;
            if (nota.isFirmada) {
                if (nota.fechaFirmada && nota.horaFirmada) {
                    fechaFin = `${nota.fechaFirmada} ${nota.horaFirmada}:00`;
                } else {
                    fechaFin = fechaHoraSistemas;
                }
            }

            await notasRepository.updateNota({
                idNota,
                turnoNota,
                subjetivo: nota.subjetivo ?? '',
                objetivo: nota.objetivo ?? '',
                analisis: nota.analisis ?? '',
                plan: nota.plan ?? '',
                intervencion: nota.intervencion ?? '',
                evaluacion: nota.evaluacion ?? '',
                fechaFin,
            });

            await notasRepository.insertVitales({
                idNota,
                idPaciente: e2n(nota.pacienteId),
                idCuenta: e2n(nota.idCuenta),
                fechaHoraSistemas,
                idEmpleado: e2n(idEmp),
                sv: {
                    ...sv,
                    pacienteId: e2n(nota.pacienteId),
                    idCuenta: e2n(nota.idCuenta),
                },
            });

            return { success: true, id: idNota };
        }

        let fechaFin = null;
        if (nota.isFirmada) {
            if (nota.fechaFirmada && nota.horaFirmada) {
                fechaFin = `${nota.fechaFirmada} ${nota.horaFirmada}:00`;
            } else {
                fechaFin = fechaHoraSistemas;
            }
        }

        const nuevaIdNota = await notasRepository.insertNota({
            idCuenta: e2n(nota.idCuenta),
            idPaciente: e2n(nota.pacienteId),
            idEmpleado: e2n(nota.idEmpleado),
            turnoNota,
            fechaHoraParsed,
            fechaFin,
            subjetivo: nota.subjetivo ?? '',
            objetivo: nota.objetivo ?? '',
            analisis: nota.analisis ?? '',
            plan: nota.plan ?? '',
            intervencion: nota.intervencion ?? '',
            evaluacion: nota.evaluacion ?? '',
        });

        await notasRepository.insertVitales({
            idNota: nuevaIdNota,
            idPaciente: e2n(nota.pacienteId),
            idCuenta: e2n(nota.idCuenta),
            fechaHoraSistemas,
            idEmpleado: e2n(idEmp),
            sv: {
                ...sv,
                pacienteId: e2n(nota.pacienteId),
                idCuenta: e2n(nota.idCuenta),
            },
        });

        return { success: true, id: nuevaIdNota };
    } catch (err) {
        console.error('Error al guardar nota:', err.message);
        throw err;
    }
}

async function obtenerNotas() {
    try {
        const result = await notasRepository.getAllNotas();
        return (result.recordset || []).map(row => {
            const isFirmada = Boolean(row.Fecha_Hora_Fin);
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
                turno: row.Turno || 'dia',
                enfermera: row.Enfermera || '',
                fecha: fechaInicio,
                hora: horaInicio,
                subjetivo: row.Subjetivo || row.SUBJETIVO || '',
                objetivo: row.Objetivo || row.OBJETIVO || '',
                analisis: row.Analisis || row.ANALISIS || '',
                plan: row.Plan_ || row.PLAN_ || '',
                intervencion: row.Intervencion || row.INTERVENCION || '',
                evaluacion: row.Evaluacion || row.EVALUACION || '',
                isFirmada,
                fechaFirmada,
                horaFirmada,
                signosVitales: {},
            };
        });
    } catch (err) {
        console.error('Error al obtener notas:', err.message);
        throw err;
    }
}

async function obtenerHistorialVitals(idNota, limit = 10, offset = 0) {
    try {
        const result = await notasRepository.getHistorialVitals(idNota, limit, offset);
        return result.recordset || [];
    } catch (err) {
        console.error('Error al obtener historial de vitales:', err.message);
        throw err;
    }
}

async function eliminarNota(id) {
    try {
        await notasRepository.deleteNotaById(id);
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
    obtenerHistorialVitals,
};
