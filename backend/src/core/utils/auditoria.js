// Propósito: Implementación del archivo auditoria.js.
// Responsable de mantener separadas las reglas de este archivo.

const sql = require('mssql');
const os = require('os');
const { executeProcedure } = require('../../../dbHelper');

/**
 * Registra una acción en la tabla oficial de Auditoria de GalenHos/SIGH
 * utilizando el procedimiento almacenado dbo.AuditoriaAgregarV.
 *
 * @param {object} params
 * @param {number} params.idEmpleado - ID del empleado que realiza la acción
 * @param {string} params.accion - 'A' (Agregar/Insert), 'M' (Modificar/Update), 'E' (Eliminar/Delete)
 * @param {number} params.idRegistro - ID del registro afectado (ej: IdOrden, IdNotaEnfermeria)
 * @param {string} params.tabla - Nombre de la tabla ('FactOrdenServicio', 'NotaEnfermeria', etc.)
 * @param {number} [params.idListItem=103] - Código de item/módulo en GalenHos
 * @param {string} [params.nombrePC] - Nombre de equipo o identificador del cliente
 * @param {string} [params.observaciones=''] - Detalle de la auditoría
 * @param {object} [transaction] - Objeto Transaction opcional para correr dentro de una transacción activa
 */
/**
 * Implementa la operación "registrarAuditoria".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */
async function registrarAuditoria(
    {
        idEmpleado,
        accion = 'A',
        idRegistro,
        tabla,
        idListItem = 103,
        nombrePC = os.hostname() || 'WEB-ENFERMERIA',
        observaciones = '',
        throwOnError = false,
    },
    transaction = null
) {
    try {
        const empId = Number(idEmpleado) || 1;
        const regId = Number(idRegistro);
        if (!regId) return;

        const nombreEquipo = String(nombrePC || 'WEB-ENFERMERIA').substring(0, 30);
        const obs = String(observaciones || '').substring(0, 100);

        if (transaction) {
            const request = transaction.request();
            request.input('IdEmpleado', sql.Int, empId);
            request.input('Accion', sql.Char(1), String(accion).charAt(0).toUpperCase());
            request.input('IdRegistro', sql.Int, regId);
            request.input('Tabla', sql.VarChar(50), String(tabla).substring(0, 50));
            request.input('idListItem', sql.Int, Number(idListItem) || 103);
            request.input('nombrePC', sql.VarChar(30), nombreEquipo);
            request.input('observaciones', sql.VarChar(100), obs);
            await request.execute('dbo.AuditoriaAgregarV');
        } else {
            await executeProcedure('dbo.AuditoriaAgregarV', [
                { name: 'IdEmpleado', type: sql.Int, value: empId },
                { name: 'Accion', type: sql.Char(1), value: String(accion).charAt(0).toUpperCase() },
                { name: 'IdRegistro', type: sql.Int, value: regId },
                { name: 'Tabla', type: sql.VarChar(50), value: String(tabla).substring(0, 50) },
                { name: 'idListItem', type: sql.Int, value: Number(idListItem) || 103 },
                { name: 'nombrePC', type: sql.VarChar(30), value: nombreEquipo },
                { name: 'observaciones', type: sql.VarChar(100), value: obs },
            ]);
        }
    } catch (error) {
        if (throwOnError) {
            throw error;
        }
    }
}

module.exports = {
    registrarAuditoria,
};
