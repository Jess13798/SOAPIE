const { sql, dbConfig } = require('./database');

async function obtenerPacientesSinCama(nombreServicio = null) {
    try {
        const pool = await sql.connect(dbConfig);
        const request = pool.request();
        request.timeout = 60000; // 60s para esta consulta pesada
        request.input(
            'NombreServicio',
            sql.NVarChar,
            nombreServicio && nombreServicio !== 'todos' && nombreServicio !== '' ? nombreServicio : null
        );

        const query = `
            ;WITH PacientesSinCama AS (
                SELECT DISTINCT
                    a.IdCuentaAtencion,
                    l.IdEspecialidad,
                    p.IdPaciente,
                    UPPER(  LTRIM(RTRIM(
                 ISNULL(p.ApellidoPaterno, '') + ' ' +
                 ISNULL(p.ApellidoMaterno, '') + ' ' +
                 ISNULL(p.PrimerNombre, '') + ' ' +
        	     ISNULL(p.SegundoNombre, '') + ' ' +
                 ISNULL(p.TercerNombre, '')
                  ))) AS PACIENTE,
                    e.FechaOcupacion AS FECHA_ENVIO,
                    e.HoraOcupacion AS HORA_ENVIO,
                    CONVERT(VARCHAR,
                        FLOOR(DATEDIFF(MINUTE,
                            DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', ISNULL(e.HoraOcupacion, '00:00:00')), e.FechaOcupacion),
                            GETDATE()) / 1440)
                    ) + ' dia(s), ' +
                    CONVERT(VARCHAR,
                        FLOOR((DATEDIFF(MINUTE,
                            DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', ISNULL(e.HoraOcupacion, '00:00:00')), e.FechaOcupacion),
                            GETDATE()) % 1440) / 60)
                    ) + ' hora(s), ' +
                    CONVERT(VARCHAR,
                        DATEDIFF(MINUTE,
                            DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', ISNULL(e.HoraOcupacion, '00:00:00')), e.FechaOcupacion),
                            GETDATE()) % 60
                    ) + ' minuto(s)' AS INTERVALO_TIEMPO,
                    r.Nombre AS SERVICIOFINAL,
                    ROW_NUMBER() OVER (PARTITION BY a.IdCuentaAtencion ORDER BY e.Secuencia DESC) AS RowNum
                FROM AtencionesEstanciaHospitalaria e
                INNER JOIN Atenciones a ON a.IdCuentaAtencion = e.IdAtencion
                INNER JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
                INNER JOIN Servicios r ON r.IdServicio = e.IdServicio
                INNER JOIN Especialidades l ON l.IdEspecialidad = r.IdEspecialidad
                INNER JOIN FacturacionCuentasAtencion f ON f.IdCuentaAtencion = a.IdCuentaAtencion
                WHERE e.FechaOcupacion >= DATEADD(HOUR, -72, GETDATE())
                    AND a.idEstadoAtencion = 1
                    AND f.IdEstado = 12
                    AND e.LlegoAlServicio = 0
            )
            SELECT
                IdCuentaAtencion,
                IdEspecialidad,
                IdPaciente,
                PACIENTE,
                FECHA_ENVIO,
                HORA_ENVIO,
                INTERVALO_TIEMPO,
                SERVICIOFINAL
            FROM PacientesSinCama
            WHERE RowNum = 1
              AND (@NombreServicio IS NULL OR SERVICIOFINAL = @NombreServicio)
            ORDER BY FECHA_ENVIO DESC, HORA_ENVIO DESC;
        `;

        const result = await request.query(query);

        console.log('Pacientes sin cama encontrados:', result.recordset.length);
        return result.recordset;
    } catch (error) {
        console.error('Error al obtener pacientes sin cama:', error);
        return [];
    }
}

