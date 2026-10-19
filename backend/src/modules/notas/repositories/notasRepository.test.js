const assert = require('node:assert/strict');
const test = require('node:test');
const notasRepository = require('./notasRepository');
const notasService = require('../services/notasService');

function notePayload(overrides = {}) {
    const payload = {
        pacienteId: '100',
        idCuenta: '200',
        idEmpleado: '300',
        fecha: '2026-10-09',
        hora: '12:00',
        turno: 'dia',
        subjetivo: 'Refiere dolor',
        objetivo: 'Paciente consciente',
        analisis: 'Dolor referido',
        plan: 'Vigilancia y manejo del dolor',
        intervencion: 'Se brinda cuidado',
        evaluacion: 'Tolera la intervención',
        signosVitales: {
            peso: '60',
            talla: '160',
            pCefalico: '55',
            pAbdominal: '80',
            hemoglucotest: '95',
            presionArterial: '120/80',
            frecuenciaCardiaca: '80',
            frecuenciaRespiratoria: '18',
            temperatura: '36.7',
            saturacionOxigeno: '98',
        },
        planCuidados: [],
    };
    return {
        ...payload,
        ...overrides,
        signosVitales: { ...payload.signosVitales, ...overrides.signosVitales },
    };
}

test('guardarNota rejects a note without a valid patient id', async () => {
    await assert.rejects(notasService.guardarNota({
        fecha: '2026-10-09',
        hora: '12:00',
    }), { code: 'NOTAS_INVALID_INPUT' });
});

test('guardarNota normalizes selections and persists the SOAPIE payload', async (context) => {
    let savedNote;
    context.mock.method(notasRepository, 'guardarNotaCompleta', async (note) => {
        savedNote = note;
        return { id: 81, vitalesRegistrados: true };
    });

    const result = await notasService.guardarNota(notePayload({
        id: 'draft-1',
        turno: 'noche',
        subjetivo: 'Refiere dolor',
        signosVitales: { temperatura: '36.7', frecuenciaCardiaca: '80' },
        planCuidados: [
            {
                idNANDA: 1,
                comentario: '  Dolor referido en hipogastrio  ',
                nocIds: [10, 10],
                nicIds: [20],
                nicRealizadasIds: [20],
                nocMetas: { 10: '  Meta inicial  ' },
                nocEvaluaciones: { 10: '  Evolución favorable  ' },
            },
            { idNANDA: 1, nocIds: [11], nicIds: [] },
        ],
    }));

    assert.deepEqual(result, { success: true, id: 81, vitalesRegistrados: true });
    assert.equal(savedNote.idNota, null);
    assert.equal(savedNote.idPaciente, 100);
    assert.equal(savedNote.idCuenta, 200);
    assert.equal(savedNote.idEmpleado, 300);
    assert.equal(savedNote.turno, 'noche');
    assert.equal(savedNote.signosVitales.temperatura, 36.7);
    assert.equal(savedNote.signosVitales.frecuenciaCardiaca, 80);
    assert.deepEqual(savedNote.planCuidados, [
        {
            idNANDA: 1,
            comentario: 'Dolor referido en hipogastrio',
            nocIds: [10, 11],
            nicIds: [20],
            nicRealizadasIds: [20],
            nocMetas: { 10: 'Meta inicial' },
            nocEvaluaciones: { 10: 'Evolución favorable' },
        },
    ]);
});

test('guardarNota rejects a performed NIC that was not planned', async () => {
    await assert.rejects(notasService.guardarNota(notePayload({
        planCuidados: [{ idNANDA: 1, nocIds: [], nicIds: [20], nicRealizadasIds: [21] }],
    })), { code: 'NOTAS_INVALID_INPUT' });
});

test('guardarNota drops NOC values that do not belong to selected NOC ids', async (context) => {
    let savedNote;
    context.mock.method(notasRepository, 'guardarNotaCompleta', async (note) => {
        savedNote = note;
        return { id: 81, vitalesRegistrados: true };
    });

    await notasService.guardarNota(notePayload({
        planCuidados: [{
            idNANDA: 1,
            nocIds: [10],
            nicIds: [],
            nocMetas: { 10: 'Meta', 11: 'No seleccionada' },
            nocEvaluaciones: { 10: 'Observado', 11: 'Sin selección' },
        }],
    }));

    assert.deepEqual(savedNote.planCuidados[0].nocMetas, { 10: 'Meta' });
    assert.deepEqual(savedNote.planCuidados[0].nocEvaluaciones, { 10: 'Observado' });
});

test('guardarNota rejects oxygen saturation above 100 percent', async (context) => {
    const save = context.mock.method(notasRepository, 'guardarNotaCompleta', async () => 81);
    await assert.rejects(notasService.guardarNota(notePayload({
        signosVitales: { saturacionOxigeno: '101' },
    })), { code: 'NOTAS_INVALID_INPUT' });
    assert.equal(save.mock.callCount(), 0);
});

test('guardarNota rejects pressure with diastolic value greater than systolic', async () => {
    await assert.rejects(notasService.guardarNota(notePayload({
        signosVitales: { presionArterial: '70/80' },
    })), { code: 'NOTAS_INVALID_INPUT' });
});

