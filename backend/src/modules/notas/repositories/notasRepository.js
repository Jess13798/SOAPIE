const sql = require('mssql');
const dbHelper = require('../../../../dbHelper');
const facturacionAnulacionRepository = require('../../facturacion/repositories/facturacionAnulacionRepository');
const { registrarAuditoria } = require('../../../core/utils/auditoria');
const facturacionRepository = require('../../facturacion/repositories/facturacionServicioDespachoRepository');
const facturacionFinanciamientosRepository = require('../../facturacion/repositories/facturacionServicioFinanciamientosRepository');
const facturacionPagosRepository = require('../../facturacion/repositories/facturacionPagosRepository');
const cuentasAtencionRepository = require('../../facturacion/repositories/facturacionCuentasAtencionRepository');

const ID_PUNTO_CARGA_CPT = 1; // GalenHos registra los CPT como "Consumo en el Servicio"
const ID_TIPO_FINANCIAMIENTO_FALLBACK = 16; // Estrategia, igual que GalenHos

const NOTA_NOT_FOUND = 'NOTA_NOT_FOUND';
const CARE_PLAN_RELATION_INVALID = 'CARE_PLAN_RELATION_INVALID';

function createRepositoryError(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
}

function bindNota(request, nota) {
    request.input('idCuenta', sql.Int, nota.idCuenta);
    request.input('idPaciente', sql.Int, nota.idPaciente);
    request.input('idEmpleado', sql.Int, nota.idEmpleado);
    request.input('idServicio', sql.Int, nota.idServicio);
    request.input('turno', sql.VarChar(10), nota.turno);
    request.input('fechaInicio', sql.DateTime, nota.fechaInicio);
    request.input('fechaFin', sql.DateTime, nota.fechaFin);
    request.input('subjetivo', sql.NVarChar(sql.MAX), nota.subjetivo);
    request.input('objetivo', sql.NVarChar(sql.MAX), nota.objetivo);
    request.input('analisis', sql.NVarChar(sql.MAX), nota.analisis);
    request.input('plan', sql.NVarChar(sql.MAX), nota.plan);
    request.input('wongBakerScore', sql.TinyInt, nota.wongBakerScore);
    request.input('intervencion', sql.NVarChar(sql.MAX), nota.intervencion);
    request.input('evaluacion', sql.NVarChar(sql.MAX), nota.evaluacion);
}

function bindVitales(request, signosVitales, metadata) {
    request.input('idPacienteVital', sql.Int, metadata.idPaciente);
    request.input('idCuentaVital', sql.Int, metadata.idCuenta);
    request.input('fechaVital', sql.DateTime, metadata.fechaHora);
    request.input('idEmpleadoVital', sql.Int, metadata.idEmpleado);
    request.input('peso', sql.Decimal(5, 2), signosVitales.peso);
    request.input('talla', sql.Decimal(5, 2), signosVitales.talla);
    request.input('pCefalico', sql.Decimal(5, 2), signosVitales.pCefalico);
    request.input('pAbdominal', sql.Decimal(5, 2), signosVitales.pAbdominal);
    request.input('hemoglucotest', sql.Decimal(5, 2), signosVitales.hemoglucotest);
    request.input('presionArterial', sql.VarChar(10), signosVitales.presionArterial);
    request.input('frecuenciaCardiaca', sql.Int, signosVitales.frecuenciaCardiaca);
    request.input('frecuenciaRespiratoria', sql.Int, signosVitales.frecuenciaRespiratoria);
    request.input('temperatura', sql.Decimal(4, 2), signosVitales.temperatura);
    request.input('saturacion', sql.Int, signosVitales.saturacionOxigeno);
}

