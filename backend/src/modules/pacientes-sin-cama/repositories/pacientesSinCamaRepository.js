// Repositorio de pacientes sin cama.
// Encapsula la lógica SQL y las transacciones para que el servicio no dependa
// directamente del detalle de la base de datos ni del manejo de conexiones.

const sql = require('mssql');
const { getPool } = require('../../../../dbHelper');

async function getPacientesSinCama(nombreServicio = null) {
    try {
        const pool = await getPool();
        const request = pool.request();
        request.timeout = 60000;
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
                    UPPER(LTRIM(RTRIM(
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

// --- Auditoría de camas ---
// Rastro de cada operación de cama: quién, cuándo, paciente, cama y servicio.
// Vive en una tabla propia de la app (no del HIS) que se crea sola la primera
// vez (idempotente) para no depender de una migración manual. Además, la
// estancia (#AtencionesEstanciaHospitalaria) guarda IdUsuarioAuditoria y
// FechaAsignacion, columnas que ya existen en el esquema del HIS.
let promesaTablaAuditoria = null;

async function asegurarTablaAuditoria(pool) {
    if (!promesaTablaAuditoria) {
        promesaTablaAuditoria = pool.request().query(`
            IF OBJECT_ID(N'dbo.EnfermeriaAuditoriaCamas', N'U') IS NULL
            BEGIN
                CREATE TABLE dbo.EnfermeriaAuditoriaCamas (
                    IdAuditoria       INT IDENTITY(1,1) NOT NULL,
                    FechaHora         DATETIME NOT NULL CONSTRAINT DF_EnfermeriaAuditoriaCamas_FechaHora DEFAULT (GETDATE()),
                    Accion            VARCHAR(20) NOT NULL,
                    IdCuentaAtencion  INT NULL,
                    IdPaciente        INT NULL,
                    Paciente          NVARCHAR(300) NULL,
                    IdCama            INT NULL,
                    Cama              NVARCHAR(50) NULL,
                    CamaAnterior      NVARCHAR(50) NULL,
                    IdServicio        INT NULL,
                    Servicio          NVARCHAR(300) NULL,
                    IdUsuario         INT NULL,
                    Usuario           NVARCHAR(100) NULL,
                    Detalle           NVARCHAR(500) NULL,
                    CONSTRAINT PK_EnfermeriaAuditoriaCamas PRIMARY KEY (IdAuditoria)
                );

                CREATE INDEX IX_EnfermeriaAuditoriaCamas_FechaHora
                    ON dbo.EnfermeriaAuditoriaCamas (FechaHora DESC);
            END
        `).catch((error) => {
            // Si falla (p. ej. sin permisos de DDL) se reintenta en la próxima
            // operación y la asignación de cama sigue funcionando igual.
            promesaTablaAuditoria = null;
            console.error('No se pudo asegurar dbo.EnfermeriaAuditoriaCamas:', error.message);
            throw error;
        });
    }
    return promesaTablaAuditoria;
}

// Enriquece el registro de auditoría con datos reales de la base (no del
// cliente): paciente, cama y servicio.
async function obtenerContextoAuditoria(transaction, idCuentaAtencion, idCama) {
    const req = new sql.Request(transaction);
    req.input('IdCuentaAtencion', sql.Int, idCuentaAtencion != null ? Number(idCuentaAtencion) : null);
    req.input('IdCama', sql.Int, idCama != null ? Number(idCama) : null);
    const resultado = await req.query(`
        SELECT TOP 1
            a.IdPaciente,
            UPPER(LTRIM(RTRIM(
                ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' +
                ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, '')
            ))) AS Paciente,
            LTRIM(RTRIM(ISNULL(c.Codigo, ''))) AS Cama,
            est.IdServicio AS IdServicioEstancia,
            c.IdServicioPropietario AS IdServicioCama,
            s.Nombre AS Servicio
        FROM Atenciones a
        LEFT JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
        LEFT JOIN Camas c ON c.IdCama = @IdCama
        OUTER APPLY (
            SELECT TOP 1 IdServicio
            FROM AtencionesEstanciaHospitalaria
            WHERE IdAtencion = a.IdAtencion
            ORDER BY Secuencia DESC
        ) est
        LEFT JOIN Servicios s ON s.IdServicio = COALESCE(est.IdServicio, c.IdServicioPropietario)
        WHERE a.IdCuentaAtencion = @IdCuentaAtencion;
    `);
    return resultado.recordset?.[0] || {};
}

// Cama que ocupa hoy el paciente (para registrar de dónde salió).
async function obtenerCamaActual(transaction, idPaciente, idCamaExcluir) {
    const req = new sql.Request(transaction);
    req.input('IdPaciente', sql.Int, Number(idPaciente));
    req.input('IdCamaExcluir', sql.Int, idCamaExcluir != null ? Number(idCamaExcluir) : null);
    const resultado = await req.query(`
        SELECT TOP 1 LTRIM(RTRIM(ISNULL(c.Codigo, ''))) AS Cama
        FROM Camas c
        WHERE c.IdPaciente = @IdPaciente
          AND (@IdCamaExcluir IS NULL OR c.IdCama <> @IdCamaExcluir);
    `);
    return resultado.recordset?.[0]?.Cama || null;
}

// Escribe una línea de auditoría. Si la tabla aún no existe, no hace nada
// (la operación principal nunca falla por la auditoría).
async function registrarAuditoria(transaction, {
    accion,
    idCuentaAtencion,
    idPaciente,
    paciente,
    idCama,
    cama,
    camaAnterior,
    idServicio,
    servicio,
    idUsuario,
    usuario,
    detalle,
}) {
    const req = new sql.Request(transaction);
    req.input('Accion', sql.VarChar(20), accion);
    req.input('IdCuentaAtencion', sql.Int, idCuentaAtencion != null ? Number(idCuentaAtencion) : null);
    req.input('IdPaciente', sql.Int, idPaciente != null ? Number(idPaciente) : null);
    req.input('Paciente', sql.NVarChar(300), paciente || null);
    req.input('IdCama', sql.Int, idCama != null ? Number(idCama) : null);
    req.input('Cama', sql.NVarChar(50), cama || null);
    req.input('CamaAnterior', sql.NVarChar(50), camaAnterior || null);
    req.input('IdServicio', sql.Int, idServicio != null ? Number(idServicio) : null);
    req.input('Servicio', sql.NVarChar(300), servicio || null);
    req.input('IdUsuario', sql.Int, idUsuario != null ? Number(idUsuario) : null);
    req.input('Usuario', sql.NVarChar(100), usuario || null);
    req.input('Detalle', sql.NVarChar(500), detalle || null);

    await req.query(`
        IF OBJECT_ID(N'dbo.EnfermeriaAuditoriaCamas', N'U') IS NOT NULL
        BEGIN
            INSERT INTO dbo.EnfermeriaAuditoriaCamas
                (Accion, IdCuentaAtencion, IdPaciente, Paciente, IdCama, Cama, CamaAnterior,
                 IdServicio, Servicio, IdUsuario, Usuario, Detalle)
            VALUES
                (@Accion, @IdCuentaAtencion, @IdPaciente, @Paciente, @IdCama, @Cama, @CamaAnterior,
                 @IdServicio, @Servicio, @IdUsuario, @Usuario, @Detalle);
        END
    `);
}

// Devuelve el rastro de auditoría filtrado, más reciente primero.
async function getAuditoriaCamas({ fechaDesde, fechaHasta, servicioId, accion, usuario, limit } = {}) {
    try {
        const pool = await getPool();
        await asegurarTablaAuditoria(pool).catch(() => {});

        const request = pool.request();
        request.input('FechaDesde', sql.VarChar(10), fechaDesde || null);
        request.input('FechaHasta', sql.VarChar(10), fechaHasta || null);
        request.input('ServicioId', sql.Int, servicioId ? Number(servicioId) : null);
        request.input('Accion', sql.VarChar(20), accion || null);
        request.input('Usuario', sql.NVarChar(100), usuario || null);
        request.input('Limit', sql.Int, Math.min(Math.max(Number(limit) || 200, 1), 1000));

        const resultado = await request.query(`
            SELECT TOP (@Limit)
                IdAuditoria, FechaHora, Accion, IdCuentaAtencion, IdPaciente, Paciente,
                IdCama, Cama, CamaAnterior, IdServicio, Servicio, IdUsuario, Usuario, Detalle
            FROM dbo.EnfermeriaAuditoriaCamas
            WHERE (@FechaDesde IS NULL OR FechaHora >= CAST(@FechaDesde AS DATE))
              AND (@FechaHasta IS NULL OR FechaHora < DATEADD(DAY, 1, CAST(@FechaHasta AS DATE)))
              AND (@ServicioId IS NULL OR IdServicio = @ServicioId)
              AND (@Accion IS NULL OR Accion = @Accion)
              AND (@Usuario IS NULL OR Usuario = @Usuario)
            ORDER BY FechaHora DESC, IdAuditoria DESC;
        `);
        return resultado.recordset || [];
    } catch (error) {
        console.error('Error al obtener la auditoría de camas:', error.message);
        return [];
    }
}

async function asignarCama({ IdPaciente, IdCuentaAtencion, IdCama, IdMedicoOrdena, idUsuario, usuario }) {
    const pool = await getPool();
    await asegurarTablaAuditoria(pool).catch(() => {});
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const request = new sql.Request(transaction);
        request.input('IdPaciente', sql.Int, Number(IdPaciente));
        request.input('IdCuentaAtencion', sql.Int, Number(IdCuentaAtencion));
        request.input('IdCama', sql.Int, Number(IdCama));
        request.input('IdMedico', sql.Int, IdMedicoOrdena ? Number(IdMedicoOrdena) : null);
        request.input('IdUsuarioAuditoria', sql.Int, idUsuario ? Number(idUsuario) : null);

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
            SET LlegoAlServicio = 1, IdCama = @IdCama, IdMedicoOrdena = @IdMedico,
                IdUsuarioAuditoria = @IdUsuarioAuditoria, FechaAsignacion = GETDATE()
            WHERE IdAtencion = @IdCuentaAtencion AND IdCama IS NULL;
        `);

        await request.query(`
            UPDATE FacturacionCuentasAtencion
            SET IdEstado = 1
            WHERE IdCuentaAtencion = @IdCuentaAtencion;
        `);

        const contexto = await obtenerContextoAuditoria(transaction, IdCuentaAtencion, IdCama);
        await registrarAuditoria(transaction, {
            accion: 'ASIGNAR',
            idCuentaAtencion: IdCuentaAtencion,
            idPaciente: contexto.IdPaciente || IdPaciente,
            paciente: contexto.Paciente,
            idCama: IdCama,
            cama: contexto.Cama,
            camaAnterior: null,
            idServicio: contexto.IdServicioEstancia || contexto.IdServicioCama,
            servicio: contexto.Servicio,
            idUsuario,
            usuario,
            detalle: 'Asignación de cama',
        });

        await transaction.commit();
        return { success: true, mensaje: 'Cama asignada correctamente' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function moverPacienteDeCama({ IdPaciente, IdCama, IdCuentaAtencion, idUsuario, usuario }) {
    const pool = await getPool();
    await asegurarTablaAuditoria(pool).catch(() => {});
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const camaAnterior = await obtenerCamaActual(transaction, IdPaciente, IdCama);

        const request = new sql.Request(transaction);
        request.input('IdPaciente', sql.Int, Number(IdPaciente));
        request.input('IdCama', sql.Int, Number(IdCama));
        request.input('IdAtencion', sql.Int, Number(IdCuentaAtencion));
        request.input('IdUsuarioAuditoria', sql.Int, idUsuario ? Number(idUsuario) : null);

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
            SET IdCama = @IdCama, LlegoAlServicio = 1,
                IdUsuarioAuditoria = @IdUsuarioAuditoria, FechaAsignacion = GETDATE();
        `);

        const contexto = await obtenerContextoAuditoria(transaction, IdCuentaAtencion, IdCama);
        await registrarAuditoria(transaction, {
            accion: 'MOVER',
            idCuentaAtencion: IdCuentaAtencion,
            idPaciente: contexto.IdPaciente || IdPaciente,
            paciente: contexto.Paciente,
            idCama: IdCama,
            cama: contexto.Cama,
            camaAnterior,
            idServicio: contexto.IdServicioEstancia || contexto.IdServicioCama,
            servicio: contexto.Servicio,
            idUsuario,
            usuario,
            detalle: camaAnterior
                ? `Cambio de cama ${camaAnterior} -> ${contexto.Cama || IdCama}`
                : 'Cambio de cama',
        });

        await transaction.commit();
        return { success: true, mensaje: 'Cama reasignada correctamente' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

async function registrarTransferenciaEstancia({
    idAtencion,
    idMedicoOrdena,
    idServicio,
    idDiagnostico,
    fechaOcupacion,
    horaOcupacion,
    idProducto,
    idEmpleado,
    fechaModificacion,
    idPaciente,
    idUsuario,
    usuario,
}) {
    if (!idAtencion || !idServicio) {
        throw new Error('idAtencion e idServicio son obligatorios');
    }

    const pool = await getPool();
    await asegurarTablaAuditoria(pool).catch(() => {});
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const camaAnterior = idPaciente
            ? await obtenerCamaActual(transaction, idPaciente, null)
            : null;

        const request = new sql.Request(transaction);
        request.input('idAtencion', sql.Int, Number(idAtencion));
        request.input('idMedicoOrdena', sql.Int, idMedicoOrdena ? Number(idMedicoOrdena) : null);
        request.input('idServicio', sql.Int, Number(idServicio));
        request.input('idProducto', sql.Int, idProducto ? Number(idProducto) : 50018);

        const fechaEf = fechaOcupacion && String(fechaOcupacion).length === 8 ? String(fechaOcupacion) : null;
        const horaEf = horaOcupacion && horaOcupacion.length >= 4 ? horaOcupacion : null;
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
        request.input('idUsuarioAuditoria', sql.Int, idUsuario ? Number(idUsuario) : (idEmpleado ? Number(idEmpleado) : null));
        request.input('idPaciente', sql.Int, idPaciente ? Number(idPaciente) : null);

        const fechaBase = fechaModificacion || fechaParaGuardar;
        const fechaHoraStr = `${fechaBase.slice(0, 4)}-${fechaBase.slice(4, 6)}-${fechaBase.slice(6, 8)} ${horaParaGuardar}:00.000`;
        request.input('fechaHora', sql.VarChar(23), fechaHoraStr);

        const secuenciaResult = await request.query(`
            SELECT ISNULL(MAX(Secuencia), 0) + 1 AS siguiente
            FROM AtencionesEstanciaHospitalaria
            WHERE IdAtencion = @idAtencion
        `);
        const siguienteSecuencia = secuenciaResult.recordset?.[0]?.siguiente || 1;
        request.input('secuencia', sql.Int, siguienteSecuencia);

        if (idPaciente) {
            await request.query(`
                UPDATE Camas
                SET IdPaciente = NULL, IdEstadoCama = 1
                WHERE IdPaciente = @idPaciente;
            `);
        }

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

        const contexto = await obtenerContextoAuditoria(transaction, idAtencion, null);
        await registrarAuditoria(transaction, {
            accion: 'TRANSFERIR',
            idCuentaAtencion: idAtencion,
            idPaciente: contexto.IdPaciente || idPaciente,
            paciente: contexto.Paciente,
            idCama: null,
            cama: null,
            camaAnterior,
            idServicio: contexto.IdServicioEstancia || Number(idServicio),
            servicio: contexto.Servicio,
            idUsuario: idUsuario || idEmpleado,
            usuario,
            detalle: 'Transferencia de servicio (queda sin cama)',
        });

        await transaction.commit();
        return { success: true };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    getPacientesSinCama,
    asignarCama,
    moverPacienteDeCama,
    registrarTransferenciaEstancia,
    getAuditoriaCamas,
};
