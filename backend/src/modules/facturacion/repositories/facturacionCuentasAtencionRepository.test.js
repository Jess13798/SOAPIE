const test = require('node:test');
const assert = require('node:assert/strict');
const sql = require('mssql');

const repo = require('./facturacionCuentasAtencionRepository');

function createMockTransaction(queryResult = null) {
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
                    recorded.push({ procedureName, inputs });
                    return { rowsAffected: [1] };
                },
                async query(sqlText) {
                    recorded.push({ sqlText, inputs });
                    return { recordset: queryResult ? [queryResult] : [] };
                },
            };
        },
    };
}

test('actualizarCuentasAtencionPtos ejecuta el SP oficial dentro de la transacción', async () => {
    const tx = createMockTransaction();
    await repo.actualizarCuentasAtencionPtos({
        esNueva: true,
        idCuentaAtencion: 620981,
        idPuntoCarga: 21,
        totalConsumos: 16.57,
        totalPagos: 0,
        totalPagosReembolso: 0,
    }, tx);

    assert.equal(tx.recorded.length, 1);
    const call = tx.recorded[0];
    assert.equal(call.procedureName, 'dbo.FacturacionCuentasAtencionPtosActualizar');
    assert.equal(call.inputs.lbNueva.value, true);
    assert.equal(call.inputs.IdCuentaAtencion.value, 620981);
    assert.equal(call.inputs.idPuntoCarga.value, 21);
    assert.equal(call.inputs.TotalConsumos.value, 16.57);
});

test('actualizarImportesCuenta ejecuta el SP oficial dentro de la transacción', async () => {
    const tx = createMockTransaction();
    await repo.actualizarImportesCuenta({
        idCuentaAtencion: 620981,
        totalExonerado: 0,
        totalAsegurado: 116.20,
        totalPagado: 0,
        totalPorPagar: 116.20,
    }, tx);

    assert.equal(tx.recorded.length, 1);
    const call = tx.recorded[0];
    assert.equal(call.procedureName, 'dbo.FacturacionCuentasAtencionActualizaImportes');
    assert.equal(call.inputs.IdCuentaAtencion.value, 620981);
    assert.equal(call.inputs.TotalAsegurado.value, 116.20);
    assert.equal(call.inputs.totalPorPagar.value, 116.20);
});

test('obtenerFinanciamientoCuenta resuelve tipo, fuente y si genera pago', async () => {
    const tx = createMockTransaction({
        idFuenteFinanciamiento: 3,
        idTipoFinanciamiento: 2,
        generaPago: 2,
    });

    const resultado = await repo.obtenerFinanciamientoCuenta(626258, tx);

    assert.deepEqual(resultado, {
        idFuenteFinanciamiento: 3,
        idTipoFinanciamiento: 2,
        generaPago: 2,
    });
    const consulta = tx.recorded.find(r => r.sqlText);
    assert.match(consulta.sqlText, /FuentesFinanciamiento/);
    assert.equal(consulta.inputs.idCuentaFinanciamiento.value, 626258);
});

test('rechaza parámetros inválidos para cuentas y puntos de carga', async () => {
    await assert.rejects(
        () => repo.actualizarCuentasAtencionPtos({ idCuentaAtencion: 'invalido' }),
        err => err.code === repo.INVALID_INPUT,
    );
    await assert.rejects(
        () => repo.actualizarImportesCuenta({ idCuentaAtencion: 620981, totalAsegurado: -10 }),
        err => err.code === repo.INVALID_INPUT,
    );
});
