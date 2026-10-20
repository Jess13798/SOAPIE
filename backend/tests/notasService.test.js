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

// Los signos vitales son obligatorios al CREAR una nota (no al editarla), así
// que las notas nuevas de prueba llevan los diez campos y todas las secciones
// SOAPIE que el servicio exige.
function notaSoapieCompleta(extra = {}) {
    return {
        pacienteId: '3',
        fecha: '2026-10-09',
        hora: '08:00',
        subjetivo: 'sin dolor',
        objetivo: 'consciente',
        analisis: 'evolución favorable',
        plan: 'seguir tratamiento',
        intervencion: 'se administra medicación',
        evaluacion: 'estable',
        signosVitales: {
            peso: '70',
            talla: '170',
            pCefalico: '35',
            pAbdominal: '80',
            hemoglucotest: '95',
            presionArterial: '120/80',
            frecuenciaCardiaca: '78',
            frecuenciaRespiratoria: '18',
            temperatura: '36.7',
            saturacionOxigeno: '98',
        },
        ...extra,
    };
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

test('guardarNota crea una nota nueva y persiste los signos vitales', async (t) => {
    silenciarErrores(t);
    const guardarCompleta = t.mock.method(notasRepository, 'guardarNotaCompleta', async () => ({ id: 55, vitalesRegistrados: true }));

    const resultado = await notasService.guardarNota(notaSoapieCompleta());

    assert.equal(resultado.success, true);
    assert.equal(resultado.id, 55, 'devuelve el id generado por la BD');
    assert.equal(resultado.vitalesRegistrados, true);
    assert.equal(guardarCompleta.mock.callCount(), 1);

    const payload = guardarCompleta.mock.calls[0].arguments[0];
    assert.equal(payload.idNota, null, 'sin id se trata como nota nueva');
    assert.equal(payload.subjetivo, 'sin dolor');
    assert.equal(payload.signosVitales.peso, 70, 'convierte los vitales a número');
});

test('guardarNota pone la hora de inicio en el SERVIDOR, no en los datos del cliente', async (t) => {
    silenciarErrores(t);
    // El servidor vive a las 10:30 aunque el cliente mande las 08:00.
    t.mock.timers.enable({ apis: ['Date'], now: new Date(2026, 9, 19, 10, 30, 0) });
    const guardarCompleta = t.mock.method(notasRepository, 'guardarNotaCompleta', async () => ({ id: 60, vitalesRegistrados: true }));

    await notasService.guardarNota(notaSoapieCompleta());

    const payload = guardarCompleta.mock.calls[0].arguments[0];
    assert.equal(payload.fechaInicio.getHours(), 10, 'usa la hora del servidor');
    assert.equal(payload.fechaInicio.getMinutes(), 30);
});

test('guardarNota deriva el turno de la hora del servidor e ignora el que elige el usuario', async (t) => {
    silenciarErrores(t);
    // Servidor a las 10:00 = turno "dia", aunque el usuario mande "noche".
    t.mock.timers.enable({ apis: ['Date'], now: new Date(2026, 9, 19, 10, 0, 0) });
    const guardarCompleta = t.mock.method(notasRepository, 'guardarNotaCompleta', async () => ({ id: 61, vitalesRegistrados: true }));

    const resultado = await notasService.guardarNota(notaSoapieCompleta({
        hora: '22:00',
        turno: 'noche',
    }));

    const payload = guardarCompleta.mock.calls[0].arguments[0];
    assert.equal(payload.turno, 'dia', 'el turno lo decide el servidor, no el usuario');
    assert.equal(resultado.turno, 'dia', 'la respuesta informa el turno guardado');
});

test('guardarNota conserva el id de una nota existente', async (t) => {
    silenciarErrores(t);
    const guardarCompleta = t.mock.method(notasRepository, 'guardarNotaCompleta', async () => ({ id: 12, vitalesRegistrados: false }));

    const resultado = await notasService.guardarNota(notaSoapieCompleta({
        id: '12',
        hora: '09:00',
    }));

    assert.equal(resultado.success, true);
    assert.equal(resultado.id, 12, 'devuelve el id de la nota editada');
    const payload = guardarCompleta.mock.calls[0].arguments[0];
    assert.equal(payload.idNota, 12, 'conserva el id de la nota editada');
});

test('guardarNota sella la firma con la hora del servidor', async (t) => {
    silenciarErrores(t);
    const guardarCompleta = t.mock.method(notasRepository, 'guardarNotaCompleta', async () => ({ id: 42, vitalesRegistrados: false }));

    const antes = Date.now();
    await notasService.guardarNota(notaSoapieCompleta({
        id: '42',
        hora: '10:00',
        isFirmada: true,
        fechaFirmada: '2026-10-09',
        horaFirmada: '10:30',
    }));
    const despues = Date.now();

    const payload = guardarCompleta.mock.calls[0].arguments[0];
    assert.ok(
        payload.fechaFin.getTime() >= antes && payload.fechaFin.getTime() <= despues,
        'fechaFin usa la hora del servidor y no la que manda el cliente'
    );
});

test('eliminarNota delega en el repositorio', async (t) => {
    silenciarErrores(t);
    const del = t.mock.method(notasRepository, 'deleteNotaById', async () => {});

    const resultado = await notasService.eliminarNota('12');

    assert.deepEqual(resultado, { success: true });
    assert.equal(del.mock.callCount(), 1);
    assert.equal(del.mock.calls[0].arguments[0], 12, 'normaliza el id a número');
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
