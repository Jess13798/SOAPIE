// Propósito: Acceso a datos del módulo "notas".
// Responsable de mantener separadas las reglas de este archivo.

const sql = require('mssql');
const dbHelper = require('../../../../dbHelper');
const facturacionAnulacionRepository = require('../../facturacion/repositories/facturacionAnulacionRepository');
const { registrarAuditoria } = require('../../../core/utils/auditoria');
const facturacionRepository = require('../../facturacion/repositories/facturacionServicioDespachoRepository');
const facturacionFinanciamientosRepository = require('../../facturacion/repositories/facturacionServicioFinanciamientosRepository');
const facturacionPagosRepository = require('../../facturacion/repositories/facturacionPagosRepository');
const cuentasAtencionRepository = require('../../facturacion/repositories/facturacionCuentasAtencionRepository');

const ID_PUNTO_CARGA_FALLBACK = 716; // Hospitalización Medicina por defecto si no viene servicio

function resolverPuntoCargaServicio(idServicio) {
    if (!idServicio) return ID_PUNTO_CARGA_FALLBACK;
    const num = Number(idServicio);
    // En GalenHos, el Punto de Carga de hospitalización es IdServicio + 500
    // (Pediatría 213 -> 713, Medicina 216 -> 716, Cirugía 218 -> 718, etc.)
    return num > 0 ? num + 500 : ID_PUNTO_CARGA_FALLBACK;
}
const ID_TIPO_FINANCIAMIENTO_FALLBACK = 16; // Estrategia, igual que GalenHos

const NOTA_NOT_FOUND = 'NOTA_NOT_FOUND';
const NOTA_NO_AUTORIZADA = 'NOTA_NO_AUTORIZADA';
const CARE_PLAN_RELATION_INVALID = 'CARE_PLAN_RELATION_INVALID';

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
 * Implementa la operación "bindNota".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


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