test('guardarNota accepts decimal vital values with two fractional digits', async (context) => {
    let savedNote;
    context.mock.method(notasRepository, 'guardarNotaCompleta', async (note) => {
        savedNote = note;
        return { id: 81, vitalesRegistrados: true };
    });

    await notasService.guardarNota(notePayload({
        signosVitales: { peso: '0.29' },
    }));

    assert.equal(savedNote.signosVitales.peso, 0.29);
});

test('guardarNota rejects decimal vital values with more than two fractional digits', async () => {
    await assert.rejects(notasService.guardarNota(notePayload({
        signosVitales: { peso: '0.291' },
    })), { code: 'NOTAS_INVALID_INPUT' });
});

test('guardarNota requires every vital sign when creating a note', async (context) => {
    const save = context.mock.method(notasRepository, 'guardarNotaCompleta', async () => 81);
    await assert.rejects(notasService.guardarNota(notePayload({
        signosVitales: { peso: '' },
    })), { code: 'NOTAS_INVALID_INPUT' });
    assert.equal(save.mock.callCount(), 0);
});

test('guardarNota allows SOAPIE edits without a complete new vital-sign set', async (context) => {
    let savedNote;
    context.mock.method(notasRepository, 'guardarNotaCompleta', async (note) => {
        savedNote = note;
        return { id: 81, vitalesRegistrados: false };
    });

    const result = await notasService.guardarNota(notePayload({
        id: '81',
        signosVitales: {
            peso: '',
            talla: '',
            pCefalico: '',
            pAbdominal: '',
            hemoglucotest: '',
            presionArterial: '',
            frecuenciaCardiaca: '',
            frecuenciaRespiratoria: '',
            temperatura: '',
            saturacionOxigeno: '',
        },
    }));

    assert.equal(savedNote.idNota, 81);
    assert.deepEqual(result, { success: true, id: 81, vitalesRegistrados: false });
});

test('guardarNota rejects comments longer than the database column limit', async () => {
    await assert.rejects(notasService.guardarNota(notePayload({
        planCuidados: [{ idNANDA: 1, comentario: 'x'.repeat(1001) }],
    })), { code: 'NOTAS_INVALID_INPUT' });
});

test('obtenerNotas groups selected NOC and NIC under each note diagnosis', async (context) => {
    context.mock.method(notasRepository, 'getAllNotas', async () => ({
        recordset: [
            {
                IdNotaEnfermeria: 81,
                IdPaciente: 100,
                IdCuenta: 200,
                Fecha_Hora_Inicio: new Date('2026-10-09T12:00:00Z'),
                IdSignoVital: 5,
                Temperatura: 36.7,
                PlanIdNANDA: 1,
                PlanCodigoNANDA: 'N1',
                PlanDiagnosticoNANDA: 'Diagnóstico de prueba',
                PlanComentarioNANDA: 'Hallazgo asociado al diagnóstico',
                PlanIdNOC: 10,
                PlanCodigoNOC: 'R1',
                PlanResultadoNOC: 'Resultado',
                PlanMetaNOC: 'Meta esperada',
                PlanResultadoObservadoNOC: 'Resultado observado',
            },
            {
                IdNotaEnfermeria: 81,
                IdPaciente: 100,
                IdCuenta: 200,
                Fecha_Hora_Inicio: new Date('2026-10-09T12:00:00Z'),
                IdSignoVital: 5,
                Temperatura: 36.7,
                PlanIdNANDA: 1,
                PlanCodigoNANDA: 'N1',
                PlanDiagnosticoNANDA: 'Diagnóstico de prueba',
                PlanIdNIC: 20,
                PlanCodigoNIC: 'I1',
                PlanIntervencionNIC: 'Intervención',
                PlanNICRealizada: true,
            },
        ],
    }));

    const [nota] = await notasService.obtenerNotas();

    assert.equal(nota.id, '81');
    assert.equal(nota.signosVitales.temperatura, '36.7');
    assert.equal(nota.planCuidados.length, 1);
    assert.equal(nota.planCuidados[0].comentario, 'Hallazgo asociado al diagnóstico');
    assert.deepEqual(nota.planCuidados[0].nocIds, [10]);
    assert.deepEqual(nota.planCuidados[0].nicIds, [20]);
    assert.deepEqual(nota.planCuidados[0].nocMetas, { 10: 'Meta esperada' });
    assert.deepEqual(nota.planCuidados[0].nocEvaluaciones, { 10: 'Resultado observado' });
    assert.deepEqual(nota.planCuidados[0].nicRealizadasIds, [20]);
});

test('obtenerHistorialVitalsPorAtencion filters and paginates by account id', async (context) => {
    let query;
    context.mock.method(notasRepository, 'getHistorialVitalsPorAtencion', async (...args) => {
        query = args;
        return { recordset: [{ IdSignoVital: 9, NombreEmpleado: 'ENFERMERA DE PRUEBA' }] };
    });

    const result = await notasService.obtenerHistorialVitalsPorAtencion('200', 20, 40);

    assert.deepEqual(query, [200, 20, 40]);
    assert.equal(result[0].NombreEmpleado, 'ENFERMERA DE PRUEBA');
});

test('obtenerHistorialVitalsPorAtencion rejects an invalid account id', async () => {
    await assert.rejects(notasService.obtenerHistorialVitalsPorAtencion('cuenta-invalida'), {
        code: 'NOTAS_INVALID_INPUT',
    });
});