async function asignarCama({ IdPaciente, IdCuentaAtencion, IdCama, IdMedicoOrdena }) {
    const pool = await sql.connect(dbConfig);
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const request = new sql.Request(transaction);
        request.input('IdPaciente', sql.Int, Number(IdPaciente));
        request.input('IdCuentaAtencion', sql.Int, Number(IdCuentaAtencion));
        request.input('IdCama', sql.Int, Number(IdCama));
        request.input('IdMedico', sql.Int, IdMedicoOrdena ? Number(IdMedicoOrdena) : null);

        await request.query(`
            UPDATE Camas
            SET IdPaciente = @IdPaciente, IdEstadoCama = 3, idCondicionOcupacion = 1
            WHERE IdCama = @IdCama;
        `);

        await request.query(`
            UPDATE Atenciones
            SET IdCamaIngreso = @IdCama
            WHERE IdCuentaAtencion = @IdCuentaAtencion
              AND IdPaciente = @IdPaciente;
        `);

        await request.query(`
            UPDATE AtencionesEstanciaHospitalaria
            SET LlegoAlServicio = 1, IdCama = @IdCama, IdMedicoOrdena = @IdMedico
            WHERE IdAtencion = @IdCuentaAtencion AND IdCama IS NULL;
        `);

        await request.query(`
            UPDATE FacturacionCuentasAtencion
            SET IdEstado = 1
            WHERE IdCuentaAtencion = @IdCuentaAtencion;
        `);

        await transaction.commit();
        return { success: true, mensaje: 'Cama asignada correctamente' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function moverPacienteDeCama({ IdPaciente, IdCama, IdCuentaAtencion }) {
    const pool = await sql.connect(dbConfig);
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const request = new sql.Request(transaction);
        request.input('IdPaciente', sql.Int, Number(IdPaciente));
        request.input('IdCama', sql.Int, Number(IdCama));
        request.input('IdAtencion', sql.Int, Number(IdCuentaAtencion));

        await request.query(`
            UPDATE Camas
            SET IdPaciente = NULL, IdEstadoCama = 1, idCondicionOcupacion = 1
            WHERE IdPaciente = @IdPaciente
              AND IdCama <> @IdCama;
        `);

        await request.query(`
            UPDATE Camas
            SET IdPaciente = @IdPaciente, IdEstadoCama = 3, idCondicionOcupacion = 1
            WHERE IdCama = @IdCama;
        `);

        await request.query(`
            UPDATE Atenciones
            SET IdCamaIngreso = @IdCama
            WHERE IdCuentaAtencion = @IdAtencion
              AND IdPaciente = @IdPaciente;
        `);

        await request.query(`
            ;WITH UltimaEstancia AS (
                SELECT TOP 1 *
                FROM AtencionesEstanciaHospitalaria
                WHERE IdAtencion = @IdAtencion
                ORDER BY Secuencia DESC
            )
            UPDATE UltimaEstancia
            SET IdCama = @IdCama, LlegoAlServicio = 1;
        `);

        await transaction.commit();
        return { success: true, mensaje: 'Cama reasignada correctamente' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function registrarTransferenciaEstancia({ idAtencion, idMedicoOrdena, idServicio, idDiagnostico, fechaOcupacion, horaOcupacion, idProducto, idEmpleado, fechaModificacion, idPaciente }) {
    if (!idAtencion || !idServicio) {
        throw new Error('idAtencion e idServicio son obligatorios');
    }

    const pool = await sql.connect(dbConfig);
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const request = new sql.Request(transaction);
        request.input('idAtencion', sql.Int, Number(idAtencion));
        request.input('idMedicoOrdena', sql.Int, idMedicoOrdena ? Number(idMedicoOrdena) : null);
        request.input('idServicio', sql.Int, Number(idServicio));
        request.input('idProducto', sql.Int, idProducto ? Number(idProducto) : 50018);
        const fechaEf = fechaOcupacion && String(fechaOcupacion).length === 8 ? String(fechaOcupacion) : null;
        const horaEf = horaOcupacion && horaOcupacion.length >= 4 ? horaOcupacion : null;
        // Fallback a hora/fecha servidor si no vienen del cliente
        const ahora = new Date();
        const yyyy = ahora.getFullYear();
        const mm = String(ahora.getMonth() + 1).padStart(2, '0');
        const dd = String(ahora.getDate()).padStart(2, '0');
        const hh = String(ahora.getHours()).padStart(2, '0');
        const min = String(ahora.getMinutes()).padStart(2, '0');
        const fechaActualStr = `${yyyy}${mm}${dd}`;
        const horaActualStr = `${hh}:${min}`;

        const fechaParaGuardar = fechaEf || fechaActualStr;
        const horaParaGuardar = horaEf || horaActualStr;

        request.input('horaOcupacion', sql.VarChar(5), horaParaGuardar);
        request.input('fechaOcupacion', sql.VarChar(8), fechaParaGuardar);
        request.input('llegoAlServicio', sql.Bit, 0);
        request.input('idDiagnostico', sql.Int, idDiagnostico ? Number(idDiagnostico) : null);
        request.input('idEmpleado', sql.Int, idEmpleado ? Number(idEmpleado) : null);
        request.input('idUsuarioAuditoria', sql.Int, idEmpleado ? Number(idEmpleado) : null);
        request.input('idPaciente', sql.Int, idPaciente ? Number(idPaciente) : null);
        // Combinar fecha + hora a formato datetime (sin ajuste de zona, se envía como texto)
        const fechaBase = fechaModificacion || fechaParaGuardar;
        const fechaHoraStr = `${fechaBase.slice(0,4)}-${fechaBase.slice(4,6)}-${fechaBase.slice(6,8)} ${horaParaGuardar}:00.000`;
        request.input('fechaHora', sql.VarChar(23), fechaHoraStr);

        const secuenciaResult = await request.query(`
            SELECT ISNULL(MAX(Secuencia), 0) + 1 AS siguiente
            FROM AtencionesEstanciaHospitalaria
            WHERE IdAtencion = @idAtencion
        `);
        const siguienteSecuencia = secuenciaResult.recordset?.[0]?.siguiente || 1;
        request.input('secuencia', sql.Int, siguienteSecuencia);

        // Liberar cama previa del paciente
        if (idPaciente) {
            await request.query(`
                UPDATE Camas
                SET IdPaciente = NULL, IdEstadoCama = 1
                WHERE IdPaciente = @idPaciente;
            `);
        }

        // Actualizar el registro anterior (secuencia - 1) con fecha/hora de desocupación
        if (siguienteSecuencia > 1) {
            await request.query(`
                UPDATE AtencionesEstanciaHospitalaria
                SET 
                    FechaDesocupacion = @fechaOcupacion,
                    HoraDesocupacion = @horaOcupacion,
                    DiasEstancia = DATEDIFF(DAY, FechaOcupacion, @fechaOcupacion)
                WHERE IdAtencion = @idAtencion 
                  AND Secuencia = @secuencia - 1;
            `);
        }

        await request.query(`
            UPDATE Atenciones
            SET IdServicioEgreso = @idServicio
            WHERE IdAtencion = @idAtencion;
        `);

        await request.query(`
            INSERT INTO AtencionesEstanciaHospitalaria 
                (IdAtencion, IdMedicoOrdenaOrigen, IdServicio, IdProducto, HoraOcupacion, FechaOcupacion, Secuencia, 
                 LlegoAlServicio, IdDiagnostico, IdUsuarioAuditoria)
            VALUES 
                (@idAtencion, @idMedicoOrdena, @idServicio, @idProducto, @horaOcupacion, @fechaOcupacion, @secuencia, 
                 @llegoAlServicio, @idDiagnostico, @idUsuarioAuditoria);
        `);

        await request.query(`
            UPDATE FacturacionCuentasAtencion
            SET IdEstado = 12,
                IdUsuarioModifica = @idEmpleado,
                FechaModificacion = @fechaHora
            WHERE IdCuentaAtencion = @idAtencion;
        `);

        await transaction.commit();
        return { success: true };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    obtenerPacientesSinCama,
    asignarCama,
    moverPacienteDeCama,
    registrarTransferenciaEstancia
};