/**
 * Implementa la operación "bindVitales".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


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

/**
 * Implementa la operación "guardarNotaCompleta".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


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
                WHERE IdNotaEnfermeria = @idNota
                  AND IdEmpleado = @idEmpleado
                  AND Fecha_Hora_Fin IS NULL;
            `);

            if (updateResult.rowsAffected[0] === 0) {
                throw createRepositoryError(
                    NOTA_NO_AUTORIZADA,
                    'Solo la enfermera que creó la nota puede editarla o firmarla.',
                );
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
        const resPrev = await serviciosExistentesReq.query(`
            SELECT
                servicioPlan.IdProducto,
                servicioPlan.IdOrden,
                servicioPlan.Cantidad,
                servicioPlan.IdAtencionDiagnostico,
                servicioPlan.CodigoCIE10,
                orden.IdEstadoFacturacion
            FROM dbo.NotaEnfermeriaPlanServicio AS servicioPlan
            LEFT JOIN dbo.FactOrdenServicio AS orden
                ON orden.IdOrden = servicioPlan.IdOrden
            WHERE servicioPlan.IdNotaEnfermeria = @idNotaServiciosExistentes;
        `);
        const serviciosPrevios = resPrev.recordset || [];

        const mapaPrevios = new Map();
        for (const prev of serviciosPrevios) {
            mapaPrevios.set(Number(prev.IdProducto), {
                idOrden: prev.IdOrden ? Number(prev.IdOrden) : null,
                cantidad: Number(prev.Cantidad) || 1,
                idAtencionDiagnostico: prev.IdAtencionDiagnostico == null
                    ? null
                    : Number(prev.IdAtencionDiagnostico),
                codigoCIE10: prev.CodigoCIE10 || null,
                estadoFacturacion: prev.IdEstadoFacturacion == null
                    ? null
                    : Number(prev.IdEstadoFacturacion),
            });
        }

        const productosNuevosSet = new Set(nota.serviciosPlanificados.map(servicio => Number(servicio.id)));

        // Anular en GalenHos las órdenes de servicios CPT que fueron retirados del plan
        for (const [idProdPrev, servicioPrevio] of mapaPrevios.entries()) {
            if (!productosNuevosSet.has(idProdPrev) && servicioPrevio.idOrden) {
                await facturacionAnulacionRepository.anularOrdenServicio({
                    idOrden: servicioPrevio.idOrden,
                    idEmpleado: nota.idEmpleado || 1,
                    observaciones: `CPT ${idProdPrev} eliminado de nota SOAPIE ${idNota}`,
                }, transaction);
            }
        }

        const serviciosRequest = transaction.request();
        serviciosRequest.input('idNotaPlanServicio', sql.Int, idNota);
        await serviciosRequest.query(`
            DELETE FROM dbo.NotaEnfermeriaPlanServicio
            WHERE IdNotaEnfermeria = @idNotaPlanServicio;
        `);

        let financiamientoCuenta = null;
        if (nota.idCuenta && nota.serviciosPlanificados.length > 0) {
            try {
                financiamientoCuenta = await cuentasAtencionRepository.obtenerFinanciamientoCuenta(
                    nota.idCuenta,
                    transaction,
                );
            } catch (errFin) {
                console.warn('No se pudo resolver el financiamiento de la cuenta:', errFin.message);
            }
        }

        for (const servicio of nota.serviciosPlanificados) {
            const idProd = typeof servicio === 'object' && servicio !== null ? Number(servicio.id) : Number(servicio);
            const servicioPrevio = mapaPrevios.get(idProd) || null;
            await insertarServicioPlanificado(
                transaction,
                idNota,
                servicio,
                { ...nota, idServicio: servicioId || nota.idServicio },
                servicioPrevio,
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

        const serviciosGuardadosRequest = transaction.request();
        serviciosGuardadosRequest.input('idNotaServiciosGuardados', sql.Int, idNota);
        const serviciosGuardadosResult = await serviciosGuardadosRequest.query(`
            SELECT
                servicioPlan.IdProducto,
                servicioPlan.CodigoServicio,
                servicioPlan.NombreServicio,
                COALESCE(despachoPlan.Cantidad, servicioPlan.Cantidad) AS Cantidad,
                COALESCE(despachoPlan.idDiagnostico, servicioPlan.IdAtencionDiagnostico) AS IdAtencionDiagnostico,
                COALESCE(diagnostico.CodigoCIE10, servicioPlan.CodigoCIE10) AS CodigoCIE10,
                servicioPlan.IdOrden,
                orden.IdEstadoFacturacion
            FROM dbo.NotaEnfermeriaPlanServicio AS servicioPlan
            LEFT JOIN dbo.FactOrdenServicio AS orden
                ON orden.IdOrden = servicioPlan.IdOrden
            LEFT JOIN dbo.FacturacionServicioDespacho AS despachoPlan
                ON despachoPlan.idOrden = servicioPlan.IdOrden
               AND despachoPlan.IdProducto = servicioPlan.IdProducto
            LEFT JOIN dbo.AtencionesDiagnosticos AS diagnosticoAtencion
                ON diagnosticoAtencion.IdAtencionDiagnostico = despachoPlan.idDiagnostico
            LEFT JOIN dbo.Diagnosticos AS diagnostico
                ON diagnostico.IdDiagnostico = diagnosticoAtencion.IdDiagnostico
            WHERE servicioPlan.IdNotaEnfermeria = @idNotaServiciosGuardados;
        `);
        const serviciosPlanificados = (serviciosGuardadosResult.recordset || []).map(servicio => ({
            id: Number(servicio.IdProducto),
            codigo: servicio.CodigoServicio,
            nombre: servicio.NombreServicio,
            cantidad: Number(servicio.Cantidad) || 1,
            idAtencionDiagnostico: servicio.IdAtencionDiagnostico == null
                ? null
                : Number(servicio.IdAtencionDiagnostico),
            codigoCIE10: servicio.CodigoCIE10 || null,
            idOrden: servicio.IdOrden == null ? null : Number(servicio.IdOrden),
            estadoFacturacion: servicio.IdEstadoFacturacion == null
                ? null
                : Number(servicio.IdEstadoFacturacion),
        }));

        await transaction.commit();
        return {
            id: idNota,
            vitalesRegistrados,
            servicioId,
            fechaHoraInicio,
            fechaHoraFin,
            serviciosPlanificados,
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

/**
 * Implementa la operación "sameVitales".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


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

/**
 * Implementa la operación "hasVitalValues".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


function hasVitalValues(vitals) {
    return Object.values(vitals).some(value => value !== null && value !== undefined && value !== '');
}

/**
 * Implementa la operación "saveDiagnosis".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */

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

