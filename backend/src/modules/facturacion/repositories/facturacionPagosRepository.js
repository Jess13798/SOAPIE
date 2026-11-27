const sql = require('mssql');
const { executeProcedure, getPool } = require('../../../../dbHelper');

const SP_ORDEN_PAGO_AGREGAR = 'dbo.FactOrdenServicioPagosAgregar';
const SP_SERVICIO_PAGO_AGREGAR = 'dbo.FacturacionServicioPagosAgregar';
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

function enteroOpcional(value, fieldName) {
    if (value === undefined || value === null || value === '') return null;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 2147483647) {
        throw createRepositoryError(
            INVALID_INPUT,
            `${fieldName} debe ser un número entero válido o nulo.`,
        );
    }
    return parsed;
}

function monto(value, fieldName) {
    const parsed = Number(value ?? 0);
    if (!Number.isFinite(parsed) || parsed < 0) {
        throw createRepositoryError(INVALID_INPUT, `${fieldName} debe ser un monto no negativo.`);
    }
    return parsed;
}

function normalizarOrdenPago(datos = {}) {
    return {
        idComprobantePago: enteroOpcional(datos.idComprobantePago, 'idComprobantePago'),
        idOrden: enteroRequerido(datos.idOrden, 'idOrden'),
        fechaCreacion: datos.fechaCreacion || new Date(),
        idUsuario: enteroRequerido(datos.idUsuario, 'IdUsuario'),
        idEstadoFacturacion: enteroRequerido(datos.idEstadoFacturacion ?? 1, 'IdEstadoFacturacion'),
        importeExonerado: monto(datos.importeExonerado ?? 0, 'ImporteExonerado'),
        idUsuarioExonera: enteroOpcional(datos.idUsuarioExonera, 'idUsuarioExonera'),
        idUsuarioAuditoria: enteroRequerido(datos.idUsuarioAuditoria, 'IdUsuarioAuditoria'),
    };
}

function normalizarServicioPago(datos = {}) {
    const cantidad = enteroRequerido(datos.cantidad ?? 1, 'Cantidad');
    const precio = monto(datos.precio, 'Precio');
    const total = datos.total === undefined || datos.total === null
        ? precio * cantidad
        : monto(datos.total, 'Total');

    return {
        idOrdenPago: enteroRequerido(datos.idOrdenPago, 'idOrdenPago'),
        idProducto: enteroRequerido(datos.idProducto, 'IdProducto'),
        cantidad,
        precio,
        total,
        idUsuarioAuditoria: enteroRequerido(datos.idUsuarioAuditoria, 'IdUsuarioAuditoria'),
    };
}

function bindOrdenPago(request, datos) {
    request.input('idComprobantePago', sql.Int, datos.idComprobantePago);
    request.input('idOrden', sql.Int, datos.idOrden);
    request.input('FechaCreacion', sql.DateTime, datos.fechaCreacion);
    request.input('IdUsuario', sql.Int, datos.idUsuario);
    request.input('IdEstadoFacturacion', sql.Int, datos.idEstadoFacturacion);
    request.input('ImporteExonerado', sql.Money, datos.importeExonerado);
    request.input('idUsuarioExonera', sql.Int, datos.idUsuarioExonera);
    request.input('IdUsuarioAuditoria', sql.Int, datos.idUsuarioAuditoria);
}

/**
 * Crea la cabecera de pago de una orden de CPT particular.
 * Utiliza: dbo.FactOrdenServicioPagosAgregar (devuelve idOrdenPago).
 */
async function agregarOrdenServicioPago(datos = {}, transaction = null) {
    const normalizado = normalizarOrdenPago(datos);

    if (transaction) {
        const request = transaction.request();
        request.output('idOrdenPago', sql.Int);
        bindOrdenPago(request, normalizado);
        const result = await request.execute(SP_ORDEN_PAGO_AGREGAR);
        return result.output?.idOrdenPago ?? null;
    }

    const pool = await getPool();
    const request = pool.request();
    request.output('idOrdenPago', sql.Int);
    bindOrdenPago(request, normalizado);
    const result = await request.execute(SP_ORDEN_PAGO_AGREGAR);
    return result.output?.idOrdenPago ?? null;
}

/**
 * Registra el detalle de pago del CPT particular.
 * Utiliza: dbo.FacturacionServicioPagosAgregar
 */
async function agregarServicioPago(datos = {}, transaction = null) {
    const normalizado = normalizarServicioPago(datos);

    if (transaction) {
        const request = transaction.request();
        request.input('idOrdenPago', sql.Int, normalizado.idOrdenPago);
        request.input('idProducto', sql.Int, normalizado.idProducto);
        request.input('Cantidad', sql.Int, normalizado.cantidad);
        request.input('Precio', sql.Money, normalizado.precio);
        request.input('Total', sql.Money, normalizado.total);
        request.input('IdUsuarioAuditoria', sql.Int, normalizado.idUsuarioAuditoria);
        return request.execute(SP_SERVICIO_PAGO_AGREGAR);
    }

    return executeProcedure(SP_SERVICIO_PAGO_AGREGAR, [
        { name: 'idOrdenPago', type: sql.Int, value: normalizado.idOrdenPago },
        { name: 'idProducto', type: sql.Int, value: normalizado.idProducto },
        { name: 'Cantidad', type: sql.Int, value: normalizado.cantidad },
        { name: 'Precio', type: sql.Money, value: normalizado.precio },
        { name: 'Total', type: sql.Money, value: normalizado.total },
        { name: 'IdUsuarioAuditoria', type: sql.Int, value: normalizado.idUsuarioAuditoria },
    ]);
}

module.exports = {
    agregarOrdenServicioPago,
    agregarServicioPago,
    INVALID_INPUT,
};
