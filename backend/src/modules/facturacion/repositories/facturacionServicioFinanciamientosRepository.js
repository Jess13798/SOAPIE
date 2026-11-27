const sql = require('mssql');
const { executeProcedure } = require('../../../../dbHelper');

const PROCEDURE = 'dbo.FacturacionServicioFinanciamientosAgregar';
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

/**
 * Normaliza el financiamiento de un CPT tal como lo registra GalenHos:
 * FacturacionServicioFinanciamientos guarda la parte cubierta por SIS, SOAT,
 * estrategia, convenios, etc. (todo lo que no genera pago directo).
 */
function normalizarFinanciamiento(datos = {}) {
    const cantidadFinanciada = enteroRequerido(
        datos.cantidadFinanciada ?? datos.cantidad ?? 1,
        'CantidadFinanciada',
    );
    const precioFinanciado = monto(
        datos.precioFinanciado ?? datos.precio,
        'PrecioFinanciado',
    );
    const totalFinanciado = datos.totalFinanciado === undefined || datos.totalFinanciado === null
        ? (datos.total === undefined || datos.total === null
            ? precioFinanciado * cantidadFinanciada
            : monto(datos.total, 'TotalFinanciado'))
        : monto(datos.totalFinanciado, 'TotalFinanciado');

    return {
        idOrden: enteroRequerido(datos.idOrden, 'idOrden'),
        idProducto: enteroRequerido(datos.idProducto, 'IdProducto'),
        idTipoFinanciamiento: enteroRequerido(datos.idTipoFinanciamiento, 'IdTipoFinanciamiento'),
        idFuenteFinanciamiento: enteroOpcional(datos.idFuenteFinanciamiento, 'IdFuenteFinanciamiento'),
        cantidadFinanciada,
        precioFinanciado,
        totalFinanciado,
        fechaAutoriza: datos.fechaAutoriza || new Date(),
        idUsuarioAutoriza: enteroRequerido(datos.idUsuarioAutoriza, 'IdUsuarioAutoriza'),
        idUsuarioAuditoria: enteroRequerido(datos.idUsuarioAuditoria, 'IdUsuarioAuditoria'),
    };
}

function bindFinanciamiento(request, datos) {
    request.input('idOrden', sql.Int, datos.idOrden);
    request.input('idProducto', sql.Int, datos.idProducto);
    request.input('IdTipoFinanciamiento', sql.Int, datos.idTipoFinanciamiento);
    request.input('IdFuenteFinanciamiento', sql.Int, datos.idFuenteFinanciamiento);
    request.input('CantidadFinanciada', sql.Int, datos.cantidadFinanciada);
    request.input('PrecioFinanciado', sql.Money, datos.precioFinanciado);
    request.input('TotalFinanciado', sql.Money, datos.totalFinanciado);
    request.input('FechaAutoriza', sql.DateTime, datos.fechaAutoriza);
    request.input('IdUsuarioAutoriza', sql.Int, datos.idUsuarioAutoriza);
    request.input('IdUsuarioAuditoria', sql.Int, datos.idUsuarioAuditoria);
}

/**
 * Registra la parte financiada de un CPT (SIS, SOAT, estrategia, convenio...).
 * Utiliza: dbo.FacturacionServicioFinanciamientosAgregar
 */
async function agregarServicioFinanciamiento(datos = {}, transaction = null) {
    const normalizado = normalizarFinanciamiento(datos);

    if (transaction) {
        const request = transaction.request();
        bindFinanciamiento(request, normalizado);
        return request.execute(PROCEDURE);
    }

    return executeProcedure(PROCEDURE, [
        { name: 'idOrden', type: sql.Int, value: normalizado.idOrden },
        { name: 'idProducto', type: sql.Int, value: normalizado.idProducto },
        { name: 'IdTipoFinanciamiento', type: sql.Int, value: normalizado.idTipoFinanciamiento },
        { name: 'IdFuenteFinanciamiento', type: sql.Int, value: normalizado.idFuenteFinanciamiento },
        { name: 'CantidadFinanciada', type: sql.Int, value: normalizado.cantidadFinanciada },
        { name: 'PrecioFinanciado', type: sql.Money, value: normalizado.precioFinanciado },
        { name: 'TotalFinanciado', type: sql.Money, value: normalizado.totalFinanciado },
        { name: 'FechaAutoriza', type: sql.DateTime, value: normalizado.fechaAutoriza },
        { name: 'IdUsuarioAutoriza', type: sql.Int, value: normalizado.idUsuarioAutoriza },
        { name: 'IdUsuarioAuditoria', type: sql.Int, value: normalizado.idUsuarioAuditoria },
    ]);
}

module.exports = {
    agregarServicioFinanciamiento,
    INVALID_INPUT,
};
