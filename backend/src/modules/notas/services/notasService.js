const notasRepository = require('../repositories/notasRepository');
const { turnoDesdeHora } = require('../../../core/utils/turno');
const { camposObligatorios } = require('../signosVitalesConfig');

function inputError(message) {
    const error = new Error(message);
    error.code = 'NOTAS_INVALID_INPUT';
    return error;
}

function nullableInteger(value, fieldName, required = false) {
    if (value === undefined || value === null || value === '') {
        if (required) throw inputError(`${fieldName} es obligatorio.`);
        return null;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 2147483647) {
        throw inputError(`${fieldName} debe ser un número entero válido.`);
    }
    return parsed;
}

function nullableDecimal(value, fieldName, maximum = 999.99) {
    if (value === undefined || value === null || value === '') return null;
    if (typeof value === 'string') {
        value = value.trim();
        if (!value) return null;
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            throw inputError(`${fieldName} debe ser numérico y tener hasta dos decimales.`);
        }
    } else if (typeof value !== 'number') {
        throw inputError(`${fieldName} debe ser numérico.`);
    }

    const parsed = Number(value);
    if (
        !Number.isFinite(parsed)
        || parsed < 0
        || parsed > maximum
        || Number(parsed.toFixed(2)) !== parsed
    ) {
        throw inputError(`${fieldName} debe ser un valor entre 0 y ${maximum}, con hasta dos decimales.`);
    }
    return parsed;
}

function nullablePositiveNumber(value, fieldName) {
    if (value === undefined || value === null || value === '') return null;
    if (typeof value === 'string') {
        value = value.trim();
        if (!value) return null;
        if (!/^\d+$/.test(value)) {
            throw inputError(`${fieldName} debe ser un número entero no negativo.`);
        }
    } else if (typeof value !== 'number') {
        throw inputError(`${fieldName} debe ser un número entero no negativo.`);
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 2147483647) {
        throw inputError(`${fieldName} debe ser un número entero válido.`);
    }
    return parsed;
}

function normalizeBloodPressure(value) {
    if (value === undefined || value === null || value === '') return null;
    if (typeof value !== 'string' || value.length > 10 || !/^\d{1,3}\/\d{1,3}$/.test(value)) {
        throw inputError('La presión arterial debe tener el formato sistólica/diastólica.');
    }
    const [systolic, diastolic] = value.split('/').map(Number);
    if (systolic <= diastolic || diastolic === 0) {
        throw inputError('La presión arterial debe tener la sistólica mayor que la diastólica.');
    }
    return value;
}

function normalizeComentarioDiagnostico(value) {
    if (value === undefined || value === null) return null;
    if (typeof value !== 'string' || value.length > 1000) {
        throw inputError('El comentario del diagnóstico debe ser texto de hasta 1000 caracteres.');
    }
    return value.trim() || null;
}

function normalizeTextMap(value, fieldName, maximumLength) {
    if (value === undefined || value === null) return {};
    if (typeof value !== 'object' || Array.isArray(value)) {
        throw inputError(`${fieldName} debe ser un objeto de textos.`);
    }

    const normalized = {};
    for (const [key, text] of Object.entries(value)) {
        const id = nullableInteger(key, `${fieldName} Id`, true);
        if (typeof text !== 'string' || text.length > maximumLength) {
            throw inputError(`${fieldName} debe contener textos de hasta ${maximumLength} caracteres.`);
        }
        if (text.trim()) normalized[id] = text.trim();
    }
    return normalized;
}

function requiredClinicalText(value, fieldName) {
    if (typeof value !== 'string' || !value.trim()) {
        throw inputError(`La sección ${fieldName} es obligatoria.`);
    }
    return value;
}

function sqlDateTime(fecha, hora, fieldName) {
    if (
        typeof fecha !== 'string'
        || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
        || typeof hora !== 'string'
        || !/^\d{2}:\d{2}$/.test(hora)
    ) {
        throw inputError(`${fieldName} es obligatorio.`);
    }
    const parsed = new Date(`${fecha}T${hora}:00`);
    if (
        Number.isNaN(parsed.getTime())
        || parsed.getFullYear() !== Number(fecha.slice(0, 4))
        || parsed.getMonth() + 1 !== Number(fecha.slice(5, 7))
        || parsed.getDate() !== Number(fecha.slice(8, 10))
        || parsed.getHours() !== Number(hora.slice(0, 2))
        || parsed.getMinutes() !== Number(hora.slice(3, 5))
    ) {
        throw inputError(`${fieldName} no tiene un formato válido.`);
    }
    return parsed;
}