async function obtenerDiagnosticoAtencion(transaction, idCuenta, idAtencionDiagnostico) {
    const request = transaction.request();
    request.input('idCuentaDiagnostico', sql.Int, idCuenta);
    request.input('idAtencionDiagnostico', sql.Int, idAtencionDiagnostico ?? null);
    const result = await request.query(`
        SELECT TOP (1)
            ad.IdAtencionDiagnostico,
            d.CodigoCIE10
        FROM dbo.Atenciones AS a
        INNER JOIN dbo.AtencionesDiagnosticos AS ad
            ON ad.IdAtencion = a.IdAtencion
        INNER JOIN dbo.SubclasificacionDiagnosticos AS s
            ON s.IdSubclasificacionDx = ad.IdSubclasificacionDx
        INNER JOIN dbo.Diagnosticos AS d
            ON d.IdDiagnostico = ad.IdDiagnostico
        WHERE a.IdCuentaAtencion = @idCuentaDiagnostico
          AND (
              @idAtencionDiagnostico IS NULL
              OR ad.IdAtencionDiagnostico = @idAtencionDiagnostico
          )
        ORDER BY
            CASE s.Codigo
                WHEN 'D' THEN 1
                WHEN 'R' THEN 2
                WHEN 'P' THEN 3
                ELSE 4
            END,
            ad.IdAtencionDiagnostico;
    `);
    return result.recordset?.[0] ?? null;
}

async function actualizarConsumosCpt(transaction, idCuenta, delta, idPuntoCarga = ID_PUNTO_CARGA_FALLBACK) {
    if (!idCuenta || !delta) return;

    const request = transaction.request();
    request.input('idCuentaConsumo', sql.Int, idCuenta);
    request.input('idPtoCargaConsumo', sql.Int, idPuntoCarga);
    const result = await request.query(`
        SELECT TotalConsumos, TotalPagos, TotalPagosReembolso
        FROM dbo.FacturacionCuentasAtencionPtos WITH (UPDLOCK, HOLDLOCK)
        WHERE IdCuentaAtencion = @idCuentaConsumo
          AND idPuntoCarga = @idPtoCargaConsumo;
    `);
    const registro = result.recordset?.[0];
    if (!registro && delta < 0) return;

    await cuentasAtencionRepository.actualizarCuentasAtencionPtos({
        esNueva: !registro,
        idCuentaAtencion: idCuenta,
        idPuntoCarga: idPuntoCarga,
        totalConsumos: Math.max(0, (Number(registro?.TotalConsumos) || 0) + delta),
        totalPagos: Number(registro?.TotalPagos) || 0,
        totalPagosReembolso: Number(registro?.TotalPagosReembolso) || 0,
    }, transaction);
}

