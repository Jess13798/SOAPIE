const test = require('node:test');
const assert = require('node:assert/strict');
const sql = require('mssql');

const repo = require('./facturacionAnulacionRepository');

function createMockTransaction(mockOrden, mockDespacho, failProcedure = null) {
    const recorded = [];
    const queries = [];
    return {
        recorded,
        queries,
        request() {
            const inputs = {};
            return {
                inputs,
                input(name, type, value) {
                    inputs[name] = { type, value };
                    return this;
                },
                async execute(procedureName) {
                    recorded.push({ procedureName, inputs: { ...inputs } });
                    if (procedureName === failProcedure) {
                        throw new Error(`Falla simulada en ${procedureName}`);
                    }
                    if (procedureName === 'dbo.FactOrdenServicioSeleccionarPorId') {
                        return { recordset: mockOrden ? [mockOrden] : [] };
                    }
                    if (procedureName === 'dbo.FacturacionServicioDespachoFiltraPorIdOrden') {
                        return { recordset: mockDespacho || [] };
                    }
                    return { rowsAffected: [1] };
                },
                async query(sqlText) {
                    queries.push({ sqlText, inputs: { ...inputs } });
                    return { recordset: [{ TotalConsumos: 25.0 }] };
                },
            };
        },
    };
}

test('anularOrdenServicio ejecuta la secuencia de anulacion oficial de GalenHos', async () => {
    const mockOrden = {
        IdOrden: 1339568,
        IdPuntoCarga: 1,
        IdPaciente: 300903,
        IdCuentaAtencion: 622640,
        IdServicioPaciente: 216,
        idTipoFinanciamiento: 2,
        idFuenteFinanciamiento: 1,
        FechaCreacion: new Date('2026-11-23T10:00:00Z'),
        IdUsuario: 5208,
        FechaDespacho: new Date('2026-11-23T10:05:00Z'),
        FechaHoraRealizaCpt: new Date('2026-11-23T10:05:00Z'),
    };
    const mockDespacho = [
        { IdProducto: 51650, Total: 5.85 },
    ];

    const tx = createMockTransaction(mockOrden, mockDespacho);
    const resultado = await repo.anularOrdenServicio({
        idOrden: 1339568,
        idEmpleado: 5208,
        observaciones: 'Anulación de prueba CPT',
    }, tx);

    assert.equal(resultado.success, true);
    assert.equal(resultado.idEstadoFacturacion, 9);
    assert.equal(resultado.montoDescontado, 5.85);

    // Verificar que llamó al procedimiento de modificar orden con estado 9
    const modificacion = tx.recorded.find(r => r.procedureName === 'dbo.FactOrdenServicioModificar');
    assert.ok(modificacion);
    assert.equal(modificacion.inputs.IdEstadoFacturacion.value, 9);

    // Verificar que llamó al procedimiento de financiamientos con estado 9
    const financiamiento = tx.recorded.find(r => r.procedureName === 'dbo.FacturacionServicioFinanciamientosActualizaIdEstadoFacturacion');
    assert.ok(financiamiento);
    assert.equal(financiamiento.inputs.lnNuevoIdEstadoFacturacion.value, 9);

    // Verificar que la cabecera de pago también queda anulada
    const pago = tx.queries.find(q => /UPDATE dbo\.FactOrdenServicioPagos/i.test(q.sqlText));
    assert.ok(pago);
    assert.equal(pago.inputs.idOrdenPagos.value, 1339568);

    // El consumo se descuenta del punto de carga real de la orden (1 = Consumo en el Servicio)
    const ptos = tx.queries.find(q => /SELECT TotalConsumos/i.test(q.sqlText));
    assert.ok(ptos);
    assert.equal(ptos.inputs.idPunto.value, 1);
});

test('anularOrdenServicio actualiza TotalConsumos a 0 cuando el saldo restante es 0', async () => {
    const mockOrden = {
        IdOrden: 1339568,
        IdPuntoCarga: 1,
        IdPaciente: 300903,
        IdCuentaAtencion: 622640,
        IdServicioPaciente: 216,
        idTipoFinanciamiento: 2,
        idFuenteFinanciamiento: 1,
        FechaCreacion: new Date('2026-11-23T10:00:00Z'),
        IdUsuario: 5208,
        FechaDespacho: new Date('2026-11-23T10:05:00Z'),
        FechaHoraRealizaCpt: new Date('2026-11-23T10:05:00Z'),
    };
    const mockDespacho = [
        { IdProducto: 51650, Total: 25.00 },
    ];

    const tx = createMockTransaction(mockOrden, mockDespacho);
    await repo.anularOrdenServicio({
        idOrden: 1339568,
        idEmpleado: 5208,
        observaciones: 'Anulación de prueba CPT total',
    }, tx);

    const reset = tx.queries.find(q => /UPDATE dbo\.FacturacionCuentasAtencionPtos\s+SET TotalConsumos = 0\.00/i.test(q.sqlText));
    assert.ok(reset, 'Debe ejecutar UPDATE a 0.00 cuando el saldo queda en 0');
    assert.equal(reset.inputs.idCuentaReset.value, 622640);
    assert.equal(reset.inputs.idPuntoReset.value, 1);
});

test('anularOrdenServicio rechaza órdenes inexistentes o parámetros inválidos', async () => {
    const tx = createMockTransaction(null, []);
    await assert.rejects(
        () => repo.anularOrdenServicio({ idOrden: 999999 }, tx),
        err => err.code === 'ORDEN_NOT_FOUND',
    );
    await assert.rejects(
        () => repo.anularOrdenServicio({ idOrden: 'invalido' }),
        err => err.code === repo.INVALID_INPUT,
    );
});

test('anularOrdenServicio propaga fallos de auditoría y actualización de consumos', async () => {
    const mockOrden = {
        IdOrden: 1339568,
        IdPuntoCarga: 716,
        IdPaciente: 300903,
        IdCuentaAtencion: 622640,
        IdServicioPaciente: 216,
        idTipoFinanciamiento: 2,
        idFuenteFinanciamiento: 1,
        FechaCreacion: new Date('2026-11-23T10:00:00Z'),
        IdUsuario: 5208,
        FechaDespacho: new Date('2026-11-23T10:05:00Z'),
        FechaHoraRealizaCpt: new Date('2026-11-23T10:05:00Z'),
    };
    const mockDespacho = [{ IdProducto: 51650, Total: 5.85 }];

    for (const procedureName of [
        'dbo.AuditoriaAgregarV',
        'dbo.FacturacionCuentasAtencionPtosActualizar',
    ]) {
        const tx = createMockTransaction(mockOrden, mockDespacho, procedureName);
        await assert.rejects(
            () => repo.anularOrdenServicio({ idOrden: 1339568 }, tx),
            error => error.message.includes(`Falla simulada en ${procedureName}`),
        );
    }
});
