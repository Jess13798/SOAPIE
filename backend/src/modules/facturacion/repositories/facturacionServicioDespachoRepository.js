// Propósito: Acceso a datos del módulo "facturacion".
// Responsable de mantener separadas las reglas de este archivo.

const sql = require('mssql');
const { executeProcedure } = require('../../../../dbHelper');

const PROCEDURE = 'dbo.FacturacionServicioDespachoAgregar';
const PROCEDURE_RC = 'dbo.FacturacionServicioDespachoAgregar_Rc';
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
 * Implementa la operación "enteroOpcional".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


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

/**
 * Implementa la operación "cantidadRequerida".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


function cantidadRequerida(value) {
    const parsed = Number(value ?? 1);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 2147483647) {
        throw createRepositoryError(INVALID_INPUT, 'Cantidad debe ser un entero mayor que cero.');
    }
    return parsed;
}

/**
 * Implementa la operación "monto".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */

function monto(value, fieldName) {
    const parsed = Number(value ?? 0);
    if (!Number.isFinite(parsed) || parsed < 0) {
        throw createRepositoryError(INVALID_INPUT, `${fieldName} debe ser un monto no negativo.`);
    }
    return parsed;
}

/**


 * Implementa la operación "grupoHIS".


 * Mantiene aislada la responsabilidad principal de este archivo.


 */


function grupoHIS(value, fieldName) {
    const parsed = Number(value ?? 0);
    if (!Number.isInteger(parsed) || parsed < 0) {
        throw createRepositoryError(INVALID_INPUT, `${fieldName} debe ser un entero no negativo.`);
    }
    return parsed;
}

/**
 * Normaliza y valida los datos que recibe el procedimiento oficial de SIGH.
 * La variante _Rc no guarda receta ni diagnóstico, por eso solo se validan
 * cuando se usarán.
 */
/**

 * Implementa la operación "normalizarDespacho".

 * Mantiene aislada la responsabilidad principal de este archivo.

 */

function normalizarDespacho(datos = {}, incluirReceta = true) {
    const cantidad = cantidadRequerida(datos.cantidad);
    const precio = monto(datos.precio, 'Precio');
    const total = datos.total === undefined || datos.total === null
        ? precio * cantidad
        : monto(datos.total, 'Total');
    const labConfHIS = String(datos.labConfHIS ?? '').trim();

    if (labConfHIS.length > 3) {
        throw createRepositoryError(INVALID_INPUT, 'labConfHIS no puede superar 3 caracteres.');
    }

    const normalizado = {
        idOrden: enteroRequerido(datos.idOrden, 'idOrden'),
        idProducto: enteroRequerido(datos.idProducto, 'IdProducto'),
        cantidad,
        precio,
        total,
        labConfHIS,
        grupoHIS: grupoHIS(datos.grupoHIS, 'grupoHIS'),
        subGrupoHIS: grupoHIS(datos.subGrupoHIS, 'subGrupoHIS'),
        idUsuarioAuditoria: enteroRequerido(datos.idUsuarioAuditoria, 'IdUsuarioAuditoria'),
    };

    if (incluirReceta) {
        normalizado.idReceta = enteroOpcional(datos.idReceta, 'idReceta');
        normalizado.idDiagnostico = enteroOpcional(datos.idDiagnostico, 'idDiagnostico');
    }

    return normalizado;
}

/**
 * Implementa la operación "bindDespacho".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */

function bindDespacho(request, datos, incluirReceta) {
    request.input('idOrden', sql.Int, datos.idOrden);
    request.input('IdProducto', sql.Int, datos.idProducto);
    request.input('Cantidad', sql.Int, datos.cantidad);
    request.input('Precio', sql.Money, datos.precio);
    request.input('Total', sql.Money, datos.total);
    request.input('labConfHIS', sql.VarChar(3), datos.labConfHIS);
    request.input('grupoHIS', sql.Int, datos.grupoHIS);
    request.input('subGrupoHIS', sql.Int, datos.subGrupoHIS);
    request.input('IdUsuarioAuditoria', sql.Int, datos.idUsuarioAuditoria);

    if (incluirReceta) {
        request.input('idReceta', sql.Int, datos.idReceta);
        request.input('idDiagnostico', sql.Int, datos.idDiagnostico);
    }
}

/**
 * Implementa la operación "ejecutarDespacho".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */

async function ejecutarDespacho(procName, datos, incluirReceta, transaction) {
    const normalizado = normalizarDespacho(datos, incluirReceta);

    // Igual que en auditoría: si el flujo ya abrió una transacción, el
    // despacho se registra dentro de ella para no dejar datos a medias.
    if (transaction) {
        const request = transaction.request();
        bindDespacho(request, normalizado, incluirReceta);
        return request.execute(procName);
    }

    const params = [
        { name: 'idOrden', type: sql.Int, value: normalizado.idOrden },
        { name: 'IdProducto', type: sql.Int, value: normalizado.idProducto },
        { name: 'Cantidad', type: sql.Int, value: normalizado.cantidad },
        { name: 'Precio', type: sql.Money, value: normalizado.precio },
        { name: 'Total', type: sql.Money, value: normalizado.total },
        { name: 'labConfHIS', type: sql.VarChar(3), value: normalizado.labConfHIS },
        { name: 'grupoHIS', type: sql.Int, value: normalizado.grupoHIS },
        { name: 'subGrupoHIS', type: sql.Int, value: normalizado.subGrupoHIS },
        { name: 'IdUsuarioAuditoria', type: sql.Int, value: normalizado.idUsuarioAuditoria },
    ];

    if (incluirReceta) {
        params.push({ name: 'idReceta', type: sql.Int, value: normalizado.idReceta });
        params.push({ name: 'idDiagnostico', type: sql.Int, value: normalizado.idDiagnostico });
    }

    return executeProcedure(procName, params);
}

/**
 * 1. Registrar el CPT/insumo despachado de una orden de servicio.
 * Utiliza: dbo.FacturacionServicioDespachoAgregar
 * Incluye los campos idReceta e idDiagnostico del flujo oficial de GalenHos.
 */
/**
 * Implementa la operación "agregarServicioDespacho".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */

async function agregarServicioDespacho(datos, transaction = null) {
    return ejecutarDespacho(PROCEDURE, datos, true, transaction);
}

/**
 * 2. Variante sin receta ni diagnóstico (módulo de recetas / consumos).
 * Utiliza: dbo.FacturacionServicioDespachoAgregar_Rc
 */
/**

 * Implementa la operación "agregarServicioDespachoRc".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */

async function agregarServicioDespachoRc(datos, transaction = null) {
    return ejecutarDespacho(PROCEDURE_RC, datos, false, transaction);
}

module.exports = {
    agregarServicioDespacho,
    agregarServicioDespachoRc,
    INVALID_INPUT,
};
