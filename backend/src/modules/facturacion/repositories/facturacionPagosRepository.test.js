const assert = require('node:assert/strict');
const test = require('node:test');
const repo = require('./facturacionPagosRepository');

function fakeTransaction(idOrdenPago = 98765) {
    const calls = { inputs: [], outputs: [], procedures: [] };
    return {
        calls,
        request() {
            return {
                input(name, type, value) {
                    calls.inputs.push({ name, type, value });
                },
                output(name, type) {
                    calls.outputs.push({ name, type });
                },
                async execute(procedure) {
                    calls.procedures.push(procedure);
                    return {
                        rowsAffected: [1],
                        output: { idOrdenPago },
                    };
                },
            };
        },
    };
}

function ordenPagoValida(overrides = {}) {
    return {
        idComprobantePago: null,
        idOrden: 1336130,
        idUsuario: 5208,
        idEstadoFacturacion: 1,
        importeExonerado: 0,
        idUsuarioExonera: null,
        idUsuarioAuditoria: 5208,
        ...overrides,
    };
}

function servicioPagoValido(overrides = {}) {
    return {
        idOrdenPago: 98765,
        idProducto: 51650,
        cantidad: 1,
        precio: 5.85,
        idUsuarioAuditoria: 5208,
        ...overrides,
    };
}

test('agregarOrdenServicioPago ejecuta el SP oficial y devuelve idOrdenPago', async () => {
    const transaction = fakeTransaction(98765);

    const idOrdenPago = await repo.agregarOrdenServicioPago(ordenPagoValida(), transaction);

    assert.equal(idOrdenPago, 98765);
    assert.deepEqual(transaction.calls.procedures, ['dbo.FactOrdenServicioPagosAgregar']);
    assert.ok(transaction.calls.outputs.some((o) => o.name === 'idOrdenPago'));
    assert.equal(transaction.calls.inputs.find((i) => i.name === 'idOrden').value, 1336130);
    assert.equal(transaction.calls.inputs.find((i) => i.name === 'IdEstadoFacturacion').value, 1);
    assert.equal(transaction.calls.inputs.find((i) => i.name === 'ImporteExonerado').value, 0);
    assert.equal(transaction.calls.inputs.find((i) => i.name === 'idComprobantePago').value, null);
});

test('agregarServicioPago ejecuta el SP oficial con el detalle del CPT', async () => {
    const transaction = fakeTransaction();

    await repo.agregarServicioPago(servicioPagoValido(), transaction);

    const { inputs, procedures } = transaction.calls;
    assert.deepEqual(procedures, ['dbo.FacturacionServicioPagosAgregar']);
    assert.equal(inputs.find((i) => i.name === 'idOrdenPago').value, 98765);
    assert.equal(inputs.find((i) => i.name === 'idProducto').value, 51650);
    assert.equal(inputs.find((i) => i.name === 'Cantidad').value, 1);
    assert.equal(inputs.find((i) => i.name === 'Precio').value, 5.85);
    assert.equal(inputs.find((i) => i.name === 'Total').value, 5.85);
});

test('agregarServicioPago calcula el total cuando no viene explícito', async () => {
    const transaction = fakeTransaction();

    await repo.agregarServicioPago(servicioPagoValido({ cantidad: 2, precio: 7.5 }), transaction);

    assert.equal(transaction.calls.inputs.find((i) => i.name === 'Total').value, 15);
});

test('rechaza pagos sin orden o sin usuario', async () => {
    for (const campo of ['idOrden', 'idUsuario', 'idUsuarioAuditoria']) {
        const transaction = fakeTransaction();
        await assert.rejects(
            repo.agregarOrdenServicioPago(ordenPagoValida({ [campo]: null }), transaction),
            { code: 'FACTURACION_INVALID_INPUT' },
        );
        assert.deepEqual(transaction.calls.procedures, []);
    }

    for (const campo of ['idOrdenPago', 'idProducto', 'idUsuarioAuditoria']) {
        const transaction = fakeTransaction();
        await assert.rejects(
            repo.agregarServicioPago(servicioPagoValido({ [campo]: null }), transaction),
            { code: 'FACTURACION_INVALID_INPUT' },
        );
        assert.deepEqual(transaction.calls.procedures, []);
    }
});
