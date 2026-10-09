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
            { idNANDA: 1, nocIds: [10, 10], nicIds: [20] },
            { idNANDA: 1, nocIds: [11], nicIds: [] },
        ],
    });

    assert.deepEqual(result, { success: true, id: 81 });
    assert.equal(savedNote.idNota, null);
    assert.equal(savedNote.idPaciente, 100);
    assert.equal(savedNote.idCuenta, 200);
    assert.equal(savedNote.idEmpleado, 300);
    assert.equal(savedNote.turno, 'noche');
    assert.equal(savedNote.signosVitales.temperatura, 36.7);
    assert.equal(savedNote.signosVitales.frecuenciaCardiaca, 80);
    assert.deepEqual(savedNote.planCuidados, [
        { idNANDA: 1, nocIds: [10, 11], nicIds: [20] },
    ]);
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
    assert.deepEqual(nota.planCuidados[0].nocIds, [10]);
    assert.deepEqual(nota.planCuidados[0].nicIds, [20]);
});