function normalizePlanCuidados(planCuidados = []) {
    if (!Array.isArray(planCuidados)) {
        throw inputError('planCuidados debe ser una lista.');
    }

    const diagnoses = new Map();
    for (const item of planCuidados) {
        if (!item || typeof item !== 'object') {
            throw inputError('Cada selección del plan de cuidados debe ser un objeto válido.');
        }
        const idNANDA = nullableInteger(item?.idNANDA, 'IdNANDA', true);
        const diagnosis = diagnoses.get(idNANDA) || {
            idNANDA,
            comentario: null,
            nocIds: new Set(),
            nicIds: new Set(),
            nicRealizadasIds: new Set(),
            nicNoRealizadas: {},
            nocMetas: {},
            nocEvaluaciones: {},
        };
        if (item.comentario !== undefined) {
            diagnosis.comentario = normalizeComentarioDiagnostico(item.comentario);
        }
        if (item.nocIds !== undefined && !Array.isArray(item.nocIds)) {
            throw inputError('nocIds debe ser una lista.');
        }
        if (item.nicIds !== undefined && !Array.isArray(item.nicIds)) {
            throw inputError('nicIds debe ser una lista.');
        }
        if (item.nicRealizadasIds !== undefined && !Array.isArray(item.nicRealizadasIds)) {
            throw inputError('nicRealizadasIds debe ser una lista.');
        }
        for (const id of item.nocIds || []) {
            diagnosis.nocIds.add(nullableInteger(id, 'IdNOC', true));
        }
        for (const id of item.nicIds || []) {
            diagnosis.nicIds.add(nullableInteger(id, 'IdNIC', true));
        }
        for (const id of item.nicRealizadasIds || []) {
            diagnosis.nicRealizadasIds.add(nullableInteger(id, 'IdNIC realizada', true));
        }
        // Motivo por el que una NIC planificada no se realizó. Viaja como mapa
        // { idNIC: motivo }; solo se aceptan motivos de NIC planificadas.
        if (item.nicNoRealizadas !== undefined && (typeof item.nicNoRealizadas !== 'object' || item.nicNoRealizadas === null || Array.isArray(item.nicNoRealizadas))) {
            throw inputError('nicNoRealizadas debe ser un objeto { idNIC: motivo }.');
        }
        Object.assign(diagnosis.nicNoRealizadas, normalizeTextMap(item.nicNoRealizadas, 'nicNoRealizadas', 500));
        Object.assign(diagnosis.nocMetas, normalizeTextMap(item.nocMetas, 'nocMetas', 250));
        Object.assign(
            diagnosis.nocEvaluaciones,
            normalizeTextMap(item.nocEvaluaciones, 'nocEvaluaciones', 500),
        );
        diagnoses.set(idNANDA, diagnosis);
    }

    return Array.from(diagnoses.values(), item => {
        const nicRealizadasIds = Array.from(item.nicRealizadasIds);
        if (nicRealizadasIds.some(id => !item.nicIds.has(id))) {
            throw inputError('Toda NIC realizada debe estar seleccionada como intervención planificada.');
        }
        const nocIds = Array.from(item.nocIds);
        const nocIdSet = new Set(nocIds);

        // Solo tiene sentido el motivo de una NIC planificada y NO realizada.
        const nicNoRealizadas = Object.fromEntries(
            Object.entries(item.nicNoRealizadas).filter(([id, motivo]) => (
                item.nicIds.has(Number(id))
                && !item.nicRealizadasIds.has(Number(id))
                && String(motivo || '').trim()
            )),
        );

        return {
            idNANDA: item.idNANDA,
            comentario: item.comentario,
            nocIds,
            nicIds: Array.from(item.nicIds),
            nicRealizadasIds,
            nicNoRealizadas,
            nocMetas: Object.fromEntries(
                Object.entries(item.nocMetas).filter(([id]) => nocIdSet.has(Number(id))),
            ),
            nocEvaluaciones: Object.fromEntries(
                Object.entries(item.nocEvaluaciones).filter(([id]) => nocIdSet.has(Number(id))),
            ),
        };
    });
}

