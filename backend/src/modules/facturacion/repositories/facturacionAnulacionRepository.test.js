const test = require('node:test');
const assert = require('node:assert/strict');
const sql = require('mssql');

const repo = require('./facturacionAnulacionRepository');

function createMockTransaction(mockOrden, mockDespacho) {
    const recorded = [];
    return {
        recorded,
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
                    if (procedureName === 'dbo.FactOrdenServicioSeleccionarPorId') {
                        return { recordset: mockOrden ? [mockOrden] : [] };
                    }
                    if (procedureName === 'dbo.FacturacionServicioDespachoFiltraPorIdOrden') {
                        return { recordset: mockDespacho || [] };
                    }
                    return { rowsAffected: [1] };
                },
                async query(sqlText) {
                    return { recordset: [{ TotalConsumos: 25.0 }] };
                },
            };
        },
    };
}

test('anularOrdenServicio ejecuta la secuencia de anulacion oficial de GalenHos', async () => {
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
