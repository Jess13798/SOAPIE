// Tests del servicio de notas.
// No tocan la base de datos: reemplazan el repositorio por dobles de prueba.
process.env.DOTENV_CONFIG_QUIET = 'true';

const test = require('node:test');
const assert = require('node:assert/strict');

// Se requiere primero el repositorio y luego el servicio. Como el servicio
// guarda una referencia al MISMO objeto del repositorio, reemplazar sus métodos
// con t.mock.method afecta al servicio.
const notasRepository = require('../src/modules/notas/repositories/notasRepository');
const notasService = require('../src/modules/notas/services/notasService');

// Silencia los console.error que los servicios emiten en los caminos de error.
function silenciarErrores(t) {
    t.mock.method(console, 'error', () => {});
}

test('obtenerNotas mapea las filas de la BD al formato del frontend', async (t) => {
    t.mock.method(notasRepository, 'getAllNotas', async () => ({
        recordset: [
            {
                IdNotaEnfermeria: 7,
                IdPaciente: 3,
                IdCuenta: 9,
                IdEmpleado: 1,
                Turno: 'noche',
                Enfermera: 'JUAN PEREZ',
                Fecha_Hora_Inicio: new Date('2026-10-08T22:30:00Z'),
                Fecha_Hora_Fin: null,
                Subjetivo: 'dolor',
                Objetivo: 'febril',
                Analisis: 'infeccion',
                Plan_: 'antibiotico',
                Intervencion: 'medicacion',
                Evaluacion: 'estable',
            },
        ],
    }));

    const notas = await notasService.obtenerNotas();

    assert.equal(notas.length, 1);
    const n = notas[0];
    assert.equal(n.id, '7', 'el id viaja como string');
    assert.equal(n.pacienteId, '3');
    assert.equal(n.idCuenta, '9');
    assert.equal(n.turno, 'noche');
    assert.equal(n.enfermera, 'JUAN PEREZ');
    assert.equal(n.subjetivo, 'dolor');
    assert.equal(n.fecha, '2026-10-08');
    assert.equal(n.hora, '22:30');
    assert.equal(n.isFirmada, false, 'sin Fecha_Hora_Fin no esta firmada');
    assert.equal(n.fechaFirmada, '');
    assert.equal(n.horaFirmada, '');
});

test('obtenerNotas marca y da formato a una nota firmada', async (t) => {
    t.mock.method(notasRepository, 'getAllNotas', async () => ({
        recordset: [
            {
                IdNotaEnfermeria: 8,
                Fecha_Hora_Inicio: new Date('2026-10-08T06:00:00Z'),
                Fecha_Hora_Fin: new Date('2026-10-08T14:15:00Z'),
                Turno: 'dia',
            },
        ],
    }));

    const [n] = await notasService.obtenerNotas();

    assert.equal(n.isFirmada, true);
    assert.equal(n.fechaFirmada, '2026-10-08');
    assert.equal(n.horaFirmada, '14:15');
});

test('obtenerNotas devuelve [] si la consulta no trae recordset', async (t) => {
    t.mock.method(notasRepository, 'getAllNotas', async () => ({}));

    const notas = await notasService.obtenerNotas();

    assert.deepEqual(notas, []);
});

test('guardarNota crea una nota nueva e inserta los signos vitales', async (t) => {
    silenciarErrores(t);
    const insertNota = t.mock.method(notasRepository, 'insertNota', async () => 55);
    const insertVitales = t.mock.method(notasRepository, 'insertVitales', async () => {});
    const updateNota = t.mock.method(notasRepository, 'updateNota', async () => {});

    const resultado = await notasService.guardarNota({
        fecha: '2026-10-09',
        hora: '08:00',
        subjetivo: 'sin dolor',
        signosVitales: { peso: '70' },
    });

    assert.equal(resultado.success, true);
    assert.equal(resultado.id, 55, 'devuelve el id generado por la BD');
    assert.equal(insertNota.mock.callCount(), 1);
    assert.equal(insertVitales.mock.callCount(), 1, 'siempre guarda vitales');
    assert.equal(updateNota.mock.callCount(), 0, 'no actualiza una nota nueva');
});

test('guardarNota actualiza una nota existente y NO la vuelve a insertar', async (t) => {
    silenciarErrores(t);
    const insertNota = t.mock.method(notasRepository, 'insertNota', async () => 999);
    const insertVitales = t.mock.method(notasRepository, 'insertVitales', async () => {});
    const updateNota = t.mock.method(notasRepository, 'updateNota', async () => {});

    const resultado = await notasService.guardarNota({
        id: '12',
        fecha: '2026-10-09',
        hora: '09:00',
        subjetivo: 'evoluciona',
    });

    assert.equal(resultado.success, true);
    assert.equal(resultado.id, '12', 'conserva el id de la nota editada');
    assert.equal(insertNota.mock.callCount(), 0);
    assert.equal(updateNota.mock.callCount(), 1);
    assert.equal(insertVitales.mock.callCount(), 1);
});

test('guardarNota firma la nota cuando isFirmada es true', async (t) => {
    silenciarErrores(t);
    t.mock.method(notasRepository, 'insertNota', async () => 42);
    t.mock.method(notasRepository, 'insertVitales', async () => {});
    const updateNota = t.mock.method(notasRepository, 'updateNota', async () => {});

    await notasService.guardarNota({
        id: '42',
        fecha: '2026-10-09',
        hora: '10:00',
        isFirmada: true,
        fechaFirmada: '2026-10-09',
        horaFirmada: '10:30',
    });

    const payload = updateNota.mock.calls[0].arguments[0];
    assert.equal(payload.fechaFin, '2026-10-09 10:30:00');
});

test('eliminarNota delega en el repositorio', async (t) => {
    silenciarErrores(t);
    const del = t.mock.method(notasRepository, 'deleteNotaById', async () => {});

    const resultado = await notasService.eliminarNota('12');

    assert.deepEqual(resultado, { success: true });
    assert.equal(del.mock.callCount(), 1);
    assert.equal(del.mock.calls[0].arguments[0], '12');
});

test('obtenerHistorialVitals devuelve el recordset y tolera vacios', async (t) => {
    silenciarErrores(t);
    t.mock.method(notasRepository, 'getHistorialVitals', async () => ({
        recordset: [{ IdSignoVital: 1 }],
    }));

    const conDatos = await notasService.obtenerHistorialVitals('5', 10, 0);
    assert.equal(conDatos.length, 1);

    t.mock.method(notasRepository, 'getHistorialVitals', async () => ({}));
    const sinDatos = await notasService.obtenerHistorialVitals('5');
    assert.deepEqual(sinDatos, []);
});

test('obtenerNotas propaga el error del repositorio', async (t) => {
    silenciarErrores(t);
    t.mock.method(notasRepository, 'getAllNotas', async () => {
        throw new Error('boom');
    });

    await assert.rejects(() => notasService.obtenerNotas(), /boom/);
});