// La fecha y hora de firma las pone el SERVIDOR (no el reloj del equipo del
// usuario). Así el registro no depende de que la PC tenga la hora correcta.
function getSignedDateTime(nota) {
    if (!nota.isFirmada) return null;
    return new Date();
}

async function guardarNota(nota) {
    if (!nota || typeof nota !== 'object') {
        throw inputError('Los datos de la nota son obligatorios.');
    }

    const signos = nota.signosVitales || {};
    const idCuenta = nullableInteger(nota.idCuenta, 'IdCuenta');
    const idPaciente = nullableInteger(nota.pacienteId, 'IdPaciente', true);
    const idEmpleado = nullableInteger(nota.idEmpleado || nota.IDEMPLEADO, 'IdEmpleado');
    // Servicio en el que se escribe la nota. El repositorio prioriza la
    // estancia abierta del paciente; esto queda como respaldo (sin cama).
    const idServicio = nullableInteger(nota.servicioId, 'IdServicio');
    const idNotaParsed = Number(nota.id);
    const idNota = Number.isInteger(idNotaParsed) && idNotaParsed > 0 && idNotaParsed <= 2147483647
        ? idNotaParsed
        : null;

    // La hora la pone el SERVIDOR, no el reloj de la PC del usuario.
    // Al crear la nota, el inicio es el momento del guardado; al editarla se
    // conserva la hora original (el repositorio no modifica Fecha_Hora_Inicio).
    const ahora = new Date();
    const fechaInicio = idNota === null
        ? ahora
        : sqlDateTime(nota.fecha, nota.hora, 'fecha y hora de inicio');

    const valores = {
        idNota,
        idCuenta,
        idPaciente,
        idEmpleado,
        idServicio,
        // El turno se DERIVA de la hora de la nota; el usuario ya no lo elige.
        turno: turnoDesdeHora(fechaInicio),
        fechaInicio,
        fechaFin: getSignedDateTime(nota),
        subjetivo: requiredClinicalText(nota.subjetivo, 'Subjetivo'),
        objetivo: requiredClinicalText(nota.objetivo, 'Objetivo'),
        analisis: typeof nota.analisis === 'string' ? nota.analisis : '',
        plan: requiredClinicalText(nota.plan, 'Plan'),
        intervencion: requiredClinicalText(nota.intervencion, 'Intervención'),
        evaluacion: requiredClinicalText(nota.evaluacion, 'Evaluación'),
        signosVitales: {
            peso: nullableDecimal(signos.peso, 'peso'),
            talla: nullableDecimal(signos.talla, 'talla'),
            pCefalico: nullableDecimal(signos.pCefalico, 'perímetro cefálico'),
            pAbdominal: nullableDecimal(signos.pAbdominal, 'perímetro abdominal'),
            hemoglucotest: nullableDecimal(signos.hemoglucotest ?? signos.glucosa, 'hemoglucotest'),
            presionArterial: normalizeBloodPressure(signos.presionArterial),
            frecuenciaCardiaca: nullablePositiveNumber(signos.frecuenciaCardiaca, 'frecuencia cardiaca'),
            frecuenciaRespiratoria: nullablePositiveNumber(signos.frecuenciaRespiratoria, 'frecuencia respiratoria'),
            temperatura: nullableDecimal(signos.temperatura, 'temperatura', 99.99),
            saturacionOxigeno: nullablePositiveNumber(signos.saturacionOxigeno, 'saturación de oxígeno'),
        },
        planCuidados: normalizePlanCuidados(nota.planCuidados || []),
        fechaHora: ahora,
    };

    if (!valores.analisis.trim() && valores.planCuidados.length === 0) {
        throw inputError('La sección Análisis requiere texto o al menos un diagnóstico NANDA.');
    }

    if (idNota === null) {
        // Qué signos vitales son obligatorios depende del servicio (ver
        // signosVitalesConfig). Los servicios sin configuración exigen todos.
        const etiquetas = {
            peso: 'peso',
            talla: 'talla',
            pCefalico: 'perímetro cefálico',
            pAbdominal: 'perímetro abdominal',
            hemoglucotest: 'hemoglucotest',
            presionArterial: 'presión arterial',
            frecuenciaCardiaca: 'frecuencia cardiaca',
            frecuenciaRespiratoria: 'frecuencia respiratoria',
            temperatura: 'temperatura',
            saturacionOxigeno: 'saturación de oxígeno',
        };
        const faltantes = camposObligatorios(valores.idServicio)
            .filter((campo) => valores.signosVitales[campo] === null)
            .map((campo) => etiquetas[campo] || campo);
        if (faltantes.length > 0) {
            throw inputError(`Complete los signos vitales obligatorios de este servicio: ${faltantes.join(', ')}.`);
        }
    }

    if (valores.signosVitales.saturacionOxigeno !== null && valores.signosVitales.saturacionOxigeno > 100) {
        throw inputError('La saturación de oxígeno debe estar entre 0 y 100%.');
    }

    try {
        const result = await notasRepository.guardarNotaCompleta(valores);
        const id = typeof result === 'object' && result !== null ? result.id : result;
        const vitalesRegistrados = typeof result === 'object' && result !== null ? result.vitalesRegistrados : undefined;
        const servicioId = typeof result === 'object' && result !== null ? result.servicioId : undefined;
        // Se devuelve el turno calculado para que el frontend muestre el mismo
        // valor que quedó guardado en la base de datos.
        const respuesta = { success: true, id, turno: valores.turno, vitalesRegistrados };
        // Solo se informa el servicio cuando el repositorio lo pudo resolver.
        if (servicioId !== undefined) respuesta.servicioId = servicioId;
        return respuesta;
    } catch (error) {
        console.error('Error al guardar nota:', error.message);
        throw error;
    }
}

