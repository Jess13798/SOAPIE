const sql = require('mssql');
const { query } = require('../../../../dbHelper');

async function guardarRegistro(registro) {
    const result = await query(
        `INSERT INTO dbo.KardexEnfermeria (
            IdPaciente, IdCuenta, IdServicio, Fecha, Turno, Categoria, Detalle,
            Medicamento, Dosis, Via, Frecuencia, HoraProgramada, Estado,
            Observacion, IdEmpleado, Responsable, FechaHora
        )
        OUTPUT INSERTED.IdKardex AS IdKardex
        VALUES (
            @idPaciente, @idCuenta, @idServicio, @fecha, @turno, @categoria, @detalle,
            @medicamento, @dosis, @via, @frecuencia, CONVERT(TIME(0), @horaProgramada), @estado,
            @observacion, @idEmpleado, @responsable,
            CONVERT(DATETIME2(0), DATEADD(HOUR, -5, GETUTCDATE()))
        )`,
        [
            { name: 'idPaciente', type: sql.Int, value: registro.idPaciente },
            { name: 'idCuenta', type: sql.Int, value: registro.idCuenta },
            { name: 'idServicio', type: sql.Int, value: registro.idServicio },
            { name: 'fecha', type: sql.Date, value: registro.fecha },
            { name: 'turno', type: sql.VarChar(1), value: registro.turno },
            { name: 'categoria', type: sql.VarChar(12), value: registro.categoria },
            { name: 'detalle', type: sql.NVarChar(2000), value: registro.detalle },
            { name: 'medicamento', type: sql.NVarChar(200), value: registro.medicamento },
            { name: 'dosis', type: sql.NVarChar(100), value: registro.dosis },
            { name: 'via', type: sql.NVarChar(100), value: registro.via },
            { name: 'frecuencia', type: sql.NVarChar(100), value: registro.frecuencia },
            { name: 'horaProgramada', type: sql.VarChar(5), value: registro.horaProgramada },
            { name: 'estado', type: sql.VarChar(20), value: registro.estado },
            { name: 'observacion', type: sql.NVarChar(1000), value: registro.observacion },
            { name: 'idEmpleado', type: sql.Int, value: registro.idEmpleado },
            { name: 'responsable', type: sql.NVarChar(120), value: registro.responsable },
        ]
    );

    return { success: true, id: result.recordset[0].IdKardex };
}

async function obtenerRegistros(idCuenta, fecha) {
    let sqlText = `SELECT IdKardex, IdPaciente, IdCuenta, IdServicio, Fecha,
                          Turno, Categoria, Detalle, Medicamento, Dosis, Via,
                          Frecuencia,
                          CONVERT(VARCHAR(5), HoraProgramada, 108) AS HoraProgramada,
                          Estado, Observacion, IdEmpleado, Responsable,
                          CONVERT(VARCHAR(19), FechaHora, 126) AS FechaHora
                   FROM dbo.KardexEnfermeria
                   WHERE IdCuenta = @idCuenta`;
    const params = [{ name: 'idCuenta', type: sql.Int, value: idCuenta }];

    if (fecha) {
        sqlText += ' AND Fecha = @fecha';
        params.push({ name: 'fecha', type: sql.Date, value: fecha });
    }

    sqlText += ' ORDER BY FechaHora ASC, IdKardex ASC';
    const result = await query(sqlText, params);
    return result.recordset || [];
}

module.exports = { guardarRegistro, obtenerRegistros };
