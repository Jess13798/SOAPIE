// Prueba: ¿el sistema puede saber el turno del personal que inició sesión?
//
// El turno NO viene de los datos del empleado (la tabla Empleados no tiene
// columna de turno). Se deriva de la hora del servidor: Día 07:00-18:59,
// Noche 19:00-06:59, y se entrega en la respuesta y el token de POST /login.
//
// No toca la base de datos: se reemplaza `login` por un doble de prueba.
process.env.AUTH_SECRET = 'secreto-solo-para-tests';
process.env.DOTENV_CONFIG_QUIET = 'true';

const test = require('node:test');
const assert = require('node:assert/strict');

const { turnoDesdeHora } = require('../src/core/utils/turno');

// ---------------------------------------------------------------------------
// 1. Función pura: turnoDesdeHora(fecha)
// ---------------------------------------------------------------------------
// Se construyen fechas en hora LOCAL (mismo reloj que usa getHours()).
function aLas(hora, minuto = 0) {
    return new Date(2026, 9, 19, hora, minuto); // 19-oct-2026
}

test('turnoDesdeHora: la mañana, la tarde y el comienzo del día son "dia"', () => {
    assert.equal(turnoDesdeHora(aLas(7, 0)), 'dia', 'a las 07:00 ya es día');
    assert.equal(turnoDesdeHora(aLas(12, 30)), 'dia');
    assert.equal(turnoDesdeHora(aLas(18, 59)), 'dia', 'a las 18:59 todavía es día');
});

test('turnoDesdeHora: la noche y la madrugada son "noche"', () => {
    assert.equal(turnoDesdeHora(aLas(19, 0)), 'noche', 'a las 19:00 ya es noche');
    assert.equal(turnoDesdeHora(aLas(23, 59)), 'noche');
    assert.equal(turnoDesdeHora(aLas(0, 0)), 'noche');
    assert.equal(turnoDesdeHora(aLas(6, 59)), 'noche', 'a las 06:59 todavía es noche');
});

test('turnoDesdeHora: usa la hora actual cuando no se pasa fecha', () => {
    const turno = turnoDesdeHora();
    assert.ok(turno === 'dia' || turno === 'noche');
});

test('turnoDesdeHora: ante una fecha inválida cae a "dia" sin romper', () => {
    assert.equal(turnoDesdeHora(new Date('no-es-fecha')), 'dia');
});

// ---------------------------------------------------------------------------
// 2. Integración: POST /api/login devuelve el turno (y lo firma en el token)
// ---------------------------------------------------------------------------
// `authRoutes` captura la función de login al requerirse, así que se inyecta
// un doble en la caché de require ANTES de cargar el router.
const loginPath = require.resolve('../login');
let empleadoActual = { IdEmpleado: 1, Usuario: 'ana', Empledo: 'ANA TORRES' };
require.cache[loginPath] = {
    id: loginPath,
    filename: loginPath,
    loaded: true,
    exports: async () => empleadoActual,
};

const { verificarToken } = require('../auth');
const authRoutes = require('../src/modules/auth/routes');

const capaLogin = authRoutes.stack.find(
    (capa) => capa.route && capa.route.path === '/login'
);
const loginHandler = capaLogin.route.stack[0].handle;

function respuestaFalsa() {
    return {
        codigo: 200,
        cuerpo: null,
        status(codigo) {
            this.codigo = codigo;
            return this;
        },
        json(cuerpo) {
            this.cuerpo = cuerpo;
            return this;
        },
    };
}

test('POST /login incluye el turno derivado por hora y lo firma en el token', async (t) => {
    t.mock.method(console, 'error', () => {});
    empleadoActual = { IdEmpleado: 1, Usuario: 'ana', Empledo: 'ANA TORRES' };

    const req = { body: { usuario: 'ana', Password: 'clave' } };
    const res = respuestaFalsa();

    await loginHandler(req, res);

    assert.equal(res.cuerpo.success, true, 'el login fue exitoso');
    assert.ok(
        res.cuerpo.turno === 'dia' || res.cuerpo.turno === 'noche',
        'la respuesta trae un turno válido'
    );
    assert.equal(
        res.cuerpo.turno,
        turnoDesdeHora(new Date()),
        'el turno responde a la hora del servidor'
    );

    const datos = verificarToken(res.cuerpo.token);
    assert.ok(datos, 'el token es verificable');
    assert.equal(datos.turno, res.cuerpo.turno, 'el turno viaja firmado en el token');
    assert.equal(datos.idEmpleado, 1);
});

test('POST /login no expone turno cuando las credenciales son inválidas', async (t) => {
    t.mock.method(console, 'error', () => {});
    empleadoActual = null;

    const req = { body: { usuario: 'nadie', Password: 'mala' } };
    const res = respuestaFalsa();

    await loginHandler(req, res);

    assert.equal(res.codigo, 401);
    assert.equal(res.cuerpo.success, false);
    assert.equal(res.cuerpo.turno, undefined, 'sin sesión no hay turno');
});