function datePart(value) {
    return value ? new Date(value).toISOString().split('T')[0] : '';
}

function timePart(value) {
    return value ? new Date(value).toISOString().substring(11, 16) : '';
}

function addUnique(items, value, key) {
    if (value && !items.some(item => item[key] === value[key])) {
        items.push(value);
    }
}

async function obtenerNotas() {
    try {
        const result = await notasRepository.getAllNotas();
        const notes = new Map();

        for (const row of result.recordset || []) {
            const id = String(row.IdNotaEnfermeria);
            let nota = notes.get(id);
            if (!nota) {
                const isFirmada = Boolean(row.Fecha_Hora_Fin);
                nota = {
                    id,
                    pacienteId: String(row.IdPaciente ?? ''),
                    idCuenta: String(row.IdCuenta ?? ''),
                    idEmpleado: String(row.IdEmpleado ?? ''),
                    servicioId: row.IdServicio == null ? null : Number(row.IdServicio),
                    servicio: row.Servicio || '',
                    turno: row.Turno === 'noche' ? 'noche' : 'dia',
                    enfermera: row.Enfermera || '',
                    fecha: datePart(row.Fecha_Hora_Inicio),
                    hora: timePart(row.Fecha_Hora_Inicio),
                    subjetivo: row.Subjetivo || '',
                    objetivo: row.Objetivo || '',
                    analisis: row.Analisis || '',
                    plan: row.Plan_ || '',
                    intervencion: row.Intervencion || '',
                    evaluacion: row.Evaluacion || '',
                    isFirmada,
                    fechaFirmada: datePart(row.Fecha_Hora_Fin),
                    horaFirmada: timePart(row.Fecha_Hora_Fin),
                    signosVitales: row.IdSignoVital === null || row.IdSignoVital === undefined ? undefined : {
                        peso: row.Peso == null ? '' : String(row.Peso),
                        talla: row.Talla == null ? '' : String(row.Talla),
                        pCefalico: row.P_Cefalico == null ? '' : String(row.P_Cefalico),
                        pAbdominal: row.P_Abdominal == null ? '' : String(row.P_Abdominal),
                        hemoglucotest: row.Hemoglucotest == null ? '' : String(row.Hemoglucotest),
                        presionArterial: row.Presion_Arterial || '',
                        frecuenciaCardiaca: row.Frec_Cardiaca == null ? '' : String(row.Frec_Cardiaca),
                        frecuenciaRespiratoria: row.Frec_Respiratoria == null ? '' : String(row.Frec_Respiratoria),
                        temperatura: row.Temperatura == null ? '' : String(row.Temperatura),
                        saturacionOxigeno: row.Saturacion == null ? '' : String(row.Saturacion),
                    },
                    planCuidados: [],
                };
                notes.set(id, nota);
            }

            if (row.PlanIdNANDA == null) continue;
            let plan = nota.planCuidados.find(item => item.idNANDA === row.PlanIdNANDA);
            if (!plan) {
                plan = {
                    idNANDA: row.PlanIdNANDA,
                    codigoNANDA: row.PlanCodigoNANDA,
                    diagnostico: row.PlanDiagnosticoNANDA,
                    comentario: row.PlanComentarioNANDA || '',
                    nocIds: [],
                    nicIds: [],
                    nicRealizadasIds: [],
                    nicNoRealizadas: {},
                    nocMetas: {},
                    nocEvaluaciones: {},
                    noc: [],
                    nic: [],
                };
                nota.planCuidados.push(plan);
            }
            if (row.PlanIdNOC != null) {
                if (!plan.nocIds.includes(row.PlanIdNOC)) plan.nocIds.push(row.PlanIdNOC);
                if (row.PlanMetaNOC != null) plan.nocMetas[row.PlanIdNOC] = row.PlanMetaNOC;
                if (row.PlanResultadoObservadoNOC != null) {
                    plan.nocEvaluaciones[row.PlanIdNOC] = row.PlanResultadoObservadoNOC;
                }
                addUnique(plan.noc, {
                    id: row.PlanIdNOC,
                    codigo: row.PlanCodigoNOC,
                    resultado: row.PlanResultadoNOC,
                    escalaLikert: row.PlanEscalaLikertNOC,
                }, 'id');
            }
            if (row.PlanIdNIC != null) {
                if (!plan.nicIds.includes(row.PlanIdNIC)) plan.nicIds.push(row.PlanIdNIC);
                if (row.PlanNICRealizada && !plan.nicRealizadasIds.includes(row.PlanIdNIC)) {
                    plan.nicRealizadasIds.push(row.PlanIdNIC);
                }
                if (!row.PlanNICRealizada && row.PlanNICMotivo) {
                    plan.nicNoRealizadas[row.PlanIdNIC] = row.PlanNICMotivo;
                }
                addUnique(plan.nic, {
                    id: row.PlanIdNIC,
                    codigo: row.PlanCodigoNIC,
                    intervencion: row.PlanIntervencionNIC,
                }, 'id');
            }
        }

        return Array.from(notes.values());
    } catch (error) {
        console.error('Error al obtener notas:', error.message);
        throw error;
    }
}

