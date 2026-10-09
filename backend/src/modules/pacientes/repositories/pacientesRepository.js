// Repositorio de pacientes.
// Esta capa encapsula la consulta SQL y expone una interfaz para el servicio.
// La idea es esconder los detalles de SQL Server del dominio clínico.

const sql = require('mssql');
const { query } = require('../../../../dbHelper');

async function getPacientesByServicio(servicioId = null) {
    try {
        console.log('--- Ejecutando Query de Pacientes ---', { servicioId });

        let sqlQuery = `
            SELECT *
            FROM (
                SELECT DISTINCT
                    c.IdCama,
                    s.IdProducto,
                    p.IdPaciente,
                    CASE
                        WHEN p.IdPaciente IS NULL THEN NULL
                        ELSE a.IdCuentaAtencion
                    END AS IdCuentaAtencion,
                    REPLACE(c.Codigo, ' ', '') AS Codigo,
                    ec.Descripcion AS estadoCama,
                    t.Descripcion AS TipoCama,
                    UPPER(LTRIM(RTRIM(
                        ISNULL(p.ApellidoPaterno, '') + ' ' +
                        ISNULL(p.ApellidoMaterno, '') + ' ' +
                        ISNULL(p.PrimerNombre, '') + ' ' +
                        ISNULL(p.SegundoNombre, '') + ' ' +
                        ISNULL(p.TercerNombre, '')
                    ))) AS Pacientes,
                    p.NroHistoriaClinica,
                    ed.Edad,
                    ed.TipoEdad,
                    s.IdEspecialidad,
                    s.Nombre,
                    ROW_NUMBER() OVER (
                        PARTITION BY REPLACE(c.Codigo, ' ', '')
                        ORDER BY CASE WHEN c.IdEstadoCama = 1 THEN 2 ELSE 1 END
                    ) AS rn
                FROM Camas c
                LEFT JOIN EstadosCama ec ON ec.IdEstadoCama = c.IdEstadoCama
                LEFT JOIN TiposCama t ON t.IdTipoCama = c.IdTiposCama
                LEFT JOIN Pacientes p ON p.IdPaciente = c.IdPaciente
                LEFT JOIN Servicios s ON s.IdServicio = c.IdServicioPropietario
                LEFT JOIN (
                    SELECT a.IdPaciente, MAX(a.IdAtencion) AS IdCuentaAtencion
                    FROM Atenciones a
                    WHERE a.IdTipoServicio IN (3)
                    GROUP BY a.IdPaciente
                ) a ON a.IdPaciente = c.IdPaciente
                LEFT JOIN (
                    SELECT IdPaciente, Edad, TipoEdad
                    FROM (
                        SELECT a.IdPaciente, a.Edad,
                            tp.Descripcion AS TipoEdad,
                            ROW_NUMBER() OVER (
                                PARTITION BY a.IdPaciente
                                ORDER BY a.Edad DESC
                            ) AS rn
                        FROM Atenciones a WITH (NOLOCK)
                        INNER JOIN TiposEdad tp ON tp.IdTipoEdad = a.IdTipoEdad
                        WHERE IdTipoServicio = 3
                    ) x
                    WHERE rn = 1
                ) ed ON ed.IdPaciente = p.IdPaciente
                WHERE s.IdTipoServicio = 3
        `;

        const params = [];

        if (servicioId && servicioId !== 'todos') {
            params.push({
                name: 'ServicioId',
                type: sql.Int,
                value: Number(servicioId),
            });
            sqlQuery += ' AND c.IdServicioPropietario = @ServicioId ';
        }

        sqlQuery += `
            ) x
            WHERE rn = 1
            ORDER BY Codigo
        `;

        const result = await query(sqlQuery, params);
        console.log('Resultado obtenido (filas):', result.recordset.length);
        return result.recordset || [];
    } catch (error) {
        console.error('Error en pacientesRepository.getPacientesByServicio:', error.message);
        throw error;
    }
}

