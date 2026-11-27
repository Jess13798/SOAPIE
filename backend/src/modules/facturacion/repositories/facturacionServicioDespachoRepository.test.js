// Propósito: Acceso a datos del módulo "facturacion".
// Responsable de mantener separadas las reglas de este archivo.

const assert = require('node:assert/strict');
const test = require('node:test');
const facturacionRepository = require('./facturacionServicioDespachoRepository');

// Transacción falsa: registra los parámetros enlazados y el SP ejecutado,
// sin abrir conexión a SQL Server.
/**
 * Implementa la operación "fakeTransaction".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */

function fakeTransaction() {
    const calls = { inputs: [], procedures: [] };
    return {
        calls,
        request() {
            return {
                input(name, type, value) {
                    calls.inputs.push({ name, type, value });
                },
                async execute(procedure) {
                    calls.procedures.push(procedure);
                    return { rowsAffected: [1], recordset: [] };
                },
            };
        },
    };
}

/**
 * Implementa la operación "despachoValido"
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


function despachoValido(overrides = {}) {
    return {
        idOrden: 1336130,
        idProducto: 51650,
        cantidad: 1,
        precio: 5.85,
        idUsuarioAuditoria: 5208,
        idReceta: null,
        idDiagnostico: 9056,
        ...overrides,
    };
}

test('agregarServicioDespacho ejecuta el SP oficial dentro de la transacción', async () => {
    const transaction = fakeTransaction();

    await facturacionRepository.agregarServicioDespacho(despachoValido(), transaction);

    const { inputs, procedures } = transaction.calls;
    assert.deepEqual(procedures, ['dbo.FacturacionServicioDespachoAgregar']);
    assert.equal(inputs.find((i) => i.name === 'idOrden').value, 1336130);
    assert.equal(inputs.find((i) => i.name === 'IdProducto').value, 51650);
    assert.equal(inputs.find((i) => i.name === 'Cantidad').value, 1);
    assert.equal(inputs.find((i) => i.name === 'Precio').value, 5.85);
    // El total se calcula cuando no viene explícito.
    assert.equal(inputs.find((i) => i.name === 'Total').value, 5.85);
    assert.equal(inputs.find((i) => i.name === 'labConfHIS').value, '');
    assert.equal(inputs.find((i) => i.name === 'grupoHIS').value, 0);
    assert.equal(inputs.find((i) => i.name === 'subGrupoHIS').value, 0);
    assert.equal(inputs.find((i) => i.name === 'idReceta').value, null);
    assert.equal(inputs.find((i) => i.name === 'idDiagnostico').value, 9056);
});

test('agregarServicioDespacho respeta Total explícito y cantidad', async () => {
    const transaction = fakeTransaction();

    await facturacionRepository.agregarServicioDespacho(
        despachoValido({ cantidad: 3, total: 17.55 }),
        transaction,
    );

    assert.equal(transaction.calls.inputs.find((i) => i.name === 'Total').value, 17.55);
    assert.equal(transaction.calls.inputs.find((i) => i.name === 'Cantidad').value, 3);
});

test('agregarServicioDespachoRc usa la variante sin receta ni diagnóstico', async () => {
    const transaction = fakeTransaction();

    await facturacionRepository.agregarServicioDespachoRc(despachoValido(), transaction);

    const { inputs, procedures } = transaction.calls;
    assert.deepEqual(procedures, ['dbo.FacturacionServicioDespachoAgregar_Rc']);
    assert.equal(inputs.some((i) => i.name === 'idReceta'), false);
    assert.equal(inputs.some((i) => i.name === 'idDiagnostico'), false);
});

test('rechaza despachos sin orden, producto o usuario de auditoría', async () => {
    for (const campo of ['idOrden', 'idProducto', 'idUsuarioAuditoria']) {
        const transaction = fakeTransaction();
        await assert.rejects(
            facturacionRepository.agregarServicioDespacho(despachoValido({ [campo]: null }), transaction),
            { code: 'FACTURACION_INVALID_INPUT' },
        );
        assert.deepEqual(transaction.calls.procedures, []);
    }
});

test('rechaza montos negativos, cantidades inválidas y labConfHIS largo', async () => {
    const casos = [
        { precio: -1 },
        { cantidad: 0 },
        { total: -0.01 },
        { labConfHIS: 'ABCD' },
    ];

    for (const caso of casos) {
        const transaction = fakeTransaction();
        await assert.rejects(
            facturacionRepository.agregarServicioDespacho(despachoValido(caso), transaction),
            { code: 'FACTURACION_INVALID_INPUT' },
        );
        assert.deepEqual(transaction.calls.procedures, []);
    }
});