async function obtenerHistorialVitals(idNota, limit = 10, offset = 0) {
    const notaId = nullableInteger(idNota, 'IdNota', true);
    const pageSize = nullablePositiveNumber(limit, 'límite');
    const startAt = nullablePositiveNumber(offset, 'desplazamiento');
    if (!pageSize || pageSize > 100 || startAt === null) {
        throw inputError('La paginación del historial de signos vitales no es válida.');
    }

    try {
        const result = await notasRepository.getHistorialVitals(notaId, pageSize, startAt);
        return result.recordset || [];
    } catch (error) {
        console.error('Error al obtener historial de vitales:', error.message);
        throw error;
    }
}

async function obtenerHistorialVitalsPorAtencion(idCuenta, limit = 10, offset = 0) {
    const cuentaId = nullableInteger(idCuenta, 'IdCuentaAtencion', true);
    const pageSize = nullablePositiveNumber(limit, 'límite');
    const startAt = nullablePositiveNumber(offset, 'desplazamiento');
    if (!pageSize || pageSize > 100 || startAt === null) {
        throw inputError('La paginación del historial de signos vitales no es válida.');
    }

    try {
        const result = await notasRepository.getHistorialVitalsPorAtencion(cuentaId, pageSize, startAt);
        return result.recordset || [];
    } catch (error) {
        console.error('Error al obtener historial de vitales por atención:', error.message);
        throw error;
    }
}

async function eliminarNota(id) {
    const notaId = nullableInteger(id, 'IdNota', true);
    try {
        await notasRepository.deleteNotaById(notaId);
        return { success: true };
    } catch (error) {
        console.error('Error al eliminar nota:', error.message);
        throw error;
    }
}

module.exports = {
    guardarNota,
    obtenerNotas,
    eliminarNota,
    obtenerHistorialVitals,
    obtenerHistorialVitalsPorAtencion,
};
