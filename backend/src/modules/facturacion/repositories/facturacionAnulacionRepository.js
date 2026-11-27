const sql = require('mssql');
const { executeProcedure } = require('../../../../dbHelper');
const { registrarAuditoria } = require('../../../core/utils/auditoria');

const SP_ORDEN_SELECCIONAR = 'dbo.FactOrdenServicioSeleccionarPorId';
const SP_ORDEN_MODIFICAR = 'dbo.FactOrdenServicioModificar';
const SP_FINANCIAMIENTO_ESTADO = 'dbo.FacturacionServicioFinanciamientosActualizaIdEstadoFacturacion';
const SP_DESPACHO_FILTRAR = 'dbo.FacturacionServicioDespachoFiltraPorIdOrden';
const ID_PUNTO_CARGA_CPT = 1; // Consumo en el Servicio, igual que GalenHos

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

/**
 * Consulta la orden de servicio oficial de GalenHos por IdOrden.
 * SP: dbo.FactOrdenServicioSeleccionarPorId
 */
async function obtenerOrdenServicioPorId(idOrden, transaction = null) {
    const ordenId = enteroRequerido(idOrden, 'idOrden');
    if (transaction) {
        const request = transaction.request();
        request.input('IdOrden', sql.Int, ordenId);
        const result = await request.execute(SP_ORDEN_SELECCIONAR);
        return result.recordset?.[0] || null;
    }
    const params = [{ name: 'IdOrden', type: sql.Int, value: ordenId }];
    const result = await executeProcedure(SP_ORDEN_SELECCIONAR, params);
    return result.recordset?.[0] || null;
}

/**
 * Consulta los servicios/CPTs despachados en una orden.
 * SP: dbo.FacturacionServicioDespachoFiltraPorIdOrden
 */
async function obtenerDespachoPorIdOrden(idOrden, transaction = null) {
    const ordenId = enteroRequerido(idOrden, 'idOrden');
    if (transaction) {
        const request = transaction.request();
        request.input('idOrden', sql.Int, ordenId);
        const result = await request.execute(SP_DESPACHO_FILTRAR);
        return result.recordset || [];
    }
    const params = [{ name: 'idOrden', type: sql.Int, value: ordenId }];
    const result = await executeProcedure(SP_DESPACHO_FILTRAR, params);
    return result.recordset || [];
}

/**
 * Anula una orden de servicio de CPT en GalenHos siguiendo la secuencia oficial:
 * 1. Cambia IdEstadoFacturacion a 9 (Anulado) con FactOrdenServicioModificar.
 * 2. Actualiza los financiamientos con FacturacionServicioFinanciamientosActualizaIdEstadoFacturacion a 9.
 * 3. Registra auditoría oficial con Acción 'E' (Eliminar/Anular).
 * 4. Descuenta el monto del punto de carga en FacturacionCuentasAtencionPtos.
 */
