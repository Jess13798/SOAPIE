// Tests del servicio de pacientes sin cama.
// No tocan la base de datos: reemplazan el repositorio por dobles de prueba.
process.env.DOTENV_CONFIG_QUIET = 'true';

const test = require('node:test');
const assert = require('node:assert/strict');

const pacientesSinCamaRepository = require('../src/modules/pacientes-sin-cama/repositories/pacientesSinCamaRepository');
const pacientesSinCamaService = require('../src/modules/pacientes-sin-cama/services/pacientesSinCamaService');

function silenciarErrores(t) {
    t.mock.method(console, 'error', () => {});
}

test('obtenerPacientesSinCama delega el filtro por servicio', async (t) => {
    silenciarErrores(t);
    const repo = t.mock.method(pacientesSinCamaRepository, 'getPacientesSinCama', async (servicio) => [
        { IdPaciente: 1, SERVICIOFINAL: servicio },
    ]);

    const datos = await pacientesSinCamaService.obtenerPacientesSinCama('HOSPITALIZACION');

    assert.equal(datos.length, 1);
    assert.equal(datos[0].SERVICIOFINAL, 'HOSPITALIZACION');
    assert.equal(repo.mock.callCount(), 1);
    assert.equal(repo.mock.calls[0].arguments[0], 'HOSPITALIZACION');
});

test('asignarCama pasa el payload completo (incluido el usuario del token) al repositorio', async (t) => {
    silenciarErrores(t);
    const payload = {
        IdPaciente: 10,
        IdCuentaAtencion: 20,
        IdCama: 30,
        IdMedicoOrdena: 40,
        idUsuario: 7,
        usuario: 'jperez',
    };
    const repo = t.mock.method(pacientesSinCamaRepository, 'asignarCama', async () => ({
        success: true,
        mensaje: 'Cama asignada correctamente',
    }));

    const resultado = await pacientesSinCamaService.asignarCama(payload);

    assert.equal(resultado.success, true);
    assert.equal(repo.mock.callCount(), 1);
    assert.deepEqual(repo.mock.calls[0].arguments[0], payload);
});

test('moverPacienteDeCama pasa el payload completo al repositorio', async (t) => {
    silenciarErrores(t);
    const payload = { IdPaciente: 10, IdCama: 31, IdCuentaAtencion: 20, idUsuario: 7, usuario: 'jperez' };
    const repo = t.mock.method(pacientesSinCamaRepository, 'moverPacienteDeCama', async () => ({
        success: true,
        mensaje: 'Cama reasignada correctamente',
    }));

    const resultado = await pacientesSinCamaService.moverPacienteDeCama(payload);

    assert.equal(resultado.success, true);
    assert.deepEqual(repo.mock.calls[0].arguments[0], payload);
});

test('obtenerAuditoriaCamas delega los filtros al repositorio', async (t) => {
    silenciarErrores(t);
    const filtros = { fechaDesde: '2026-10-01', accion: 'ASIGNAR', limit: 50 };
    const repo = t.mock.method(pacientesSinCamaRepository, 'getAuditoriaCamas', async () => ([
        { IdAuditoria: 1, Accion: 'ASIGNAR', Usuario: 'jperez' },
    ]));

    const datos = await pacientesSinCamaService.obtenerAuditoriaCamas(filtros);

    assert.equal(datos.length, 1);
    assert.equal(datos[0].Accion, 'ASIGNAR');
    assert.deepEqual(repo.mock.calls[0].arguments[0], filtros);
});

test('registrarTransferenciaEstancia delega y propaga el resultado', async (t) => {
    silenciarErrores(t);
    const payload = {
        idAtencion: 1,
        idServicio: 2,
        fechaOcupacion: '20261009',
        horaOcupacion: '08:00',
    };
    const repo = t.mock.method(
        pacientesSinCamaRepository,
        'registrarTransferenciaEstancia',
        async () => ({ success: true })
    );

    const resultado = await pacientesSinCamaService.registrarTransferenciaEstancia(payload);

    assert.equal(resultado.success, true);
    assert.deepEqual(repo.mock.calls[0].arguments[0], payload);
});

test('los servicios propagan el error del repositorio', async (t) => {
    silenciarErrores(t);
    t.mock.method(pacientesSinCamaRepository, 'asignarCama', async () => {
        throw new Error('transaccion fallida');
    });

    await assert.rejects(
        () => pacientesSinCamaService.asignarCama({ IdPaciente: 1, IdCuentaAtencion: 2, IdCama: 3 }),
        /transaccion fallida/
    );
});