async function guardarNotaCompleta(nota) {
    const pool = await dbHelper.getPool();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        let idNota = nota.idNota;
        let servicioId = null;
        let fechaHoraInicio;
        let fechaHoraFin;
        const isNewNote = !idNota;
        const notaRequest = transaction.request();
        bindNota(notaRequest, nota);

        if (idNota) {
            notaRequest.input('idNota', sql.Int, idNota);
            // El turno y la hora de inicio se fijan al crear la nota y NO se
            // tocan al editarla: el turno depende de cuándo se hizo la hoja.
            const updateResult = await notaRequest.query(`
                UPDATE dbo.NotaEnfermeria
                SET IdCuenta = @idCuenta,
                    IdPaciente = @idPaciente,
                    IdEmpleado = @idEmpleado,
                    Fecha_Hora_Fin = @fechaFin,
                    Subjetivo = @subjetivo,
                    Objetivo = @objetivo,
                    Analisis = @analisis,
                    Plan_ = @plan,
                    WongBakerScore = @wongBakerScore,
                    Intervencion = @intervencion,
                    Evaluacion = @evaluacion
                OUTPUT INSERTED.IdServicio AS IdServicio,
                       INSERTED.Fecha_Hora_Inicio AS FechaHoraInicio,
                       INSERTED.Fecha_Hora_Fin AS FechaHoraFin
                WHERE IdNotaEnfermeria = @idNota;
            `);

            if (updateResult.rowsAffected[0] === 0) {
                throw createRepositoryError(NOTA_NOT_FOUND, 'La nota SOAPIE solicitada no existe.');
            }
            // El servicio no se toca al editar: la nota pertenece al servicio
            // donde se escribió, aunque el paciente ya se haya trasladado.
            servicioId = updateResult.recordset[0]?.IdServicio ?? null;
            fechaHoraInicio = updateResult.recordset[0]?.FechaHoraInicio;
            fechaHoraFin = updateResult.recordset[0]?.FechaHoraFin;
        } else {
            const insertResult = await notaRequest.query(`
                -- El servicio se toma de la estancia abierta del paciente.
                -- Si no hay estancia abierta (paciente sin cama), se usa el
                -- servicio que envía la pantalla.
                DECLARE @servicioNota INT = NULL;

                IF @idCuenta IS NOT NULL
                BEGIN
                    SELECT TOP (1) @servicioNota = eh.IdServicio
                    FROM dbo.AtencionesEstanciaHospitalaria AS eh
                    INNER JOIN dbo.Atenciones AS a
                        ON a.IdAtencion = eh.IdAtencion
                    WHERE a.IdCuentaAtencion = @idCuenta
                      AND eh.FechaDesocupacion IS NULL
                    ORDER BY eh.Secuencia DESC;
                END

                IF @servicioNota IS NULL SET @servicioNota = @idServicio;

                INSERT INTO dbo.NotaEnfermeria (
                    IdCuenta, IdPaciente, IdEmpleado, Turno, IdServicio,
                    Fecha_Hora_Inicio, Fecha_Hora_Fin, Subjetivo, Objetivo,
                    Analisis, Plan_, WongBakerScore, Intervencion, Evaluacion
                )
                OUTPUT INSERTED.IdNotaEnfermeria AS IdNotaEnfermeria,
                       INSERTED.IdServicio AS IdServicio,
                       INSERTED.Fecha_Hora_Inicio AS FechaHoraInicio,
                       INSERTED.Fecha_Hora_Fin AS FechaHoraFin
                VALUES (
                    @idCuenta, @idPaciente, @idEmpleado, @turno, @servicioNota,
                    @fechaInicio, @fechaFin, @subjetivo, @objetivo,
                    @analisis, @plan, @wongBakerScore, @intervencion, @evaluacion
                );
            `);
            idNota = insertResult.recordset[0].IdNotaEnfermeria;
            servicioId = insertResult.recordset[0].IdServicio ?? null;
            fechaHoraInicio = insertResult.recordset[0].FechaHoraInicio;
            fechaHoraFin = insertResult.recordset[0].FechaHoraFin;
        }

        let vitalesRegistrados = isNewNote;
        if (!isNewNote) {
            const latestVitalsRequest = transaction.request();
            latestVitalsRequest.input('idNotaVitalAnterior', sql.Int, idNota);
            const latestVitalsResult = await latestVitalsRequest.query(`
                SELECT TOP (1)
                    Peso,
                    Talla,
                    P_Cefalico,
                    P_Abdominal,
                    Hemoglucotest,
                    Presion_Arterial,
                    Frec_Cardiaca,
                    Frec_Respiratoria,
                    Temperatura,
                    Saturacion
                FROM dbo.NotaEnfermeriaSignosVitales WITH (UPDLOCK, HOLDLOCK)
                WHERE IdNotaEnfermeria = @idNotaVitalAnterior
                ORDER BY Fecha_Hora DESC, IdSignoVital DESC;
            `);
            const latestVitals = latestVitalsResult.recordset[0];
            vitalesRegistrados = latestVitals
                ? !sameVitales(latestVitals, nota.signosVitales)
                : hasVitalValues(nota.signosVitales);
        }

        if (vitalesRegistrados) {
            const vitalRequest = transaction.request();
            vitalRequest.input('idNotaVital', sql.Int, idNota);
            bindVitales(vitalRequest, nota.signosVitales, nota);
            await vitalRequest.query(`
                INSERT INTO dbo.NotaEnfermeriaSignosVitales (
                    IdNotaEnfermeria, IdPaciente, IdCuentaatencion, Fecha_Hora,
                    IdEmpleado, Peso, Talla, P_Cefalico, P_Abdominal, Hemoglucotest,
                    Presion_Arterial, Frec_Cardiaca, Frec_Respiratoria,
                    Temperatura, Saturacion
                )
                VALUES (
                    @idNotaVital, @idPacienteVital, @idCuentaVital, @fechaVital,
                    @idEmpleadoVital, @peso, @talla, @pCefalico, @pAbdominal, @hemoglucotest,
                    @presionArterial, @frecuenciaCardiaca, @frecuenciaRespiratoria,
                    @temperatura, @saturacion
                );
            `);
        }

        // Consultar servicios planificados existentes para detectar cuáles se eliminaron
        // o conservar los IdOrden ya creados en GalenHos (evita duplicar órdenes y permite anular)
        const serviciosExistentesReq = transaction.request();
        serviciosExistentesReq.input('idNotaServiciosExistentes', sql.Int, idNota);
        let serviciosPrevios = [];
        try {
            const resPrev = await serviciosExistentesReq.query(`
                SELECT IdProducto, IdOrden
                FROM dbo.NotaEnfermeriaPlanServicio
                WHERE IdNotaEnfermeria = @idNotaServiciosExistentes;
            `);
            serviciosPrevios = resPrev.recordset || [];
        } catch {
            // En bases donde la tabla aún no existe o está migrando
        }

        const mapaPrevios = new Map();
        for (const prev of serviciosPrevios) {
            mapaPrevios.set(Number(prev.IdProducto), prev.IdOrden ? Number(prev.IdOrden) : null);
        }

        const productosNuevosSet = new Set(nota.serviciosPlanificados.map(id => Number(id)));

        // Anular en GalenHos las órdenes de servicios CPT que fueron retirados del plan
        for (const [idProdPrev, idOrdenPrev] of mapaPrevios.entries()) {
            if (!productosNuevosSet.has(idProdPrev) && idOrdenPrev) {
                try {
                    await facturacionAnulacionRepository.anularOrdenServicio({
                        idOrden: idOrdenPrev,
                        idEmpleado: nota.idEmpleado || 1,
                        observaciones: `CPT ${idProdPrev} eliminado de nota SOAPIE ${idNota}`,
                    }, transaction);
                } catch (errAnul) {
                    console.error(`Error al anular orden ${idOrdenPrev} en GalenHos:`, errAnul.message);
                }
            }
        }

        const serviciosRequest = transaction.request();
        serviciosRequest.input('idNotaPlanServicio', sql.Int, idNota);
        await serviciosRequest.query(`
            DELETE FROM dbo.NotaEnfermeriaPlanServicio
            WHERE IdNotaEnfermeria = @idNotaPlanServicio;
        `);

        // GalenHos despacha cada CPT contra el diagnóstico principal de la
        // atención (el de subclasificación 'D'). Se resuelve una sola vez por
        // nota y se comparte entre todos los servicios planificados.
        let idDiagnosticoPrincipal = null;
        let financiamientoCuenta = null;
        if (nota.idCuenta && nota.serviciosPlanificados.length > 0) {
            try {
                idDiagnosticoPrincipal = await obtenerIdAtencionDiagnosticoPrincipal(transaction, nota.idCuenta);
            } catch (error) {
                // Si la atención no tiene diagnósticos registrados, el despacho
                // se hace con idDiagnostico NULL como antes.
                console.warn('No se pudo resolver el diagnóstico principal de la atención:', error.message);
            }

            // La cuenta define si el CPT va a pagos (particular) o a
            // financiamientos (SIS, SOAT, estrategia, convenios).
            financiamientoCuenta = await cuentasAtencionRepository.obtenerFinanciamientoCuenta(
                nota.idCuenta,
                transaction,
            );
        }
        for (const idProducto of nota.serviciosPlanificados) {
            const idOrdenExistente = mapaPrevios.get(Number(idProducto)) || null;
            await insertarServicioPlanificado(
                transaction,
                idNota,
                idProducto,
                nota,
                idDiagnosticoPrincipal,
                idOrdenExistente,
                financiamientoCuenta,
            );
        }

        // Vincular balances hídricos que se hayan creado en la misma atención
        // mientras la nota aún no tenía IdNota generado (evita duplicados o nulos).
        if (nota.idPaciente) {
            try {
                const balanceRequest = transaction.request();
                balanceRequest.input('idNotaBalance', sql.Int, idNota);
                balanceRequest.input('idPacienteBalance', sql.Int, nota.idPaciente);
                balanceRequest.input('idCuentaBalance', sql.Int, nota.idCuenta || null);
                balanceRequest.input('fechaNotaBalance', sql.Date, fechaHoraInicio || new Date());
                await balanceRequest.query(`
                    IF OBJECT_ID(N'dbo.BalanceHidrico', N'U') IS NOT NULL
                    BEGIN
                        UPDATE dbo.BalanceHidrico
                        SET IdNota = @idNotaBalance
                        WHERE IdPaciente = @idPacienteBalance
                          AND (IdCuenta = @idCuentaBalance OR (@idCuentaBalance IS NULL AND IdCuenta IS NULL))
                          AND Fecha = @fechaNotaBalance
                          AND IdNota IS NULL;
                    END
                `);
            } catch {
                // No rompe la nota si la tabla de balance aún no existe
            }
        }

        const carePlanRequest = transaction.request();
        carePlanRequest.input('idNotaCarePlan', sql.Int, idNota);
        await carePlanRequest.query(`
            DELETE FROM dbo.NotaEnfermeriaPlanNOC
            WHERE IdNotaEnfermeria = @idNotaCarePlan;

            DELETE FROM dbo.NotaEnfermeriaPlanNIC
            WHERE IdNotaEnfermeria = @idNotaCarePlan;

            DELETE FROM dbo.NotaEnfermeriaDiagnostico
            WHERE IdNotaEnfermeria = @idNotaCarePlan;
        `);

        for (const diagnosis of nota.planCuidados) {
            await saveDiagnosis(transaction, idNota, diagnosis.idNANDA, diagnosis.comentario);

            for (const idNOC of diagnosis.nocIds) {
                await insertCarePlanNoc(
                    transaction,
                    idNota,
                    diagnosis.idNANDA,
                    idNOC,
                    diagnosis.nocMetas[idNOC] || null,
                    diagnosis.nocEvaluaciones[idNOC] || null,
                );
            }
            for (const idNIC of diagnosis.nicIds) {
                await insertCarePlanNic(
                    transaction,
                    idNota,
                    diagnosis.idNANDA,
                    idNIC,
                    diagnosis.nicRealizadasIds.includes(idNIC),
                    diagnosis.nicNoRealizadas[idNIC] || null,
                );
            }
        }

        await transaction.commit();
        return {
            id: idNota,
            vitalesRegistrados,
            servicioId,
            fechaHoraInicio,
            fechaHoraFin,
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

function sameVitales(existing, current) {
    const fields = [
        ['Peso', 'peso'],
        ['Talla', 'talla'],
        ['P_Cefalico', 'pCefalico'],
        ['P_Abdominal', 'pAbdominal'],
        ['Hemoglucotest', 'hemoglucotest'],
        ['Frec_Cardiaca', 'frecuenciaCardiaca'],
        ['Frec_Respiratoria', 'frecuenciaRespiratoria'],
        ['Temperatura', 'temperatura'],
        ['Saturacion', 'saturacionOxigeno'],
    ];

    return fields.every(([databaseField, noteField]) => {
        const existingValue = existing[databaseField];
        const currentValue = current[noteField];
        if (existingValue === null || existingValue === undefined || currentValue === null || currentValue === undefined) {
            return (existingValue === null || existingValue === undefined)
                && (currentValue === null || currentValue === undefined);
        }
        return Number(existingValue) === Number(currentValue);
    }) && (existing.Presion_Arterial || null) === (current.presionArterial || null);
}

function hasVitalValues(vitals) {
    return Object.values(vitals).some(value => value !== null && value !== undefined && value !== '');
}

async function saveDiagnosis(transaction, idNota, idNANDA, comentario) {
    const request = transaction.request();
    request.input('idNotaComentario', sql.Int, idNota);
    request.input('idNANDAComentario', sql.Int, idNANDA);
    request.input('comentarioNANDA', sql.NVarChar(1000), comentario);
    await request.query(`
        UPDATE dbo.NotaEnfermeriaDiagnostico
        SET Comentario = @comentarioNANDA
        WHERE IdNotaEnfermeria = @idNotaComentario
          AND IdNANDA = @idNANDAComentario;

        IF @@ROWCOUNT = 0
        BEGIN
            INSERT INTO dbo.NotaEnfermeriaDiagnostico (
                IdNotaEnfermeria, IdNANDA, Comentario
            )
            VALUES (@idNotaComentario, @idNANDAComentario, @comentarioNANDA);
        END;
    `);
}

async function obtenerIdAtencionDiagnosticoPrincipal(transaction, idCuenta) {
    const request = transaction.request();
    request.input('idCuentaDiagnostico', sql.Int, idCuenta);
    const result = await request.query(`
        SELECT TOP (1) ad.IdAtencionDiagnostico
        FROM dbo.Atenciones AS a
        INNER JOIN dbo.AtencionesDiagnosticos AS ad
            ON ad.IdAtencion = a.IdAtencion
        INNER JOIN dbo.SubclasificacionDiagnosticos AS s
            ON s.IdSubclasificacionDx = ad.IdSubclasificacionDx
        WHERE a.IdCuentaAtencion = @idCuentaDiagnostico
        ORDER BY
            CASE s.Codigo
                WHEN 'D' THEN 1
                WHEN 'R' THEN 2
                WHEN 'P' THEN 3
                ELSE 4
            END,
            ad.IdAtencionDiagnostico;
    `);
    // FacturacionServicioDespacho.idDiagnostico guarda el IdAtencionDiagnostico,
    // no el IdDiagnostico del catálogo (así lo relaciona GalenHos).
    return result.recordset?.[0]?.IdAtencionDiagnostico ?? null;
}

async function insertarServicioPlanificado(
    transaction,
    idNota,
    idProducto,
    metadata = {},
    idDiagnosticoPrincipal = null,
    idOrdenExistente = null,
    financiamiento = null,
) {
    let idOrdenAsignado = idOrdenExistente;

    // Si la atención tiene IdCuenta y aún no tenía IdOrden, generamos la orden
    // oficial en GalenHos con las mismas relaciones que usa el escritorio.
    if (metadata.idCuenta && !idOrdenAsignado) {
        const idTipoFinanciamiento = Number(financiamiento?.idTipoFinanciamiento)
            || ID_TIPO_FINANCIAMIENTO_FALLBACK;
        const idFuenteFinanciamiento = financiamiento?.idFuenteFinanciamiento ?? null;
        const generaPago = Number(financiamiento?.generaPago) === 1;

        // El precio se valida antes de crear la orden: GalenHos no registra un
        // CPT sin precio válido (salvo que el catálogo permita usarlo sin precio).
        const precioRequest = transaction.request();
        precioRequest.input('idProductoDespacho', sql.Int, idProducto);
        precioRequest.input('idTipoFinanciamientoDespacho', sql.Int, idTipoFinanciamiento);
        const precioResult = await precioRequest.query(`
            SELECT PrecioUnitario, SeUsaSinPrecio
            FROM dbo.FactCatalogoServiciosHosp
            WHERE IdProducto = @idProductoDespacho
              AND IdTipoFinanciamiento = @idTipoFinanciamientoDespacho
              AND Activo = 1;
        `);
        const filaPrecio = precioResult.recordset?.[0] || null;
        const precio = Number(filaPrecio?.PrecioUnitario) || 0;
        const usaSinPrecio = Boolean(filaPrecio?.SeUsaSinPrecio);
        const precioValido = Boolean(filaPrecio) && (precio > 0 || usaSinPrecio);

        if (!precioValido) {
            // Se conserva el CPT en la nota, pero sin orden en GalenHos.
            console.warn(
                `CPT ${idProducto} sin precio válido para el financiamiento ${idTipoFinanciamiento}; no se crea la orden.`,
            );
        } else {
            const galenRequest = transaction.request();
            galenRequest.output('IdOrden', sql.Int);
            // GalenHos registra los CPT como "Consumo en el Servicio".
            galenRequest.input('IdPuntoCarga', sql.Int, ID_PUNTO_CARGA_CPT);
            galenRequest.input('IdPaciente', sql.Int, metadata.idPaciente);
            galenRequest.input('IdCuentaAtencion', sql.Int, metadata.idCuenta);
            galenRequest.input('IdServicioPaciente', sql.Int, metadata.idServicio || null);
            galenRequest.input('idTipoFinanciamiento', sql.Int, idTipoFinanciamiento);
            galenRequest.input('idFuenteFinanciamiento', sql.Int, idFuenteFinanciamiento);
            galenRequest.input('FechaCreacion', sql.DateTime, metadata.fechaInicio || new Date());
            galenRequest.input('IdUsuario', sql.Int, metadata.idEmpleado || 1);
            galenRequest.input('FechaDespacho', sql.DateTime, metadata.fechaInicio || new Date());
            galenRequest.input('IdUsuarioDespacho', sql.Int, metadata.idEmpleado || 1);
            galenRequest.input('IdEstadoFacturacion', sql.Int, 1);
            galenRequest.input('FechaHoraRealizaCpt', sql.DateTime, metadata.fechaInicio || new Date());
            galenRequest.input('IdUsuarioAuditoria', sql.Int, metadata.idEmpleado || 1);

            const spResult = await galenRequest.execute('dbo.FactOrdenServicioAgregar1');
            const idOrden = spResult.output?.IdOrden;

            if (!idOrden) {
                throw createRepositoryError(
                    'ORDEN_SERVICIO_NO_CREADA',
                    `GalenHos no devolvió la orden del CPT ${idProducto}.`,
                );
            }

            idOrdenAsignado = idOrden;

            // Despacho oficial del CPT mediante el procedimiento de SIGH.
            await facturacionRepository.agregarServicioDespacho({
                idOrden,
                idProducto,
                cantidad: 1,
                precio,
                total: precio,
                labConfHIS: '',
                grupoHIS: 0,
                subGrupoHIS: 0,
                idUsuarioAuditoria: metadata.idEmpleado || 1,
                idReceta: metadata.idReceta ?? null,
                // GalenHos relaciona el despacho con AtencionesDiagnosticos.
                idDiagnostico: idDiagnosticoPrincipal ?? null,
            }, transaction);

            if (generaPago) {
                // Particular (Tarifa A, etc.): cabecera y detalle de pago.
                const idOrdenPago = await facturacionPagosRepository.agregarOrdenServicioPago({
                    idComprobantePago: null,
                    idOrden,
                    fechaCreacion: metadata.fechaInicio || new Date(),
                    idUsuario: metadata.idEmpleado || 1,
                    idEstadoFacturacion: 1,
                    importeExonerado: 0,
                    idUsuarioExonera: null,
                    idUsuarioAuditoria: metadata.idEmpleado || 1,
                }, transaction);

                if (!idOrdenPago) {
                    throw createRepositoryError(
                        'ORDEN_PAGO_NO_CREADA',
                        `GalenHos no devolvió el pago del CPT ${idProducto}.`,
                    );
                }

                await facturacionPagosRepository.agregarServicioPago({
                    idOrdenPago,
                    idProducto,
                    cantidad: 1,
                    precio,
                    total: precio,
                    idUsuarioAuditoria: metadata.idEmpleado || 1,
                }, transaction);
            } else {
                // SIS, SOAT, estrategia, convenios, etc.: parte financiada.
                await facturacionFinanciamientosRepository.agregarServicioFinanciamiento({
                    idOrden,
                    idProducto,
                    idTipoFinanciamiento,
                    idFuenteFinanciamiento,
                    cantidadFinanciada: 1,
                    precioFinanciado: precio,
                    totalFinanciado: precio,
                    fechaAutoriza: metadata.fechaInicio || new Date(),
                    idUsuarioAutoriza: metadata.idEmpleado || 1,
                    idUsuarioAuditoria: metadata.idEmpleado || 1,
                }, transaction);
            }

            // Registro oficial de auditoría en GalenHos para la orden creada
            await registrarAuditoria({
                idEmpleado: metadata.idEmpleado,
                accion: 'A',
                idRegistro: idOrden,
                tabla: 'FactOrdenServicio',
                idListItem: 0,
                observaciones: `CPT ${idProducto} registrado desde nota enfermeria`,
            }, transaction);

            // Actualizar los consumos acumulados en FacturacionCuentasAtencionPtos
            // usando el mismo punto de carga de la orden (1 = Consumo en el Servicio).
            if (precio > 0) {
                const ptosRequest = transaction.request();
                ptosRequest.input('idCuentaConsumo', sql.Int, metadata.idCuenta);
                ptosRequest.input('idPtoCargaConsumo', sql.Int, ID_PUNTO_CARGA_CPT);
                const ptosResult = await ptosRequest.query(`
                    SELECT TotalConsumos
                    FROM dbo.FacturacionCuentasAtencionPtos WITH (UPDLOCK, HOLDLOCK)
                    WHERE IdCuentaAtencion = @idCuentaConsumo
                      AND idPuntoCarga = @idPtoCargaConsumo;
                `);

                const existePto = ptosResult.recordset && ptosResult.recordset.length > 0;
                const totalActual = existePto ? Number(ptosResult.recordset[0].TotalConsumos) || 0 : 0;
                const nuevoTotal = totalActual + precio;

                await cuentasAtencionRepository.actualizarCuentasAtencionPtos({
                    esNueva: !existePto,
                    idCuentaAtencion: metadata.idCuenta,
                    idPuntoCarga: ID_PUNTO_CARGA_CPT,
                    totalConsumos: nuevoTotal,
                    totalPagos: 0,
                    totalPagosReembolso: 0,
                }, transaction);
            }
        }
    }

    const request = transaction.request();
    request.input('idNotaPlanServicio', sql.Int, idNota);
    request.input('idProductoPlanServicio', sql.Int, idProducto);
    request.input('idOrdenPlanServicio', sql.Int, idOrdenAsignado || null);
    const result = await request.query(`
        INSERT INTO dbo.NotaEnfermeriaPlanServicio (
            IdNotaEnfermeria, IdProducto, CodigoServicio, NombreServicio, IdOrden
        )
        SELECT
            @idNotaPlanServicio,
            servicio.IdProducto,
            servicio.Codigo,
            servicio.Nombre,
            @idOrdenPlanServicio
        FROM dbo.FactCatalogoServicios AS servicio
        WHERE servicio.IdProducto = @idProductoPlanServicio
          AND servicio.idEstado = 1;

        SELECT @@ROWCOUNT AS FilasInsertadas;
    `);

    if (result.recordset[0].FilasInsertadas !== 1) {
        throw createRepositoryError(
            'PLAN_SERVICE_INVALID',
            'Uno de los servicios seleccionados no existe o ya no está activo en el catálogo.',
        );
    }
}

async function insertCarePlanNoc(transaction, idNota, idNANDA, idNOC, meta, resultadoObservado) {
    const request = transaction.request();
    request.input('idNotaCarePlan', sql.Int, idNota);
    request.input('idNANDA', sql.Int, idNANDA);
    request.input('idNOC', sql.Int, idNOC);
    request.input('metaNOC', sql.NVarChar(250), meta);
    request.input('resultadoObservadoNOC', sql.NVarChar(500), resultadoObservado);

    const result = await request.query(`
        IF EXISTS (
            SELECT 1
            FROM dbo.Catalogo_NANDA AS n
            INNER JOIN dbo.NANDA_Interrelacion AS r
                ON r.IdNANDA = n.IdNANDA
            INNER JOIN dbo.Catalogo_NOC AS c
                ON c.IdNOC = r.IdNOC
               AND c.EsActivo = 1
            WHERE n.IdNANDA = @idNANDA
              AND n.EsActivo = 1
              AND r.IdNOC = @idNOC
        )
        BEGIN
            INSERT INTO dbo.NotaEnfermeriaPlanNOC (
                IdNotaEnfermeria, IdNANDA, IdNOC, Meta, ResultadoObservado
            )
            VALUES (
                @idNotaCarePlan, @idNANDA, @idNOC, @metaNOC, @resultadoObservadoNOC
            );
            SELECT CAST(1 AS bit) AS Guardado;
        END
        ELSE
        BEGIN
            SELECT CAST(0 AS bit) AS Guardado;
        END;
    `);

    if (!result.recordset[0].Guardado) {
        throw createRepositoryError(
            CARE_PLAN_RELATION_INVALID,
            'Una selección NANDA, NOC o NIC ya no está activa o no corresponde a la interrelación del catálogo.'
        );
    }
}

async function insertCarePlanNic(transaction, idNota, idNANDA, idNIC, realizada, motivo) {
    const request = transaction.request();
    request.input('idNotaCarePlan', sql.Int, idNota);
    request.input('idNANDA', sql.Int, idNANDA);
    request.input('idNIC', sql.Int, idNIC);
    request.input('nicRealizada', sql.Bit, realizada);
    request.input('nicMotivo', sql.NVarChar(500), realizada ? null : (motivo || null));

    const result = await request.query(`
        IF EXISTS (
            SELECT 1
            FROM dbo.Catalogo_NANDA AS n
            INNER JOIN dbo.NANDA_Interrelacion AS r
                ON r.IdNANDA = n.IdNANDA
            INNER JOIN dbo.Catalogo_NIC AS c
                ON c.IdNIC = r.IdNIC
               AND c.EsActivo = 1
            WHERE n.IdNANDA = @idNANDA
              AND n.EsActivo = 1
              AND r.IdNIC = @idNIC
        )
        BEGIN
            INSERT INTO dbo.NotaEnfermeriaPlanNIC (
                IdNotaEnfermeria, IdNANDA, IdNIC, Realizada, Motivo
            )
            VALUES (@idNotaCarePlan, @idNANDA, @idNIC, @nicRealizada, @nicMotivo);
            SELECT CAST(1 AS bit) AS Guardado;
        END
        ELSE
        BEGIN
            SELECT CAST(0 AS bit) AS Guardado;
        END;
    `);

    if (!result.recordset[0].Guardado) {
        throw createRepositoryError(
            CARE_PLAN_RELATION_INVALID,
            'Una selección NANDA, NOC o NIC ya no está activa o no corresponde a la interrelación del catálogo.'
        );
    }
}

const NOTAS_QUERY = `
    ;WITH PlanRows AS (
        SELECT
            IdNotaEnfermeria,
            IdNANDA,
            IdNOC,
            Meta,
            ResultadoObservado,
            CAST(NULL AS INT) AS IdNIC,
            CAST(NULL AS BIT) AS NICRealizada,
            CAST(NULL AS NVARCHAR(500)) AS NICMotivo
        FROM dbo.NotaEnfermeriaPlanNOC

        UNION ALL

        SELECT
            IdNotaEnfermeria,
            IdNANDA,
            CAST(NULL AS INT) AS IdNOC,
            CAST(NULL AS NVARCHAR(250)) AS Meta,
            CAST(NULL AS NVARCHAR(500)) AS ResultadoObservado,
            IdNIC,
            Realizada AS NICRealizada,
            Motivo AS NICMotivo
        FROM dbo.NotaEnfermeriaPlanNIC
    )
    SELECT
        n.IdNotaEnfermeria,
        n.IdCuenta,
        n.IdPaciente,
        n.IdEmpleado,
        n.IdServicio,
        servicio.Nombre AS Servicio,
        LTRIM(RTRIM(
            ISNULL(e.ApellidoPaterno, '') + ' ' +
            ISNULL(e.ApellidoMaterno, '') + ' ' +
            ISNULL(e.Nombres, '')
        )) AS Enfermera,
        n.Turno,
        n.Fecha_Hora_Inicio,
        n.Fecha_Hora_Fin,
        n.Subjetivo,
        n.Objetivo,
        n.Analisis,
        n.Plan_,
        n.WongBakerScore,
        n.Intervencion,
        n.Evaluacion,
        vital.IdSignoVital,
        vital.Peso,
        vital.Talla,
        vital.P_Cefalico,
        vital.P_Abdominal,
        vital.Hemoglucotest,
        vital.Presion_Arterial,
        vital.Frec_Cardiaca,
        vital.Frec_Respiratoria,
        vital.Temperatura,
        vital.Saturacion,
        diagnosticoNota.IdNANDA AS PlanIdNANDA,
        nanda.Codigo AS PlanCodigoNANDA,
        nanda.Diagnostico AS PlanDiagnosticoNANDA,
        diagnosticoNota.Comentario AS PlanComentarioNANDA,
        cuidado.IdNOC AS PlanIdNOC,
        noc.Codigo AS PlanCodigoNOC,
        noc.Resultado AS PlanResultadoNOC,
        noc.EscalaLikert AS PlanEscalaLikertNOC,
        cuidado.Meta AS PlanMetaNOC,
        cuidado.ResultadoObservado AS PlanResultadoObservadoNOC,
        cuidado.IdNIC AS PlanIdNIC,
        nic.Codigo AS PlanCodigoNIC,
        nic.Intervencion AS PlanIntervencionNIC,
        cuidado.NICRealizada AS PlanNICRealizada,
        cuidado.NICMotivo AS PlanNICMotivo,
        servicioPlan.IdProducto AS PlanServicioId,
        servicioPlan.CodigoServicio AS PlanServicioCodigo,
        servicioPlan.NombreServicio AS PlanServicioNombre,
        servicioPlan.IdOrden AS PlanServicioIdOrden
    FROM dbo.NotaEnfermeria AS n
    LEFT JOIN dbo.Empleados AS e
        ON e.IdEmpleado = n.IdEmpleado
    LEFT JOIN dbo.Servicios AS servicio
        ON servicio.IdServicio = n.IdServicio
    OUTER APPLY (
        SELECT TOP (1) sv.*
        FROM dbo.NotaEnfermeriaSignosVitales AS sv
        WHERE sv.IdNotaEnfermeria = n.IdNotaEnfermeria
        ORDER BY sv.Fecha_Hora DESC, sv.IdSignoVital DESC
    ) AS vital
    LEFT JOIN dbo.NotaEnfermeriaDiagnostico AS diagnosticoNota
        ON diagnosticoNota.IdNotaEnfermeria = n.IdNotaEnfermeria
    LEFT JOIN dbo.Catalogo_NANDA AS nanda
        ON nanda.IdNANDA = diagnosticoNota.IdNANDA
    LEFT JOIN PlanRows AS cuidado
        ON cuidado.IdNotaEnfermeria = diagnosticoNota.IdNotaEnfermeria
       AND cuidado.IdNANDA = diagnosticoNota.IdNANDA
    LEFT JOIN dbo.Catalogo_NOC AS noc
        ON noc.IdNOC = cuidado.IdNOC
    LEFT JOIN dbo.Catalogo_NIC AS nic
        ON nic.IdNIC = cuidado.IdNIC
    LEFT JOIN dbo.NotaEnfermeriaPlanServicio AS servicioPlan
        ON servicioPlan.IdNotaEnfermeria = n.IdNotaEnfermeria
`;

async function getAllNotas() {
    return dbHelper.query(`${NOTAS_QUERY} ORDER BY n.Fecha_Hora_Inicio DESC, n.IdNotaEnfermeria DESC;`);
}

async function getNotasPorPaciente(idPaciente) {
    return dbHelper.query(
        `${NOTAS_QUERY} WHERE n.IdPaciente = @idPaciente ORDER BY n.Fecha_Hora_Inicio DESC, n.IdNotaEnfermeria DESC;`,
        [{ name: 'idPaciente', type: sql.Int, value: idPaciente }]
    );
}

async function getHistorialVitals(idNota, limit = 10, offset = 0) {
    return dbHelper.query(`
        SELECT
            sv.IdSignoVital,
            sv.Fecha_Hora,
            sv.Peso,
            sv.Talla,
            sv.P_Cefalico,
            sv.P_Abdominal,
            sv.Hemoglucotest,
            sv.Presion_Arterial,
            sv.Frec_Cardiaca,
            sv.Frec_Respiratoria,
            sv.Temperatura,
            sv.Saturacion,
            sv.IdEmpleado,
            NULLIF(UPPER(LTRIM(RTRIM(
                ISNULL(empleado.ApellidoPaterno, '') + ' ' +
                ISNULL(empleado.ApellidoMaterno, '') + ' ' +
                ISNULL(empleado.Nombres, '')
            ))), '') AS NombreEmpleado,
            COUNT(*) OVER() AS TotalCount
        FROM dbo.NotaEnfermeriaSignosVitales AS sv
        LEFT JOIN dbo.Empleados AS empleado
            ON empleado.IdEmpleado = sv.IdEmpleado
        WHERE sv.IdNotaEnfermeria = @idNota
        ORDER BY sv.Fecha_Hora DESC, sv.IdSignoVital DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
    `, [
        { name: 'idNota', type: sql.Int, value: idNota },
        { name: 'offset', type: sql.Int, value: offset },
        { name: 'limit', type: sql.Int, value: limit },
    ]);
}

async function getHistorialVitalsPorAtencion(idCuenta, limit = 10, offset = 0) {
    return dbHelper.query(`
        SELECT
            sv.IdSignoVital,
            sv.Fecha_Hora,
            sv.Peso,
            sv.Talla,
            sv.P_Cefalico,
            sv.P_Abdominal,
            sv.Hemoglucotest,
            sv.Presion_Arterial,
            sv.Frec_Cardiaca,
            sv.Frec_Respiratoria,
            sv.Temperatura,
            sv.Saturacion,
            sv.IdEmpleado,
            NULLIF(UPPER(LTRIM(RTRIM(
                ISNULL(empleado.ApellidoPaterno, '') + ' ' +
                ISNULL(empleado.ApellidoMaterno, '') + ' ' +
                ISNULL(empleado.Nombres, '')
            ))), '') AS NombreEmpleado,
            COUNT(*) OVER() AS TotalCount
        FROM dbo.NotaEnfermeriaSignosVitales AS sv
        LEFT JOIN dbo.Empleados AS empleado
            ON empleado.IdEmpleado = sv.IdEmpleado
        WHERE sv.IdCuentaatencion = @idCuenta
        ORDER BY sv.Fecha_Hora DESC, sv.IdSignoVital DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
    `, [
        { name: 'idCuenta', type: sql.Int, value: idCuenta },
        { name: 'offset', type: sql.Int, value: offset },
        { name: 'limit', type: sql.Int, value: limit },
    ]);
}

async function deleteNotaById(idNota, idEmpleado = 1) {
    const pool = await dbHelper.getPool();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        // Anular en GalenHos todos los CPTs asociados a esta nota antes de eliminarlos
        const ordenesRequest = transaction.request();
        ordenesRequest.input('idNotaOrdenes', sql.Int, idNota);
        let ordenesResult;
        try {
            ordenesResult = await ordenesRequest.query(`
                SELECT IdOrden
                FROM dbo.NotaEnfermeriaPlanServicio
                WHERE IdNotaEnfermeria = @idNotaOrdenes AND IdOrden IS NOT NULL;
            `);
        } catch {
            // Tabla no presente en versiones previas de BD
        }

        for (const row of (ordenesResult?.recordset || [])) {
            if (row.IdOrden) {
                await facturacionAnulacionRepository.anularOrdenServicio({
                    idOrden: Number(row.IdOrden),
                    idEmpleado: idEmpleado || 1,
                    observaciones: `Eliminación total de nota SOAPIE ${idNota}`,
                }, transaction);
            }
        }

        const request = transaction.request();
        request.input('idNota', sql.Int, idNota);
        await request.query(`
            DELETE FROM dbo.NotaEnfermeriaSignosVitales
            WHERE IdNotaEnfermeria = @idNota;

            DELETE FROM dbo.NotaEnfermeriaPlanServicio
            WHERE IdNotaEnfermeria = @idNota;

            DELETE FROM dbo.NotaEnfermeriaPlanNOC
            WHERE IdNotaEnfermeria = @idNota;

            DELETE FROM dbo.NotaEnfermeriaPlanNIC
            WHERE IdNotaEnfermeria = @idNota;

            DELETE FROM dbo.NotaEnfermeriaDiagnostico
            WHERE IdNotaEnfermeria = @idNota;

            DELETE FROM dbo.NotaEnfermeria
            WHERE IdNotaEnfermeria = @idNota;
        `);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

module.exports = {
    guardarNotaCompleta,
    getNotasPorPaciente,
    getAllNotas,
    getHistorialVitals,
    getHistorialVitalsPorAtencion,
    deleteNotaById,
    CARE_PLAN_RELATION_INVALID,
    NOTA_NOT_FOUND,
};