async function actualizarServicioCptExistente(transaction, idOrden, idProducto, cantidad, idAtencionDiagnostico, metadata) {
    const request = transaction.request();
    request.input('idOrdenCpt', sql.Int, idOrden);
    request.input('idProductoCpt', sql.Int, idProducto);
    const result = await request.query(`
        SELECT
            orden.IdEstadoFacturacion,
            despacho.Cantidad,
            despacho.Precio,
            despacho.idDiagnostico
        FROM dbo.FactOrdenServicio AS orden WITH (UPDLOCK, HOLDLOCK)
        INNER JOIN dbo.FacturacionServicioDespacho AS despacho WITH (UPDLOCK, HOLDLOCK)
            ON despacho.idOrden = orden.IdOrden
        WHERE orden.IdOrden = @idOrdenCpt
          AND despacho.IdProducto = @idProductoCpt;
    `);
    const despacho = result.recordset?.[0];
    if (!despacho) {
        throw createRepositoryError(
            'CPT_ORDER_NOT_FOUND',
            `No se encontró el despacho del CPT ${idProducto} para la orden ${idOrden}.`,
        );
    }

    const estado = despacho.IdEstadoFacturacion == null
        ? null
        : Number(despacho.IdEstadoFacturacion);
    const cantidadAnterior = Number(despacho.Cantidad);
    const cantidadCambio = cantidad !== cantidadAnterior;
    const diagnosticoCambio = Number(despacho.idDiagnostico) !== idAtencionDiagnostico;
    if (!cantidadCambio && !diagnosticoCambio) return;

    if (estado === 4 && cantidadCambio) {
        throw createRepositoryError(
            'CPT_QUANTITY_LOCKED',
            `No se puede cambiar la cantidad del CPT ${idProducto} porque su orden ya está pagada.`,
        );
    }
    if (!Number.isInteger(estado) || estado === 9) {
        throw createRepositoryError(
            'CPT_ORDER_NOT_EDITABLE',
            `No se puede modificar el CPT ${idProducto} porque la orden está en estado ${estado}.`,
        );
    }

    const precio = Number(despacho.Precio) || 0;
    const updateRequest = transaction.request();
    updateRequest.input('idOrdenCptUpdate', sql.Int, idOrden);
    updateRequest.input('idProductoCptUpdate', sql.Int, idProducto);
    updateRequest.input('cantidadCptUpdate', sql.Int, cantidad);
    updateRequest.input('totalCptUpdate', sql.Money, precio * cantidad);
    updateRequest.input('diagnosticoCptUpdate', sql.Int, idAtencionDiagnostico);
    const updateResult = await updateRequest.query(`
        UPDATE dbo.FacturacionServicioDespacho
        SET Cantidad = @cantidadCptUpdate,
            Total = @totalCptUpdate,
            idDiagnostico = @diagnosticoCptUpdate
        WHERE idOrden = @idOrdenCptUpdate
          AND IdProducto = @idProductoCptUpdate;
        SELECT @@ROWCOUNT AS FilasActualizadas;
    `);
    if (updateResult.recordset?.[0]?.FilasActualizadas !== 1) {
        throw createRepositoryError(
            'CPT_ORDER_UPDATE_FAILED',
            `No se pudo actualizar el despacho del CPT ${idProducto}.`,
        );
    }

    if (cantidadCambio && estado !== 4) {
        const idPuntoCarga = resolverPuntoCargaServicio(metadata?.idServicio);
        await actualizarConsumosCpt(
            transaction,
            metadata.idCuenta,
            precio * (cantidad - cantidadAnterior),
            idPuntoCarga,
        );
    }
    await registrarAuditoria({
        idEmpleado: metadata.idEmpleado,
        accion: 'M',
        idRegistro: idOrden,
        tabla: 'FacturacionServicioDespacho',
        idListItem: 0,
        observaciones: `CPT ${idProducto} modificado desde nota SOAPIE`,
        throwOnError: true,
    }, transaction);
}

