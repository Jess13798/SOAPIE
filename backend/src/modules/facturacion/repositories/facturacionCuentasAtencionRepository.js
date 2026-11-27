// Propósito: Acceso a datos del módulo "facturacion".
// Responsable de mantener separadas las reglas de este archivo.

const sql = require('mssql');
const { query, executeProcedure } = require('../../../../dbHelper');

const SP_CONSULTAR_PTOS = 'dbo.FacturacionCuentasAtencionPtosXIdCuenta';
const SP_ACTUALIZAR_PTOS = 'dbo.FacturacionCuentasAtencionPtosActualizar';
const SP_ACTUALIZA_IMPORTES = 'dbo.FacturacionCuentasAtencionActualizaImportes';
const SP_COMPROBANTES_PAGO = 'dbo.FacturacionCajaComprobantesPagoConsultarXIdCuentaAtencion';

const INVALID_INPUT = 'FACTURACION_INVALID_INPUT';

/**
 * Implementa la operación "createRepositoryError".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


function createRepositoryError(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
}

/**
 * Implementa la operación "enteroRequerido".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


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

/**
 * Implementa la operación "monto".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


function monto(value, fieldName = 'Monto') {
    const parsed = Number(value ?? 0);
    if (!Number.isFinite(parsed) || parsed < 0) {
        throw createRepositoryError(INVALID_INPUT, `${fieldName} debe ser un monto no negativo.`);
    }
    return parsed;
}

/**
 * Resuelve el financiamiento real de la cuenta de atención.
 * GalenHos guarda en Atenciones solo la fuente de financiamiento; el tipo de
 * financiamiento se obtiene desde FuentesFinanciamiento. Si la fuente no tiene
 * tipo asociado (por ejemplo Estrategia) se usa 16, igual que GalenHos.
 */
async function obtenerFinanciamientoCuenta(idCuenta, transaction = null) {
    const validId = enteroRequerido(idCuenta, 'idCuenta');
    const consulta = `
        SELECT TOP (1)
            a.idFuenteFinanciamiento AS idFuenteFinanciamiento,
            COALESCE(f.IdTipoFinanciamiento, 16) AS idTipoFinanciamiento,
            COALESCE(t.GeneraPago, 0) AS generaPago
        FROM dbo.Atenciones AS a
        LEFT JOIN dbo.FuentesFinanciamiento AS f
            ON f.IdFuenteFinanciamiento = a.idFuenteFinanciamiento
        LEFT JOIN dbo.TiposFinanciamiento AS t
            ON t.IdTipoFinanciamiento = COALESCE(f.IdTipoFinanciamiento, 16)
        WHERE a.IdCuentaAtencion = @idCuentaFinanciamiento;
    `;

    if (transaction) {
        const request = transaction.request();
        request.input('idCuentaFinanciamiento', sql.Int, validId);
        const result = await request.query(consulta);
        return result.recordset?.[0] || null;
    }

    const result = await query(consulta, [
        { name: 'idCuentaFinanciamiento', type: sql.Int, value: validId },
    ]);
    return result.recordset?.[0] || null;
}

/**
 * Consulta los consumos y pagos por punto de carga de una cuenta de atención.
 * SP: dbo.FacturacionCuentasAtencionPtosXIdCuenta
 */
/**
 * Implementa la operación "consultarCuentasAtencionPtos".
 * Mantiene aislada la responsabilidad principal de este archivo.
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
/**

 * Implementa la operación "actualizarCuentasAtencionPtos".
 * Mantiene aislada la responsabilidad principal de este archivo.
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
/**
 * Implementa la operación "actualizarImportesCuenta".
 * Mantiene aislada la responsabilidad principal de este archivo.
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
/**
 * Implementa la operación "consultarComprobantesPagoPorCuenta".
 * Mantiene aislada la responsabilidad principal de este archivo.
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
    obtenerFinanciamientoCuenta,
    consultarCuentasAtencionPtos,
    actualizarCuentasAtencionPtos,
    actualizarImportesCuenta,
    consultarComprobantesPagoPorCuenta,
    INVALID_INPUT,
};
