const sql = require('mssql');
const { executeProcedure } = require('../../../../dbHelper');

const SP_CONSULTAR_PTOS = 'dbo.FacturacionCuentasAtencionPtosXIdCuenta';
const SP_ACTUALIZAR_PTOS = 'dbo.FacturacionCuentasAtencionPtosActualizar';
const SP_ACTUALIZA_IMPORTES = 'dbo.FacturacionCuentasAtencionActualizaImportes';
const SP_COMPROBANTES_PAGO = 'dbo.FacturacionCajaComprobantesPagoConsultarXIdCuentaAtencion';

const INVALID_INPUT = 'FACTURACION_INVALID_INPUT';

function createRepositoryError(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
}

function enteroRequerido(value, fieldName) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 2147483647) {
        throw createRepositoryError(
            INVALID_INPUT,
            `${fieldName} debe ser un número entero válido.`,
        );
    }
    return parsed;
}

function monto(value, fieldName = 'Monto') {
    const parsed = Number(value ?? 0);
    if (!Number.isFinite(parsed) || parsed < 0) {
        throw createRepositoryError(INVALID_INPUT, `${fieldName} debe ser un monto no negativo.`);
    }
    return parsed;
}

/**
 * Consulta los consumos y pagos por punto de carga de una cuenta de atención.
 * SP: dbo.FacturacionCuentasAtencionPtosXIdCuenta
 */
async function consultarCuentasAtencionPtos(idCuenta) {
    const validId = enteroRequerido(idCuenta, 'idCuenta');
    const params = [
        { name: 'idCuenta', type: sql.Int, value: validId },
    ];
    const result = await executeProcedure(SP_CONSULTAR_PTOS, params);
    return result.recordset || [];
}

/**
 * Inserta o actualiza el acumulado de consumos/pagos por punto de carga en la cuenta.
 * SP: dbo.FacturacionCuentasAtencionPtosActualizar
 */
async function actualizarCuentasAtencionPtos(datos = {}, transaction = null) {
    const lbNueva = Boolean(datos.esNueva ?? datos.lbNueva);
    const idCuentaAtencion = enteroRequerido(datos.idCuentaAtencion, 'IdCuentaAtencion');
    const idPuntoCarga = enteroRequerido(datos.idPuntoCarga, 'idPuntoCarga');
    const totalConsumos = monto(datos.totalConsumos, 'TotalConsumos');
    const totalPagos = monto(datos.totalPagos, 'TotalPagos');
    const totalPagosReembolso = monto(datos.totalPagosReembolso, 'TotalPagosReembolso');

    if (transaction) {
        const request = transaction.request();
        request.input('lbNueva', sql.Bit, lbNueva);
        request.input('IdCuentaAtencion', sql.Int, idCuentaAtencion);
        request.input('idPuntoCarga', sql.Int, idPuntoCarga);
        request.input('TotalConsumos', sql.Money, totalConsumos);
        request.input('TotalPagos', sql.Money, totalPagos);
        request.input('TotalPagosReembolso', sql.Money, totalPagosReembolso);
        return request.execute(SP_ACTUALIZAR_PTOS);
    }

    const params = [
        { name: 'lbNueva', type: sql.Bit, value: lbNueva },
        { name: 'IdCuentaAtencion', type: sql.Int, value: idCuentaAtencion },
        { name: 'idPuntoCarga', type: sql.Int, value: idPuntoCarga },
        { name: 'TotalConsumos', type: sql.Money, value: totalConsumos },
        { name: 'TotalPagos', type: sql.Money, value: totalPagos },
        { name: 'TotalPagosReembolso', type: sql.Money, value: totalPagosReembolso },
    ];
    return executeProcedure(SP_ACTUALIZAR_PTOS, params);
}

/**
 * Actualiza los importes globales de la cabecera de la cuenta de atención.
 * SP: dbo.FacturacionCuentasAtencionActualizaImportes
 */
async function actualizarImportesCuenta(datos = {}, transaction = null) {
    const idCuentaAtencion = enteroRequerido(datos.idCuentaAtencion, 'IdCuentaAtencion');
    const totalExonerado = monto(datos.totalExonerado, 'TotalExonerado');
    const totalAsegurado = monto(datos.totalAsegurado, 'TotalAsegurado');
    const totalPagado = monto(datos.totalPagado, 'TotalPagado');
    const totalPorPagar = monto(datos.totalPorPagar, 'totalPorPagar');

    if (transaction) {
        const request = transaction.request();
        request.input('IdCuentaAtencion', sql.Int, idCuentaAtencion);
        request.input('TotalExonerado', sql.Money, totalExonerado);
        request.input('TotalAsegurado', sql.Money, totalAsegurado);
        request.input('TotalPagado', sql.Money, totalPagado);
        request.input('totalPorPagar', sql.Money, totalPorPagar);
        return request.execute(SP_ACTUALIZA_IMPORTES);
    }

    const params = [
        { name: 'IdCuentaAtencion', type: sql.Int, value: idCuentaAtencion },
        { name: 'TotalExonerado', type: sql.Money, value: totalExonerado },
        { name: 'TotalAsegurado', type: sql.Money, value: totalAsegurado },
        { name: 'TotalPagado', type: sql.Money, value: totalPagado },
        { name: 'totalPorPagar', type: sql.Money, value: totalPorPagar },
    ];
    return executeProcedure(SP_ACTUALIZA_IMPORTES, params);
}

/**
 * Consulta comprobantes de pago emitidos para la cuenta.
 * SP: dbo.FacturacionCajaComprobantesPagoConsultarXIdCuentaAtencion
 */
async function consultarComprobantesPagoPorCuenta(idCuenta) {
    const validId = enteroRequerido(idCuenta, 'idCuenta');
    const params = [
        { name: 'IdCuentaAtencion', type: sql.Int, value: validId },
    ];
    const result = await executeProcedure(SP_COMPROBANTES_PAGO, params);
    return result.recordset || [];
}

module.exports = {
    consultarCuentasAtencionPtos,
    actualizarCuentasAtencionPtos,
    actualizarImportesCuenta,
    consultarComprobantesPagoPorCuenta,
    INVALID_INPUT,
};
