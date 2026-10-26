// Tests de la validacion de credenciales (login).
// No tocan la base de datos: se reemplaza dbHelper.query por un doble de prueba.
// Se usa bcrypt real para probar de verdad la comparacion de contrasenas.
process.env.DOTENV_CONFIG_QUIET = 'true';

const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');

const dbHelper = require('../dbHelper');

// dbHelper.query se reemplaza por un envoltorio que lee 'queryActual' en cada
// llamada. login.js captura ESTE envoltorio al requerirse, asi que cambiar
// queryActual entre tests funciona sin recargar el modulo.
let queryActual = async () => ({ recordset: [] });
dbHelper.query = (...args) => queryActual(...args);

const validarEmpleado = require('../login');

// Hash bcrypt real de la contrasena "clave-correcta" (coste bajo: rapido).
const HASH = bcrypt.hashSync('clave-correcta', 4);

function empleadoFalso(extra = {}) {
    return {
        IdEmpleado: 1,
        Usuario: 'ana',
        Password: HASH,
        Empledo: 'ANA TORRES',
        ...extra,
    };
}

test('devuelve el empleado cuando el usuario y la clave son correctos', async (t) => {
    t.mock.method(console, 'error', () => {});
    let paramsRecibidos = null;
    queryActual = async (texto, params) => {
        paramsRecibidos = params;
        return { recordset: [empleadoFalso()] };
    };

    const empleado = await validarEmpleado('ana', 'clave-correcta');

    assert.ok(empleado, 'debe encontrar al empleado');
    assert.equal(empleado.Usuario, 'ana');
    assert.equal(paramsRecibidos[0].value, 'ana', 'pasa el usuario como parametro');
});

test('devuelve null cuando la clave es incorrecta', async (t) => {
    t.mock.method(console, 'error', () => {});
    queryActual = async () => ({ recordset: [empleadoFalso()] });

    const empleado = await validarEmpleado('ana', 'clave-mala');

    assert.equal(empleado, null);
});

test('devuelve null cuando el usuario no existe', async (t) => {
    t.mock.method(console, 'error', () => {});
    queryActual = async () => ({ recordset: [] });

    const empleado = await validarEmpleado('nadie', 'loquesea');

    assert.equal(empleado, null);
});

test('propaga el error si la consulta falla', async (t) => {
    t.mock.method(console, 'error', () => {});
    queryActual = async () => {
        throw new Error('sin conexion');
    };

    await assert.rejects(() => validarEmpleado('ana', 'clave-correcta'), /sin conexion/);
});
