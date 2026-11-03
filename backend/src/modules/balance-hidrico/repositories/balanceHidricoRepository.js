const sql = require('mssql');
const { query } = require('../../../../dbHelper');

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

async function guardarRegistro(nota) {
    await asegurarTabla();
    const idPaciente = nota.pacienteId ? Number(nota.pacienteId) : null;
    const idCuenta = nota.idCuenta ? Number(nota.idCuenta) : null;
    const idServicio = nota.servicioId ? Number(nota.servicioId) : null;
    const idEmpleado = nota.idEmpleado ? Number(nota.idEmpleado) : null;
    const fecha = nota.fecha || new Date().toISOString().slice(0, 10);
    const turno = nota.turno || 'M';
    const tipo = nota.tipo || 'ingreso';
    const concepto = nota.concepto || '';
    const cantidad = Number(nota.cantidad) || 0;

    const result = await query(
        `INSERT INTO dbo.BalanceHidrico (IdPaciente, IdCuenta, IdServicio, Fecha, Turno, Tipo, Concepto, Cantidad, IdEmpleado)
         OUTPUT INSERTED.IdBalance AS IdBalance
         VALUES (@idPaciente, @idCuenta, @idServicio, @fecha, @turno, @tipo, @concepto, @cantidad, @idEmpleado)`,
        [
            { name: 'idPaciente', type: sql.Int, value: idPaciente },
            { name: 'idCuenta', type: sql.Int, value: idCuenta },
            { name: 'idServicio', type: sql.Int, value: idServicio },
            { name: 'fecha', type: sql.Date, value: fecha },
            { name: 'turno', type: sql.VarChar, value: turno },
            { name: 'tipo', type: sql.VarChar, value: tipo },
            { name: 'concepto', type: sql.VarChar, value: concepto },
            { name: 'cantidad', type: sql.Decimal(8, 2), value: cantidad },
            { name: 'idEmpleado', type: sql.Int, value: idEmpleado },
        ]
    );
    return { success: true, id: result.recordset[0].IdBalance };
}

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