async function insertarServicioPlanificado(transaction, idNota, servicio, metadata = {}, servicioPrevio = null, financiamiento = null) {
    const idProducto = typeof servicio === 'object' && servicio !== null ? Number(servicio.id) : Number(servicio);
    const cantidad = typeof servicio === 'object' && servicio !== null ? (Number(servicio.cantidad) || 1) : 1;
    const idAtencionDiagnosticoParam = typeof servicio === 'object' && servicio !== null ? servicio.idAtencionDiagnostico : null;

    if (!metadata.idCuenta) {
        throw createRepositoryError(
            'CPT_ACCOUNT_REQUIRED',
            `No se puede registrar el CPT ${idProducto} en SISGalen porque la nota no tiene una cuenta de atención.`,
        );
    }

    const idDiagnosticoSolicitado = idAtencionDiagnosticoParam
        ?? servicioPrevio?.idAtencionDiagnostico
        ?? null;
    const diagnostico = await obtenerDiagnosticoAtencion(
        transaction,
        metadata.idCuenta,
        idDiagnosticoSolicitado,
    );
    if (!diagnostico) {
        throw createRepositoryError(
            idDiagnosticoSolicitado ? 'CPT_DIAGNOSIS_INVALID' : 'CPT_DIAGNOSIS_REQUIRED',
            idDiagnosticoSolicitado
                ? `El diagnóstico seleccionado para el CPT ${idProducto} no pertenece a la cuenta de atención.`
                : `La cuenta de atención no tiene diagnósticos para asociar al CPT ${idProducto}.`,
        );
    }

    let idOrdenAsignado = servicioPrevio?.idOrden || null;
    if (idOrdenAsignado) {
        await actualizarServicioCptExistente(
            transaction,
            idOrdenAsignado,
            idProducto,
            cantidad,
            Number(diagnostico.IdAtencionDiagnostico),
            metadata,
        );
    } else {
        const idTipoFinanciamiento = Number(financiamiento?.idTipoFinanciamiento)
            || ID_TIPO_FINANCIAMIENTO_FALLBACK;
        const idFuenteFinanciamiento = financiamiento?.idFuenteFinanciamiento ?? null;
        const generaPago = Number(financiamiento?.generaPago) === 1;

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
            console.warn(
                `CPT ${idProducto} sin precio válido para el financiamiento ${idTipoFinanciamiento}; no se crea la orden.`,
            );
        } else {
            const idPuntoCarga = resolverPuntoCargaServicio(metadata.idServicio);
            const galenRequest = transaction.request();
            galenRequest.output('IdOrden', sql.Int);
            galenRequest.input('IdPuntoCarga', sql.Int, idPuntoCarga);
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

            if (!Number.isInteger(Number(idOrden)) || Number(idOrden) < 1) {
                throw createRepositoryError(
                    'CPT_ORDER_CREATION_FAILED',
                    `GalenHos no devolvió un IdOrden al registrar el CPT ${idProducto}.`,
                );
            }

            idOrdenAsignado = Number(idOrden);

            // Despacho oficial del CPT mediante el procedimiento de SIGH
            await facturacionRepository.agregarServicioDespacho({
                idOrden: idOrdenAsignado,
                idProducto,
                cantidad,
                precio,
                total: precio * cantidad,
                labConfHIS: '',
                grupoHIS: 0,
                subGrupoHIS: 0,
                idUsuarioAuditoria: metadata.idEmpleado || 1,
                idReceta: metadata.idReceta ?? null,
                idDiagnostico: Number(diagnostico.IdAtencionDiagnostico),
            }, transaction);

            if (generaPago) {
                // Particular
                const idOrdenPago = await facturacionPagosRepository.agregarOrdenServicioPago({
                    idComprobantePago: null,
                    idOrden: idOrdenAsignado,
                    fechaCreacion: metadata.fechaInicio || new Date(),
                    idUsuario: metadata.idEmpleado || 1,
                    idEstadoFacturacion: 1,
                    importeExonerado: 0,
                    idUsuarioExonera: null,
                    idUsuarioAuditoria: metadata.idEmpleado || 1,
                }, transaction);

                if (idOrdenPago) {
                    await facturacionPagosRepository.agregarServicioPago({
                        idOrdenPago,
                        idProducto,
                        cantidad,
                        precio,
                        total: precio * cantidad,
                        idUsuarioAuditoria: metadata.idEmpleado || 1,
                    }, transaction);
                }
            } else {
                // SIS, Estrategia, Convenios
                await facturacionFinanciamientosRepository.agregarServicioFinanciamiento({
                    idOrden: idOrdenAsignado,
                    idProducto,
                    idTipoFinanciamiento,
                    idFuenteFinanciamiento,
                    cantidadFinanciada: cantidad,
                    precioFinanciado: precio,
                    totalFinanciado: precio * cantidad,
                    fechaAutoriza: metadata.fechaInicio || new Date(),
                    idUsuarioAutoriza: metadata.idEmpleado || 1,
                    idUsuarioAuditoria: metadata.idEmpleado || 1,
                }, transaction);
            }

            // Auditoría oficial de GalenHos
            await registrarAuditoria({
                idEmpleado: metadata.idEmpleado,
                accion: 'A',
                idRegistro: idOrdenAsignado,
                tabla: 'FactOrdenServicio',
                idListItem: 0,
                observaciones: `CPT ${idProducto} generado desde nota enfermeria`,
                throwOnError: true,
            }, transaction);

            // Actualizar saldos por punto de carga
            if (precio > 0) {
                await actualizarConsumosCpt(
                    transaction,
                    metadata.idCuenta,
                    precio * cantidad,
                    idPuntoCarga,
                );
            }
        }
    }

    const request = transaction.request();
    request.input('idNotaPlanServicio', sql.Int, idNota);
    request.input('idProductoPlanServicio', sql.Int, idProducto);
    request.input('idOrdenPlanServicio', sql.Int, idOrdenAsignado || null);
    request.input('cantidadPlanServicio', sql.Int, servicio.cantidad);
    request.input('idAtencionDiagnosticoPlanServicio', sql.Int, diagnostico.IdAtencionDiagnostico);
    request.input('codigoCIE10PlanServicio', sql.VarChar(10), diagnostico.CodigoCIE10);
    const result = await request.query(`
        INSERT INTO dbo.NotaEnfermeriaPlanServicio (
            IdNotaEnfermeria, IdProducto, CodigoServicio, NombreServicio, IdOrden,
            Cantidad, IdAtencionDiagnostico, CodigoCIE10
        )
        SELECT
            @idNotaPlanServicio,
            servicio.IdProducto,
            servicio.Codigo,
            servicio.Nombre,
            @idOrdenPlanServicio,
            @cantidadPlanServicio,
            @idAtencionDiagnosticoPlanServicio,
            @codigoCIE10PlanServicio
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

/**
 * Implementa la operación "insertCarePlanNoc".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


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

/**
 * Implementa la operación "insertCarePlanNic".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


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
        servicioPlan.IdOrden AS PlanServicioIdOrden,
        COALESCE(despachoPlan.Cantidad, servicioPlan.Cantidad) AS PlanServicioCantidad,
        COALESCE(despachoPlan.idDiagnostico, servicioPlan.IdAtencionDiagnostico) AS PlanServicioIdAtencionDiagnostico,
        COALESCE(diagnosticoPlan.CodigoCIE10, servicioPlan.CodigoCIE10) AS PlanServicioCodigoCIE10,
        ordenServicio.IdEstadoFacturacion AS PlanServicioEstadoFacturacion
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
    LEFT JOIN dbo.FactOrdenServicio AS ordenServicio
        ON ordenServicio.IdOrden = servicioPlan.IdOrden
    LEFT JOIN dbo.FacturacionServicioDespacho AS despachoPlan
        ON despachoPlan.idOrden = servicioPlan.IdOrden
       AND despachoPlan.IdProducto = servicioPlan.IdProducto
    LEFT JOIN dbo.AtencionesDiagnosticos AS diagnosticoAtencionPlan
        ON diagnosticoAtencionPlan.IdAtencionDiagnostico = despachoPlan.idDiagnostico
    LEFT JOIN dbo.Diagnosticos AS diagnosticoPlan
        ON diagnosticoPlan.IdDiagnostico = diagnosticoAtencionPlan.IdDiagnostico
`;

/**
 * Implementa la operación "getAllNotas".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


async function getAllNotas() {
    return dbHelper.query(`${NOTAS_QUERY} ORDER BY n.Fecha_Hora_Inicio DESC, n.IdNotaEnfermeria DESC;`);
}

/**
 * Implementa la operación "getNotasPorPaciente".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */

async function getNotasPorPaciente(idPaciente) {
    return dbHelper.query(
        `${NOTAS_QUERY} WHERE n.IdPaciente = @idPaciente ORDER BY n.Fecha_Hora_Inicio DESC, n.IdNotaEnfermeria DESC;`,
        [{ name: 'idPaciente', type: sql.Int, value: idPaciente }]
    );
}

/**
 * Implementa la operación "getHistorialVitals".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */

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

/**
 * Implementa la operación "getHistorialVitalsPorAtencion".
 * Mantiene aislada la responsabilidad principal de este archivo.
 */


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
