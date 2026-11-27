// Propósito: Acceso a datos del módulo "balance-hidrico".
// Responsable de mantener separadas las reglas de este archivo.

const sql = require('mssql');
const { query, executeProcedure } = require('../../../../dbHelper');

/**
 * Implementa la operación "asegurarTabla".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */

async function asegurarTabla() {
    await query(`
        IF OBJECT_ID(N'dbo.BalanceHidrico', N'U') IS NULL
        BEGIN
            CREATE TABLE dbo.BalanceHidrico (
                IdBalance INT IDENTITY(1,1) PRIMARY KEY,
                IdPaciente INT NOT NULL,
                IdCuenta INT NULL,
                IdServicio INT NULL,
                Fecha DATE NOT NULL,
                Turno VARCHAR(10) NOT NULL,
                Tipo VARCHAR(10) NOT NULL,
                Concepto VARCHAR(50) NOT NULL,
                Cantidad DECIMAL(8,2) NOT NULL,
                IdEmpleado INT NULL,
                FechaHora DATETIME NOT NULL DEFAULT GETDATE(),
                IdNota INT NULL
            );
            CREATE INDEX IX_BalanceHidrico_Cuenta_Fecha
                ON dbo.BalanceHidrico (IdCuenta, Fecha);
        END
    `);
}

/**
 * Implementa la operación "guardarRegistro".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


async function guardarRegistro(nota) {
    await asegurarTabla();
    const idNota = nota.idNota ? Number(nota.idNota) : null;
    const idPaciente = nota.pacienteId ? Number(nota.pacienteId) : null;
    const idCuenta = nota.idCuenta ? Number(nota.idCuenta) : null;
    const idServicio = nota.servicioId ? Number(nota.servicioId) : null;
    const idEmpleado = nota.idEmpleado ? Number(nota.idEmpleado) : null;
    const fecha = nota.fecha || new Date().toISOString().slice(0, 10);
    const turno = nota.turno || 'M';
    const tipo = nota.tipo || 'ingreso';
    const concepto = nota.concepto || '';
    const cantidad = Number(nota.cantidad) || 0;

    const result = await executeProcedure('dbo.usp_GuardarBalanceHidrico', [
        { name: 'IdNota', type: sql.Int, value: idNota },
        { name: 'IdPaciente', type: sql.Int, value: idPaciente },
        { name: 'IdCuenta', type: sql.Int, value: idCuenta },
        { name: 'IdServicio', type: sql.Int, value: idServicio },
        { name: 'Fecha', type: sql.Date, value: fecha },
        { name: 'Turno', type: sql.VarChar(10), value: turno },
        { name: 'Tipo', type: sql.VarChar(10), value: tipo },
        { name: 'Concepto', type: sql.VarChar(50), value: concepto },
        { name: 'Cantidad', type: sql.Decimal(8, 2), value: cantidad },
        { name: 'IdEmpleado', type: sql.Int, value: idEmpleado },
    ]);
    return { success: true, id: result.recordset?.[0]?.IdBalance ?? null };
}

/**


 * Implementa la operación "obtenerRegistros".


 * Mantiene aislada la responsabilidad principal de este archivo.


 */


async function obtenerRegistros(idCuenta, fecha) {
    await asegurarTabla();
    const cuentaId = idCuenta ? Number(idCuenta) : null;
    if (!cuentaId) return [];
    let sqlText = `SELECT IdBalance, IdPaciente, IdCuenta, IdServicio, Fecha, Turno, Tipo, Concepto, Cantidad, IdEmpleado, FechaHora
                   FROM dbo.BalanceHidrico WHERE IdCuenta = @idCuenta`;
    const params = [{ name: 'idCuenta', type: sql.Int, value: cuentaId }];
    if (fecha) {
        sqlText += ' AND Fecha = @fecha';
        params.push({ name: 'fecha', type: sql.Date, value: fecha });
    }
    sqlText += ' ORDER BY FechaHora ASC';
    const result = await query(sqlText, params);
    return result.recordset || [];
}

/**


 * Implementa la operación "eliminarRegistro".


 * Mantiene aislada la responsabilidad principal de este archivo.


 */


async function eliminarRegistro(id) {
    await asegurarTabla();
    const idNum = Number(id);
    if (!idNum) throw new Error('Id inválido');
    await query('DELETE FROM dbo.BalanceHidrico WHERE IdBalance = @id', [
        { name: 'id', type: sql.Int, value: idNum },
    ]);
    return { success: true };
}

module.exports = { guardarRegistro, obtenerRegistros, eliminarRegistro };
