const assert = require('node:assert/strict');
const test = require('node:test');
const notasRepository = require('./notasRepository');
const notasService = require('../services/notasService');

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
        return 81;
    });

    const result = await notasService.guardarNota({
        id: 'draft-1',
        pacienteId: '100',
        idCuenta: '200',
        idEmpleado: '300',
        fecha: '2026-10-09',
        hora: '12:00',
        turno: 'noche',
        subjetivo: 'Refiere dolor',
        signosVitales: { temperatura: '36.7', frecuenciaCardiaca: '80' },
        planCuidados: [
            { idNANDA: 1, comentario: '  Dolor referido en hipogastrio  ', nocIds: [10, 10], nicIds: [20] },
            { idNANDA: 1, nocIds: [11], nicIds: [] },
        ],
    });

    assert.equal(result.success, true);
    assert.equal(result.id, 81);
    assert.equal(savedNote.idNota, null);
    assert.equal(savedNote.idPaciente, 100);
    assert.equal(savedNote.idCuenta, 200);
    assert.equal(savedNote.idEmpleado, 300);
    assert.ok(
        savedNote.turno === 'dia' || savedNote.turno === 'noche',
        'el turno se deriva de la hora del servidor, ya no se copia del usuario'
    );
    assert.equal(savedNote.signosVitales.temperatura, 36.7);
    assert.equal(savedNote.signosVitales.frecuenciaCardiaca, 80);
    assert.deepEqual(savedNote.planCuidados, [
        { idNANDA: 1, comentario: 'Dolor referido en hipogastrio', nocIds: [10, 11], nicIds: [20] },
    ]);
});

test('guardarNota rejects comments longer than the database column limit', async () => {
    await assert.rejects(notasService.guardarNota({
        pacienteId: '100',
        fecha: '2026-10-09',
        hora: '12:00',
        planCuidados: [{ idNANDA: 1, comentario: 'x'.repeat(1001) }],
    }), { code: 'NOTAS_INVALID_INPUT' });
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
