const assert = require('node:assert/strict');
const test = require('node:test');
const repo = require('./facturacionServicioFinanciamientosRepository');

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

function financiamientoValido(overrides = {}) {
    return {
        idOrden: 1336130,
        idProducto: 51650,
        idTipoFinanciamiento: 2,
        idFuenteFinanciamiento: 3,
        cantidadFinanciada: 1,
        precioFinanciado: 5.85,
        idUsuarioAutoriza: 5208,
        idUsuarioAuditoria: 5208,
        ...overrides,
    };
}

test('agregarServicioFinanciamiento ejecuta el SP oficial dentro de la transacción', async () => {
    const transaction = fakeTransaction();

    await repo.agregarServicioFinanciamiento(financiamientoValido(), transaction);

    const { inputs, procedures } = transaction.calls;
    assert.deepEqual(procedures, ['dbo.FacturacionServicioFinanciamientosAgregar']);
    assert.equal(inputs.find((i) => i.name === 'idOrden').value, 1336130);
    assert.equal(inputs.find((i) => i.name === 'idProducto').value, 51650);
    assert.equal(inputs.find((i) => i.name === 'IdTipoFinanciamiento').value, 2);
    assert.equal(inputs.find((i) => i.name === 'IdFuenteFinanciamiento').value, 3);
    assert.equal(inputs.find((i) => i.name === 'CantidadFinanciada').value, 1);
    assert.equal(inputs.find((i) => i.name === 'PrecioFinanciado').value, 5.85);
    // El total financiado se calcula cuando no viene explícito.
    assert.equal(inputs.find((i) => i.name === 'TotalFinanciado').value, 5.85);
    assert.equal(inputs.find((i) => i.name === 'IdUsuarioAutoriza').value, 5208);
});

test('agregarServicioFinanciamiento respeta total y cantidad explícitos', async () => {
    const transaction = fakeTransaction();

    await repo.agregarServicioFinanciamiento(
        financiamientoValido({ cantidadFinanciada: 3, totalFinanciado: 17.55 }),
        transaction,
    );

    assert.equal(transaction.calls.inputs.find((i) => i.name === 'CantidadFinanciada').value, 3);
    assert.equal(transaction.calls.inputs.find((i) => i.name === 'TotalFinanciado').value, 17.55);
});

test('rechaza financiamientos sin orden, producto, tipo o usuarios', async () => {
    for (const campo of ['idOrden', 'idProducto', 'idTipoFinanciamiento', 'idUsuarioAutoriza', 'idUsuarioAuditoria']) {
        const transaction = fakeTransaction();
        await assert.rejects(
            repo.agregarServicioFinanciamiento(financiamientoValido({ [campo]: null }), transaction),
            { code: 'FACTURACION_INVALID_INPUT' },
        );
        assert.deepEqual(transaction.calls.procedures, []);
    }
});

test('rechaza montos negativos y cantidades inválidas', async () => {
    for (const caso of [{ precioFinanciado: -1 }, { cantidadFinanciada: 0 }, { totalFinanciado: -0.01 }]) {
        const transaction = fakeTransaction();
        await assert.rejects(
            repo.agregarServicioFinanciamiento(financiamientoValido(caso), transaction),
            { code: 'FACTURACION_INVALID_INPUT' },
        );
        assert.deepEqual(transaction.calls.procedures, []);
    }
});
