// Tests de la capa de rutas (Paso 3: routers por modulo).
// Verifica que cada modulo exponga un router de Express valido. No levanta el
// servidor ni toca la base de datos: solo comprueba el cableado de los modulos.
process.env.DOTENV_CONFIG_QUIET = 'true';

const test = require('node:test');
const assert = require('node:assert/strict');

const routers = {
    auth: require('../src/modules/auth/routes'),
    pacientes: require('../src/modules/pacientes/routes'),
    notas: require('../src/modules/notas/routes'),
    'pacientes-sin-cama': require('../src/modules/pacientes-sin-cama/routes'),
    diagnosticos: require('../src/modules/diagnosticos/routes'),
    medicos: require('../src/modules/medicos/routes'),
};

test('cada modulo expone un router de Express valido', () => {
    for (const [nombre, router] of Object.entries(routers)) {
        assert.equal(typeof router, 'function', `${nombre} debe exportar una funcion`);
        assert.equal(typeof router.use, 'function', `${nombre} debe ser un router de Express`);
    }
});

test('el router de auth expone POST /login', () => {
    const auth = require('../src/modules/auth/routes');
    const tieneLogin = auth.stack.some(
        (capa) => capa.route && capa.route.path === '/login' && capa.route.methods.post
    );
    assert.ok(tieneLogin, 'debe existir POST /login');
});

test('el router de notas expone las rutas de notas y vitales', () => {
    const notas = require('../src/modules/notas/routes');
    const rutas = notas.stack.filter((c) => c.route).map((c) => `${Object.keys(c.route.methods)[0]} ${c.route.path}`);

    assert.ok(rutas.includes('get /notas'));
    assert.ok(rutas.includes('post /notas'));
    assert.ok(rutas.includes('delete /notas/:id'));
    assert.ok(rutas.includes('get /notas/:id/vitals'));
});