async function anularOrdenServicio({
    idOrden,
    idEmpleado = 1,
    observaciones = 'Anulación de orden CPT desde enfermería web',
}, transaction = null) {
    const ordenId = enteroRequerido(idOrden, 'idOrden');
    const empId = Number(idEmpleado) || 1;

    const orden = await obtenerOrdenServicioPorId(ordenId, transaction);
    if (!orden) {
        throw createRepositoryError('ORDEN_NOT_FOUND', `La orden ${ordenId} no existe en GalenHos.`);
    }

    const itemsDespacho = await obtenerDespachoPorIdOrden(ordenId, transaction);
    const montoADescontar = itemsDespacho.reduce((sum, item) => sum + (Number(item.Total) || 0), 0);

    // 1. Modificar la orden a estado 9 (Anulado)
    if (transaction) {
        const request = transaction.request();
        request.input('IdOrden', sql.Int, orden.IdOrden);
        request.input('IdPuntoCarga', sql.Int, orden.IdPuntoCarga);
        request.input('IdPaciente', sql.Int, orden.IdPaciente);
        request.input('IdCuentaAtencion', sql.Int, orden.IdCuentaAtencion);
        request.input('IdServicioPaciente', sql.Int, orden.IdServicioPaciente);
        request.input('idTipoFinanciamiento', sql.Int, orden.idTipoFinanciamiento);
        request.input('idFuenteFinanciamiento', sql.Int, orden.idFuenteFinanciamiento);
        request.input('FechaCreacion', sql.DateTime, orden.FechaCreacion);
        request.input('IdUsuario', sql.Int, orden.IdUsuario);
        request.input('FechaDespacho', sql.DateTime, orden.FechaDespacho || new Date());
        request.input('IdUsuarioDespacho', sql.Int, empId);
        request.input('IdEstadoFacturacion', sql.Int, 9); // 9 = Anulado
        request.input('FechaHoraRealizaCpt', sql.DateTime, orden.FechaHoraRealizaCpt || new Date());
        request.input('IdUsuarioAuditoria', sql.Int, empId);
        await request.execute(SP_ORDEN_MODIFICAR);

        // 2. Actualizar estado de financiamientos a 9
        const finRequest = transaction.request();
        finRequest.input('lnNuevoIdEstadoFacturacion', sql.Int, 9);
        finRequest.input('lnIdOrden', sql.Int, orden.IdOrden);
        await finRequest.execute(SP_FINANCIAMIENTO_ESTADO);

        // 3. Anular la cabecera de pago si el CPT era particular.
        // GalenHos no toca los pagos ya cubiertos por boleta (estado 4).
        const pagosRequest = transaction.request();
        pagosRequest.input('idOrdenPagos', sql.Int, orden.IdOrden);
        await pagosRequest.query(`
            UPDATE dbo.FactOrdenServicioPagos
            SET IdEstadoFacturacion = 9
            WHERE idOrden = @idOrdenPagos
              AND IdEstadoFacturacion <> 4;
        `);

        // 4. Auditoría oficial con acción 'E'
        await registrarAuditoria({
            idEmpleado: empId,
            accion: 'E',
            idRegistro: orden.IdOrden,
            tabla: 'FactOrdenServicio',
            idListItem: 0,
            observaciones: observaciones.substring(0, 100),
            throwOnError: true,
        }, transaction);

        // 5. Descontar consumo del punto de carga si tenía monto
        if (montoADescontar > 0 && orden.IdCuentaAtencion) {
            const ptosRequest = transaction.request();
            ptosRequest.input('idCuenta', sql.Int, orden.IdCuentaAtencion);
            ptosRequest.input('idPunto', sql.Int, orden.IdPuntoCarga || ID_PUNTO_CARGA_CPT);
            const ptosResult = await ptosRequest.query(`
                SELECT TotalConsumos
                FROM dbo.FacturacionCuentasAtencionPtos WITH (UPDLOCK, HOLDLOCK)
                WHERE IdCuentaAtencion = @idCuenta AND idPuntoCarga = @idPunto;
            `);
            if (ptosResult.recordset?.length) {
                const actual = Number(ptosResult.recordset[0].TotalConsumos) || 0;
                const nuevoConsumo = Math.max(0, actual - montoADescontar);
                if (nuevoConsumo === 0) {
                    // El SP FacturacionCuentasAtencionPtosActualizar solo ejecuta UPDATE si @TotalConsumos > 0.
                    // Cuando el nuevo total llega a 0, se actualiza directamente a 0.00 para no dejar saldos huérfanos.
                    const resetRequest = transaction.request();
                    resetRequest.input('idCuentaReset', sql.Int, orden.IdCuentaAtencion);
                    resetRequest.input('idPuntoReset', sql.Int, orden.IdPuntoCarga || ID_PUNTO_CARGA_CPT);
                    await resetRequest.query(`
                        UPDATE dbo.FacturacionCuentasAtencionPtos
                        SET TotalConsumos = 0.00
                        WHERE IdCuentaAtencion = @idCuentaReset
                          AND idPuntoCarga = @idPuntoReset;
                    `);
                } else {
                    const updatePtosRequest = transaction.request();
                    updatePtosRequest.input('lbNueva', sql.Bit, false);
                    updatePtosRequest.input('IdCuentaAtencion', sql.Int, orden.IdCuentaAtencion);
                    updatePtosRequest.input('idPuntoCarga', sql.Int, orden.IdPuntoCarga || ID_PUNTO_CARGA_CPT);
                    updatePtosRequest.input('TotalConsumos', sql.Money, nuevoConsumo);
                    updatePtosRequest.input('TotalPagos', sql.Money, 0);
                    updatePtosRequest.input('TotalPagosReembolso', sql.Money, 0);
                    await updatePtosRequest.execute('dbo.FacturacionCuentasAtencionPtosActualizar');
                }
            }
        }
    } else {
        const pool = await require('../../../../dbHelper').getPool();
        const tx = new sql.Transaction(pool);
        await tx.begin();
        try {
            await anularOrdenServicio({ idOrden, idEmpleado, observaciones }, tx);
            await tx.commit();
        } catch (err) {
            await tx.rollback();
            throw err;
        }
    }

    return {
        success: true,
        idOrden: ordenId,
        idEstadoFacturacion: 9,
        montoDescontado: montoADescontar,
    };
}

module.exports = {
    obtenerOrdenServicioPorId,
    obtenerDespachoPorIdOrden,
    anularOrdenServicio,
    INVALID_INPUT,
};
