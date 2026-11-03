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

test('el router de medicos expone GET /medicos', () => {
    const medicos = require('../src/modules/medicos/routes');
    const tieneMedicos = medicos.stack.some(
        (capa) => capa.route && capa.route.path === '/medicos' && capa.route.methods.get
    );
    assert.ok(tieneMedicos, 'debe existir GET /medicos');
});

// Ejecuta una ruta GET del router sin levantar el servidor: toma la capa que
// coincide con la ruta y le pasa req/res falsos. Devuelve el status y el body.
async function invocarGet(router, ruta, query) {
    const capa = router.stack.find((c) => c.route && c.route.path === ruta);
    assert.ok(capa, `debe existir la ruta GET ${ruta}`);
    const handler = capa.route.stack[0].handle;

    const req = { query };
    let status = 200;
    let body = null;
    const res = {
        status(codigo) { status = codigo; return this; },
        json(datos) { body = datos; return this; },
    };

    await handler(req, res);
    return { status, body };
}

async function invocarPost(router, ruta, body) {
    const capa = router.stack.find((c) => c.route && c.route.path === ruta && c.route.methods.post);
    assert.ok(capa, `debe existir la ruta POST ${ruta}`);
    const handler = capa.route.stack[0].handle;

    const req = { body };
    let status = 200;
    let responseBody = null;
    const res = {
        status(codigo) { status = codigo; return this; },
        json(datos) { responseBody = datos; return this; },
    };

    await handler(req, res);
    return { status, body: responseBody };
}

test('GET /medicos sin especialidadId responde 400', async () => {
    const router = require('../src/modules/medicos/routes');
    const respuesta = await invocarGet(router, '/medicos', {});
    assert.equal(respuesta.status, 400);
    assert.equal(respuesta.body.success, false);
});

test('GET /medicos con especialidadId filtra por esa especialidad', async (t) => {
    const medicosModule = require('../src/modules/medicos');
    const porEspecialidad = t.mock.method(
        medicosModule,
        'obtenerMedicosPorEspecialidad',
        async () => [{ IdMedico: 9, Medico: 'FILTRADO' }]
    );

    const router = require('../src/modules/medicos/routes');
    const respuesta = await invocarGet(router, '/medicos', { especialidadId: '6' });

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body[0].Medico, 'FILTRADO');
    assert.deepEqual(porEspecialidad.mock.calls[0].arguments, ['6']);
});

test('POST /notas responde 400 para errores de validación', async () => {
    const respuesta = await invocarPost(require('../src/modules/notas/routes'), '/notas', {});

    assert.equal(respuesta.status, 400);
    assert.equal(respuesta.body.success, false);
    assert.match(respuesta.body.mensaje, /IdPaciente es obligatorio/i);
});

test('el router de notas expone las rutas de notas y vitales', () => {
    const notas = require('../src/modules/notas/routes');
    const rutas = notas.stack.filter((c) => c.route).map((c) => `${Object.keys(c.route.methods)[0]} ${c.route.path}`);

    assert.ok(rutas.includes('get /notas'));
    assert.ok(rutas.includes('post /notas'));
    assert.ok(rutas.includes('delete /notas/:id'));
    assert.ok(rutas.includes('get /notas/:id/vitals'));
});