async function getServicios() {
    try {
        console.log('--- Ejecutando Query de Servicios ---');

        const result = await query(`
            SELECT 
                MAX(s.IdServicio) AS IdServicio,
                CASE 
                    WHEN s.Nombre LIKE '%GINECOLOGIA Y OBSTETRIC%' THEN 'HOSPITALIZACION GINECOLOGIA Y OBSTETRICIA'
                    ELSE s.Nombre 
                END AS Nombre
            FROM Camas c
            INNER JOIN Servicios s ON s.IdServicio = c.IdServicioPropietario
            WHERE s.IdTipoServicio = 3 AND s.Nombre IS NOT NULL
            GROUP BY 
                CASE 
                    WHEN s.Nombre LIKE '%GINECOLOGIA Y OBSTETRIC%' THEN 'HOSPITALIZACION GINECOLOGIA Y OBSTETRICIA'
                    ELSE s.Nombre 
                END
            ORDER BY Nombre
        `);

        return result.recordset || [];
    } catch (error) {
        console.error('Error en pacientesRepository.getServicios:', error.message);
        throw error;
    }
}

// Búsqueda global y ágil de pacientes para el buscador del frontend.
// Coincide por nombre completo, DNI (NroDocumento), historia clínica o número de cuenta.
// Devuelve, si la hay, la atención, el servicio actual y la cama/estancia del paciente.
//
// Estrategia de rendimiento: primero se buscan los IDs candidatos con filtros
// simples (sin subconsultas correlacionadas por fila) y recién después se
// enriquece cada resultado. Así no se aplican los OUTER APPLY a toda Pacientes.
//
// Importante: el "servicio actual" se calcula igual que en la tabla
// "Pacientes Sin Cama": se prioriza la estancia pendiente (LlegoAlServicio = 0
// con facturación en estado 12) y, si no la hay, la cama ocupada.
async function buscarPacientes(texto) {
    try {
        const like = `%${texto}%`;
        const prefijo = `${texto}%`;
        const esNumerico = /^[0-9]+$/.test(texto);

        const params = [
            { name: 'like', type: sql.VarChar, value: like },
        ];

        // Cada rama devuelve como máximo 20 IDs; el total de candidatos es chico.
        const nombreCompleto = `
            ISNULL(p.ApellidoPaterno, '') + ' ' +
            ISNULL(p.ApellidoMaterno, '') + ' ' +
            ISNULL(p.PrimerNombre, '') + ' ' +
            ISNULL(p.SegundoNombre, '') + ' ' +
            ISNULL(p.TercerNombre, '')`;

        // Rama 1: pacientes hospitalizados (con cama o con estancia pendiente)
        // que coinciden por nombre. Se buscan primero para que aparezcan arriba
        // y no queden fuera del TOP por orden alfabético.
        const ramas = [
            `SELECT TOP 20 p.IdPaciente
             FROM Pacientes p
             WHERE (${nombreCompleto}) LIKE @like
               AND (
                   EXISTS (SELECT 1 FROM Camas c WHERE c.IdPaciente = p.IdPaciente)
                   OR EXISTS (
                       SELECT 1
                       FROM AtencionesEstanciaHospitalaria e
                       INNER JOIN Atenciones a ON a.IdCuentaAtencion = e.IdAtencion
                       WHERE a.IdPaciente = p.IdPaciente
                         AND a.idEstadoAtencion = 1
                         AND e.LlegoAlServicio = 0
                   )
               )`,
            // Rama 2: cualquier paciente que coincida por nombre.
            `SELECT TOP 20 p.IdPaciente
             FROM Pacientes p
             WHERE (${nombreCompleto}) LIKE @like`,
        ];

        if (esNumerico) {
            params.push({ name: 'prefijo', type: sql.VarChar, value: prefijo });
            ramas.push(
                `SELECT TOP 20 p.IdPaciente
                 FROM Pacientes p
                 WHERE p.NroDocumento LIKE @prefijo
                    OR CAST(p.NroHistoriaClinica AS varchar(20)) LIKE @prefijo`,
                `SELECT TOP 20 a.IdPaciente
                 FROM Atenciones a
                 WHERE CAST(a.IdCuentaAtencion AS varchar(20)) LIKE @prefijo`
            );
        }

        const candidatos = ramas.join('\n                UNION ALL\n                ');

        const result = await query(`
            WITH candidatos AS (
                ${candidatos}
            )
            SELECT TOP 20
                p.IdPaciente,
                LTRIM(RTRIM(
                    ISNULL(p.ApellidoPaterno, '') + ' ' +
                    ISNULL(p.ApellidoMaterno, '') + ' ' +
                    ISNULL(p.PrimerNombre, '') + ' ' +
                    ISNULL(p.SegundoNombre, '') + ' ' +
                    ISNULL(p.TercerNombre, '')
                )) AS Paciente,
                p.NroDocumento AS Dni,
                p.NroHistoriaClinica AS Historia,
                COALESCE(pendiente.IdServicio, cama.IdServicioPropietario) AS IdServicio,
                COALESCE(spendiente.Nombre, scama.Nombre) AS Servicio,
                CASE WHEN pendiente.Cuenta IS NULL THEN cama.Codigo ELSE NULL END AS Cama,
                COALESCE(pendiente.Cuenta, atencion.IdCuentaAtencion) AS IdCuentaAtencion
            FROM (SELECT DISTINCT IdPaciente FROM candidatos) cand
            INNER JOIN Pacientes p ON p.IdPaciente = cand.IdPaciente
            OUTER APPLY (
                -- Estancia pendiente de cama (paciente sin cama), la misma que
                -- usa la tabla "Pacientes Sin Cama".
                SELECT TOP 1 e.IdAtencion AS Cuenta, e.IdServicio
                FROM AtencionesEstanciaHospitalaria e
                INNER JOIN Atenciones a ON a.IdCuentaAtencion = e.IdAtencion
                INNER JOIN FacturacionCuentasAtencion f ON f.IdCuentaAtencion = a.IdCuentaAtencion
                WHERE a.IdPaciente = p.IdPaciente
                  AND a.idEstadoAtencion = 1
                  AND e.LlegoAlServicio = 0
                  AND f.IdEstado = 12
                ORDER BY e.Secuencia DESC, e.FechaOcupacion DESC
            ) pendiente
            LEFT JOIN Servicios spendiente ON spendiente.IdServicio = pendiente.IdServicio
            OUTER APPLY (
                SELECT TOP 1 c.IdCama, c.Codigo, c.IdServicioPropietario
                FROM Camas c
                WHERE c.IdPaciente = p.IdPaciente
                ORDER BY c.IdCama DESC
            ) cama
            LEFT JOIN Servicios scama ON scama.IdServicio = cama.IdServicioPropietario
            OUTER APPLY (
                SELECT TOP 1 a.IdAtencion, a.IdCuentaAtencion
                FROM Atenciones a
                WHERE a.IdPaciente = p.IdPaciente AND a.idEstadoAtencion = 1
                ORDER BY a.FechaIngreso DESC, a.IdAtencion DESC
            ) atencion
            ORDER BY
                CASE WHEN COALESCE(pendiente.IdServicio, cama.IdServicioPropietario) IS NOT NULL THEN 0 ELSE 1 END,
                p.ApellidoPaterno, p.ApellidoMaterno, p.PrimerNombre;
        `, params);

        return result.recordset || [];
    } catch (error) {
        console.error('Error en pacientesRepository.buscarPacientes:', error.message);
        throw error;
    }
}

module.exports = {
    getPacientesByServicio,
    getServicios,
    buscarPacientes,
};
