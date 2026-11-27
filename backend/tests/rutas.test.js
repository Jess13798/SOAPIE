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
    catalogos: require('../src/modules/catalogos/routes'),
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
/**
 * Implementa la operación "invocarGet".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */

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

/**
 * Implementa la operación "invocarPost".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


async function invocarPost(router, ruta, body, usuario) {
    const capa = router.stack.find((c) => c.route && c.route.path === ruta && c.route.methods.post);
    assert.ok(capa, `debe existir la ruta POST ${ruta}`);
    const handler = capa.route.stack[0].handle;

    const req = { body, usuario };
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

test('GET /catalogos/servicios requiere un término de búsqueda de al menos 2 caracteres', async () => {
    const respuesta = await invocarGet(
        require('../src/modules/catalogos/routes'),
        '/catalogos/servicios',
        { buscar: 'a' },
    );
    assert.equal(respuesta.status, 400);
    assert.equal(respuesta.body.success, false);
});

test('GET /catalogos/servicios devuelve el catálogo filtrado', async (t) => {
    const catalogosModule = require('../src/modules/catalogos');
    const buscarServicios = t.mock.method(
        catalogosModule,
        'buscarServicios',
        async () => [{ id: 12, codigo: '00100', nombre: 'Servicio de prueba' }],
    );
    const respuesta = await invocarGet(
        require('../src/modules/catalogos/routes'),
        '/catalogos/servicios',
        { buscar: '001' },
    );

    assert.equal(respuesta.status, 200);
    assert.equal(respuesta.body[0].codigo, '00100');
    assert.deepEqual(buscarServicios.mock.calls[0].arguments, ['001']);
});

test('POST /notas responde 400 para errores de validación', async () => {
    const respuesta = await invocarPost(require('../src/modules/notas/routes'), '/notas', {});

    assert.equal(respuesta.status, 400);
    assert.equal(respuesta.body.success, false);
    assert.match(respuesta.body.mensaje, /IdPaciente es obligatorio/i);
});

test('POST /notas informa fallo de registro CPT sin tratarlo como guardado exitoso', async (t) => {
    const notasModule = require('../src/modules/notas');
    t.mock.method(notasModule, 'guardarNota', async () => {
        const error = new Error('No se pudo registrar el CPT en SISGalen.');
        error.code = 'CPT_ORDER_CREATION_FAILED';
        throw error;
    });

    const respuesta = await invocarPost(
        require('../src/modules/notas/routes'),
        '/notas',
        { serviciosPlanificados: [123] },
        { idEmpleado: 300 },
    );

    assert.equal(respuesta.status, 422);
    assert.equal(respuesta.body.success, false);
    assert.match(respuesta.body.mensaje, /SISGalen/i);
});

test('POST /notas informa que no se puede cambiar cantidad de un CPT pagado', async (t) => {
    const notasModule = require('../src/modules/notas');
    t.mock.method(notasModule, 'guardarNota', async () => {
        const error = new Error('No se puede cambiar la cantidad porque la orden ya está pagada.');
        error.code = 'CPT_QUANTITY_LOCKED';
        throw error;
    });

    const respuesta = await invocarPost(
        require('../src/modules/notas/routes'),
        '/notas',
        { serviciosPlanificados: [{ id: 123, cantidad: 2 }] },
        { idEmpleado: 300 },
    );

    assert.equal(respuesta.status, 422);
    assert.equal(respuesta.body.success, false);
    assert.match(respuesta.body.mensaje, /pagada/i);
});

test('POST /notas toma la identidad del token y no la del cuerpo', async (t) => {
    const notasModule = require('../src/modules/notas');
    const guardarNota = t.mock.method(notasModule, 'guardarNota', async () => ({
        success: true,
        id: 81,
    }));

    await invocarPost(
        require('../src/modules/notas/routes'),
        '/notas',
        { idEmpleado: '999' },
        { idEmpleado: 300 },
    );

    assert.deepEqual(guardarNota.mock.calls[0].arguments, [{ idEmpleado: '999' }, 300]);
});

test('POST /notas responde 403 si la nota pertenece a otra enfermera', async (t) => {
    const notasModule = require('../src/modules/notas');
    t.mock.method(notasModule, 'guardarNota', async () => {
        const error = new Error('Solo la enfermera que creó la nota puede editarla o firmarla.');
        error.code = 'NOTA_NO_AUTORIZADA';
        throw error;
    });

    const respuesta = await invocarPost(
        require('../src/modules/notas/routes'),
        '/notas',
        { id: '81', isFirmada: true },
        { idEmpleado: 301 },
    );

    assert.equal(respuesta.status, 403);
    assert.match(respuesta.body.mensaje, /enfermera que creó la nota/i);
});

test('el router de notas expone las rutas de notas y vitales', () => {
    const notas = require('../src/modules/notas/routes');
    const rutas = notas.stack.filter((c) => c.route).map((c) => `${Object.keys(c.route.methods)[0]} ${c.route.path}`);

    assert.ok(rutas.includes('get /notas'));
    assert.ok(rutas.includes('post /notas'));
    assert.ok(rutas.includes('delete /notas/:id'));
    assert.ok(rutas.includes('get /notas/:id/vitals'));
});
